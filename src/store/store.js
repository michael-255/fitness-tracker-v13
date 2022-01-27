import Vue from 'vue'
import Vuex from 'vuex'
import LocalStorage from '../utils/local-storage.js'
import createDefaultEntityData from '../utils/defaults-generator.js'
import { Record } from '../models/Entities.js'
import { ENTITY_KEY } from '../constants/globals.js'

Vue.use(Vuex)

/**
 * The entities that make up the app state.
 * Use the ENTITY_KEY constant when accessing.
 */
const defaultState = () => ({
  [ENTITY_KEY.measurements]: [],
  [ENTITY_KEY.exercises]: [],
  [ENTITY_KEY.workouts]: [],
})

export default new Vuex.Store({
  state: defaultState(),

  mutations: {
    SET_MEASUREMENTS(state, payload) {
      state[ENTITY_KEY.measurements] = payload
    },
    SET_EXERCISES(state, payload) {
      state[ENTITY_KEY.exercises] = payload
    },
    SET_WORKOUTS(state, payload) {
      state[ENTITY_KEY.workouts] = payload
    },
    CLEAR_STATE(state) {
      Object.assign(state, defaultState())
    },
  },

  actions: {
    /**
     * Initializes local storage if needed, then saturates the app state from
     * it if any data is found there.
     */
    startApp({ commit }) {
      LocalStorage.initializeByKeys(Object.keys(ENTITY_KEY))
      commit('SET_MEASUREMENTS', LocalStorage.get(ENTITY_KEY.measurements))
      commit('SET_EXERCISES', LocalStorage.get(ENTITY_KEY.exercises))
      commit('SET_WORKOUTS', LocalStorage.get(ENTITY_KEY.workouts))
    },

    /**
     * Resets app to clean state by removing all app data.
     * This includes the state and local storage.
     */
    clearAppData({ commit }) {
      LocalStorage.clearByKeys(Object.keys(ENTITY_KEY))
      commit('CLEAR_STATE')
    },

    /**
     * Generate the initial default app data for the state and local storage.
     */
    setDefaultAppData({ commit }) {
      const { measurements, exercises, workouts } = createDefaultEntityData()
      LocalStorage.overwrite(ENTITY_KEY.measurements, measurements)
      LocalStorage.overwrite(ENTITY_KEY.exercises, exercises)
      LocalStorage.overwrite(ENTITY_KEY.workouts, workouts)
      commit('SET_MEASUREMENTS', measurements)
      commit('SET_EXERCISES', exercises)
      commit('SET_WORKOUTS', workouts)
    },

    beginNewWorkout({ commit }, payload) {
      const { workoutId, exerciseIds } = payload
      const newExerciseRecords = exerciseIds.map(
        (eid) => new Record({ associatedEntityId: eid })
      )
      const newWorkoutRecord = new Record({ associatedEntityId: workoutId })
      commit('SET_ENTITY_KEY', {
        entity: ENTITY_KEY.activeExercises,
        data: newExerciseRecords,
      })
      commit('SET_ENTITY_KEY', {
        entity: ENTITY_KEY.activeWorkout,
        data: [newWorkoutRecord],
      })
      LocalStorage.overwrite(ENTITY_KEY.activeExercises, newExerciseRecords)
      LocalStorage.overwrite(ENTITY_KEY.activeWorkout, [newWorkoutRecord])
    },
  },

  getters: {
    isMeasurmentStateReady(state) {
      const entityState = state[ENTITY_KEY.measurements]
      return (
        entityState !== null &&
        entityState !== undefined &&
        Array.isArray(entityState) &&
        entityState.length !== 0
      )
    },

    isExerciseStateReady(state) {
      const entityState = state[ENTITY_KEY.exercises]
      return (
        entityState !== null &&
        entityState !== undefined &&
        Array.isArray(entityState) &&
        entityState.length !== 0
      )
    },

    isWorkoutStateReady(state) {
      const entityState = state[ENTITY_KEY.workouts]
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

    getPreviousWorkoutRecord: (state) => (workoutId) => {
      const workoutEntity = state[ENTITY_KEY.workouts].find(
        (w) => w.id === workoutId
      )
      const sortedRecords = workoutEntity.records.sort((a, b) => {
        b.createdAt - a.createdAt
      })
      return sortedRecords[0]
    },

    getPreviousExerciseRecord: (state) => (exerciseId) => {
      const exerciseEntity = state[ENTITY_KEY.exercises].find(
        (e) => e.id === exerciseId
      )
      const sortedRecords = exerciseEntity.records.sort((a, b) => {
        b.createdAt - a.createdAt
      })
      return sortedRecords[0]
    },
  },

  modules: {},
})
