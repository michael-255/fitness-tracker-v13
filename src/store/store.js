import Vue from 'vue'
import Vuex from 'vuex'
import LocalStorage from '../utils/local-storage.js'
import createDefaultEntityData from '../utils/defaults-generator.js'
import { Record } from '../models/Entities.js'
import { ENTITY } from '../constants/globals.js'

Vue.use(Vuex)

/**
 * The entities that make up the app state.
 * Use the ENTITY constant when accessing.
 */
const defaultState = () => ({
  [ENTITY.measurements]: [],
  [ENTITY.exercises]: [],
  [ENTITY.workouts]: [],
  [ENTITY.measurementRecords]: [],
  [ENTITY.exerciseRecords]: [],
  [ENTITY.workoutRecords]: [],
  [ENTITY.activeExercises]: [],
  [ENTITY.activeWorkout]: [],
})

export default new Vuex.Store({
  state: defaultState(),

  mutations: {
    SET_ENTITY(state, payload) {
      const { entity, data } = payload
      state[entity] = data
    },
    CLEAR_STATE(state) {
      Object.assign(state, defaultState())
    },
  },

  // ACTIONS ------------------------------------------------------------------
  actions: {
    /**
     * Initializes local storage if needed, then saturates the app state from
     * it if any data is found there.
     */
    startApp({ commit }) {
      const entityKeys = Object.keys(ENTITY)
      LocalStorage.initializeByKeys(entityKeys)
      entityKeys.forEach((entity) => {
        const data = LocalStorage.get(entity)
        commit('SET_ENTITY', { entity, data })
      })
    },

    /**
     * Resets app to clean state by removing all app data.
     * This includes the state and local storage.
     */
    clearAppData({ commit }) {
      LocalStorage.clearByKeys(Object.keys(ENTITY))
      commit('CLEAR_STATE')
    },

    /**
     * Generate the initial default app data for the state and local storage.
     */
    setDefaultAppData({ commit }) {
      const entityDefaults = createDefaultEntityData()
      const entityKeys = Object.keys(entityDefaults)
      entityKeys.forEach((entity) => {
        const data = entityDefaults[entity]
        LocalStorage.overwrite(entity, data)
        commit('SET_ENTITY', { entity, data })
      })
    },

    beginNewWorkout({ commit }, workout) {
      const { id, exerciseIds } = workout
      const newExerciseRecords = exerciseIds.map(
        (eid) => new Record({ entityId: eid })
      )
      const newWorkoutRecord = new Record({ entityId: id })

      commit('SET_ENTITY', {
        entity: ENTITY.activeExercises,
        data: newExerciseRecords,
      })
      commit('SET_ENTITY', {
        entity: ENTITY.activeWorkout,
        data: [newWorkoutRecord],
      })
      LocalStorage.overwrite(ENTITY.activeExercises, newExerciseRecords)
      LocalStorage.overwrite(ENTITY.activeWorkout, [newWorkoutRecord])
    },
  },

  // GETTERS ------------------------------------------------------------------
  getters: {
    isStateReady: (state) => (entity) => {
      const entityState = state[entity]

      return (
        entityState !== null &&
        entityState !== undefined &&
        Array.isArray(entityState) &&
        entityState.length !== 0
      )
    },

    getState: (state) => (entity) => {
      return state[entity]
    },

    getPreviousExerciseRecord: (state) => (exerciseId) => {
      console.log(state, exerciseId)
    },

    getPreviousWorkoutRecord: (state) => (workoutId) => {
      console.log(state, workoutId)
    },

    getPreviousWorkoutRecordCreatedDate: (state) => (workoutId) => {
      console.log(state, workoutId)
    },

    getPreviousWorkoutRecordDuration: (state) => (workoutId) => {
      console.log(state, workoutId)
    },

    // How to get the latest record...
    // getPreviousWorkoutRecord: (state) => (workoutId) => {
    //   const workoutEntity = state[ENTITY.workouts].find(
    //     (w) => w.id === workoutId
    //   )
    //   const sortedRecords = workoutEntity.records.sort((a, b) => {
    //     b.createdAt - a.createdAt
    //   })
    //   return sortedRecords[0]
    // },
  },

  modules: {},
})
