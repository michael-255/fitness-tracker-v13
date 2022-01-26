import Vue from 'vue'
import Vuex from 'vuex'
import { LocalStorage } from '../utils/local-storage.js'
import { getDefaultEntities } from '../utils/defaults-generator.js'
import { ENTITY } from '../constants/globals.js'

Vue.use(Vuex)

const defaultState = () => ({
  [ENTITY.measurements]: {},
  [ENTITY.exercises]: {},
  [ENTITY.workouts]: {},
  [ENTITY.measurementRecords]: {},
  [ENTITY.exerciseRecords]: {},
  [ENTITY.workoutRecords]: {},
  [ENTITY.activeExerciseRecords]: {},
  [ENTITY.activeWorkoutRecords]: {},
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
      LocalStorage.init(ENTITY.measurements, {})
      LocalStorage.init(ENTITY.exercises, {})
      LocalStorage.init(ENTITY.workouts, {})
      LocalStorage.init(ENTITY.measurementRecords, {})
      LocalStorage.init(ENTITY.exerciseRecords, {})
      LocalStorage.init(ENTITY.workoutRecords, {})
      LocalStorage.init(ENTITY.activeExerciseRecords, {})
      LocalStorage.init(ENTITY.activeWorkoutRecords, {})
      commit('SET_ENTITY', {
        entity: ENTITY.measurements,
        data: LocalStorage.get(ENTITY.measurements),
      })
      commit('SET_ENTITY', {
        entity: ENTITY.exercises,
        data: LocalStorage.get(ENTITY.exercises),
      })
      commit('SET_ENTITY', {
        entity: ENTITY.workouts,
        data: LocalStorage.get(ENTITY.workouts),
      })
      commit('SET_ENTITY', {
        entity: ENTITY.measurementRecords,
        data: LocalStorage.get(ENTITY.measurementRecords),
      })
      commit('SET_ENTITY', {
        entity: ENTITY.exerciseRecords,
        data: LocalStorage.get(ENTITY.exerciseRecords),
      })
      commit('SET_ENTITY', {
        entity: ENTITY.workoutRecords,
        data: LocalStorage.get(ENTITY.workoutRecords),
      })
      commit('SET_ENTITY', {
        entity: ENTITY.activeExerciseRecords,
        data: LocalStorage.get(ENTITY.activeExerciseRecords),
      })
      commit('SET_ENTITY', {
        entity: ENTITY.activeWorkoutRecords,
        data: LocalStorage.get(ENTITY.activeWorkoutRecords),
      })
    },

    defaultApp({ commit }) {
      let entityDefaults = getDefaultEntities()
      LocalStorage.overwrite(ENTITY.measurements, entityDefaults.measurements)
      LocalStorage.overwrite(ENTITY.exercises, entityDefaults.exercises)
      LocalStorage.overwrite(ENTITY.workouts, entityDefaults.workouts)
      LocalStorage.init(ENTITY.measurementRecords, {})
      LocalStorage.init(ENTITY.exerciseRecords, {})
      LocalStorage.init(ENTITY.workoutRecords, {})
      LocalStorage.init(ENTITY.activeExerciseRecords, {})
      LocalStorage.init(ENTITY.activeWorkoutRecords, {})
      commit('SET_ENTITY', {
        entity: ENTITY.measurements,
        data: entityDefaults.measurements,
      })
      commit('SET_ENTITY', {
        entity: ENTITY.exercises,
        data: entityDefaults.exercises,
      })
      commit('SET_ENTITY', {
        entity: ENTITY.workouts,
        data: entityDefaults.workouts,
      })
    },

    clearApp({ commit }) {
      LocalStorage.clear(ENTITY.measurements, {})
      LocalStorage.clear(ENTITY.exercises, {})
      LocalStorage.clear(ENTITY.workouts, {})
      LocalStorage.clear(ENTITY.measurementRecords, {})
      LocalStorage.clear(ENTITY.exerciseRecords, {})
      LocalStorage.clear(ENTITY.workoutRecords, {})
      LocalStorage.clear(ENTITY.activeExerciseRecords, {})
      LocalStorage.clear(ENTITY.activeWorkoutRecords, {})
      commit('CLEAR_STATE')
    },

    loadActiveWorkoutFromStorage() {
      console.log('loadActiveWorkoutFromStorage')
    },
  },

  getters: {
    isEntityStateReady: (state) => (entity) => {
      return (
        typeof state[entity] === 'object' &&
        !Array.isArray(state[entity]) &&
        state[entity] !== null &&
        state[entity] !== undefined &&
        Object.keys(state[entity]).length > 0
      )
    },

    getEntityState: (state) => (entity) => {
      return state[entity]
    },
  },

  modules: {},
})
