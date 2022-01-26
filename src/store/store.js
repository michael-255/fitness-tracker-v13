import Vue from 'vue'
import Vuex from 'vuex'
import { LocalStorage } from '../utils/local-storage.js'
import { getDefaultEntities } from '../utils/defaults-generator.js'
import { ENTITY } from '../constants/globals.js'

Vue.use(Vuex)

const defaultState = () => ({
  [ENTITY.measurements]: [],
  [ENTITY.exercises]: [],
  [ENTITY.workouts]: [],
  [ENTITY.measurementRecords]: [],
  [ENTITY.exerciseRecords]: [],
  [ENTITY.workoutRecords]: [],
  [ENTITY.activeExerciseRecords]: [],
  [ENTITY.activeWorkoutRecords]: [],
})

export default new Vuex.Store({
  state: defaultState(),

  mutations: {
    /**
     * SET_ENTITY commits must include a payload object with the entity and data as properties:
     * { entity: ENTITY.example, data: {...} }
     */
    SET_ENTITY: (state, entityPayload) => {
      state[entityPayload.entity] = entityPayload.data
    },
    CLEAR_STATE(state) {
      Object.assign(state, defaultState())
    },
  },

  actions: {
    initApp({ commit }) {
      const entities = Object.keys(ENTITY)

      LocalStorage.initializeByKeys(entities)

      entities.forEach((entity) => {
        commit('SET_ENTITY', { entity, data: LocalStorage.get(entity) })
      })
    },

    defaultApp({ commit }) {
      const entityDefaults = getDefaultEntities()

      const defaultedEntities = [
        ENTITY.measurements,
        ENTITY.exercises,
        ENTITY.workouts,
      ]

      const remainingEntities = [
        ENTITY.measurementRecords,
        ENTITY.exerciseRecords,
        ENTITY.workoutRecords,
        ENTITY.activeExerciseRecords,
        ENTITY.activeWorkoutRecords,
      ]

      defaultedEntities.forEach((entity) => {
        LocalStorage.overwrite(entity, entityDefaults[entity])
        commit('SET_ENTITY', { entity, data: entityDefaults[entity] })
      })

      LocalStorage.initializeByKeys(remainingEntities)
    },

    clearApp({ commit }) {
      LocalStorage.clearByKeys(Object.keys(ENTITY))
      commit('CLEAR_STATE')
    },

    setStateWithActiveWorkoutFromStorage({ commit, getters }) {
      const activeWorkoutInState = getters.isEntityStateReady(
        ENTITY.activeWorkoutRecords
      )

      if (!activeWorkoutInState) {
        commit('SET_ENTITY', {
          entity: ENTITY.activeWorkoutRecords,
          data: LocalStorage.get(ENTITY.activeWorkoutRecords),
        })
      }
    },
  },

  getters: {
    isEntityStateReady: (state) => (entity) => {
      return (
        state[entity] !== null &&
        state[entity] !== undefined &&
        Array.isArray(state[entity]) &&
        state[entity].length !== 0
      )
    },

    getEntityState: (state) => (entity) => {
      return state[entity]
    },

    /**
     * @todo INCOMPLETE (Sorted data? First record?)
     */
    getPreviousWorkoutDateById: (state) => (workoutId) => {
      const previousWorkoutDate = state[ENTITY.workoutRecords].find(
        (wr) => wr.id === workoutId
      )?.createdAt

      if (!previousWorkoutDate) {
        return 'No previous record'
      } else {
        return new Date(previousWorkoutDate)
      }
    },

    /**
     * @todo INCOMPLETE (Sorted data? First record?)
     */
    getPreviousWorkoutDurationById: (state) => (workoutId) => {
      return (
        state[ENTITY.workoutRecords].find((wr) => {
          wr.id === workoutId
        })?.data?.duration ?? '-'
      )
    },
  },

  modules: {},
})
