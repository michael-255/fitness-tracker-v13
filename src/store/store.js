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
    startApp({ dispatch }) {
      const entityKeys = Object.keys(ENTITY)
      LocalStorage.initializeByKeys(entityKeys)
      dispatch('refreshStateFromStorage', entityKeys)
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

    /**
     * Loads entities storage data into the app state.
     */
    refreshStateFromStorage({ commit }, entityKeys) {
      entityKeys.map((entity) => {
        const data = LocalStorage.get(entity)
        commit('SET_ENTITY', { entity, data })
      })
    },

    /**
     * Load the active state entities from storage into state for page loads or
     * app crashes.
     */
    ensureActiveStateIsRefreshed({ dispatch }) {
      dispatch('refreshStateFromStorage', [
        ENTITY.activeExercises,
        ENTITY.activeWorkout,
      ])
    },

    beginNewWorkout({ commit, getters }, workout) {
      const { id, name, exerciseIds } = workout
      const newExerciseRecords = exerciseIds.map((eid) => {
        const exerciseName = getters.getExerciseNameById(eid)
        return new Record({ entityId: eid, entityName: exerciseName })
      })
      const newWorkoutRecord = new Record({ entityId: id, entityName: name })

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

    cancelWorkout({ commit }) {
      const entities = [ENTITY.activeExercises, ENTITY.activeWorkout]
      LocalStorage.clearByKeys(entities)
      commit('SET_ENTITY', { entity: entities[0], data: [] })
      commit('SET_ENTITY', { entity: entities[1], data: [] })
    },

    finishWorkout() {
      console.log('finishWorkout clicked!')
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

    isWorkoutInProgress: (_, getters) => {
      return (
        getters.isStateReady(ENTITY.activeExercises) &&
        getters.isStateReady(ENTITY.activeWorkout)
      )
    },

    getState: (state) => (entity) => {
      return state[entity]
    },

    getExerciseNameById: (state) => (exerciseId) => {
      return state[ENTITY.exercises].find(
        (exercise) => exercise.id === exerciseId
      )?.name
    },

    getActiveWorkoutName: (state) => {
      return state[ENTITY.activeWorkout][0]?.entityName ?? 'No entity name'
    },

    getActiveWorkoutCreatedDate: (state) => {
      return (
        state[ENTITY.activeWorkout][0]?.createdDate ?? 'No entity createdDate'
      )
    },

    getPreviousExerciseRecord: (state) => (exerciseId) => {
      console.log('getPreviousExerciseRecord:', state, exerciseId)
      return null
    },

    getPreviousWorkoutRecord: (state) => (workoutId) => {
      console.log('getPreviousWorkoutRecord:', state, workoutId)
      return null
    },

    getPreviousWorkoutReadableDate: (state) => (workoutId) => {
      console.log('getPreviousWorkoutRecordCreatedDate:', state, workoutId)
      return 'No previous records'
    },

    getPreviousWorkoutRecordDuration: (state) => (workoutId) => {
      console.log('getPreviousWorkoutRecordDuration:', state, workoutId)
      return '-'
    },

    // NOTE: How to get the latest record...
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
