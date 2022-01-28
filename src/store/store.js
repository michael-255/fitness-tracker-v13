import Vue from 'vue'
import Vuex from 'vuex'
import LocalStorage from '../utils/local-storage.js'
import createDefaultEntityData from '../utils/defaults-generator.js'
import { getDurationFromMilliseconds } from '../utils/string-formatters.js'
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
      LocalStorage.initializeByKeys(Object.keys(ENTITY))

      const entityDefaults = createDefaultEntityData()
      const entityKeys = Object.keys(entityDefaults)

      entityKeys.forEach((entity) => {
        const data = entityDefaults[entity]
        commit('SET_ENTITY', { entity, data })
        LocalStorage.overwrite(entity, data)
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
      const newWorkoutRecord = new Record({
        entityId: id,
        entityName: name,
        data: {
          date: new Date().toDateString(),
          duration: null,
        },
      })

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

    clearActiveStateAndStorage({ commit }) {
      const entities = [ENTITY.activeExercises, ENTITY.activeWorkout]
      LocalStorage.clearByKeys(entities)
      commit('SET_ENTITY', { entity: entities[0], data: [] })
      commit('SET_ENTITY', { entity: entities[1], data: [] })
    },

    cancelWorkout({ dispatch }) {
      dispatch('clearActiveStateAndStorage')
    },

    finishWorkout({ commit, dispatch, state }) {
      const activeExercises = state[ENTITY.activeExercises]
      const activeWorkout = state[ENTITY.activeWorkout]

      const endedAt = new Date().getTime()
      activeWorkout[0].data.endedAt = endedAt
      activeWorkout[0].data.duration = getDurationFromMilliseconds(
        endedAt - activeWorkout[0].createdAt
      )

      /**
       * @todo Any final data needed for execise records before saving?
       */

      const newExerciseRecords = [
        ...state[ENTITY.exerciseRecords],
        ...activeExercises,
      ]
      const newWorkoutRecords = [
        ...state[ENTITY.workoutRecords],
        ...activeWorkout,
      ]

      commit('SET_ENTITY', {
        entity: ENTITY.exerciseRecords,
        data: newExerciseRecords,
      })
      commit('SET_ENTITY', {
        entity: ENTITY.workoutRecords,
        data: newWorkoutRecords,
      })
      LocalStorage.overwrite(ENTITY.exerciseRecords, newExerciseRecords)
      LocalStorage.overwrite(ENTITY.workoutRecords, newWorkoutRecords)

      dispatch('clearActiveStateAndStorage')
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
      return state[ENTITY.activeWorkout][0]?.entityName ?? 'No entityName found'
    },

    getActiveWorkoutDate: (state) => {
      return state[ENTITY.activeWorkout][0]?.data?.date ?? 'No date found'
    },

    getActiveWorkoutCreatedAt: (state) => {
      return state[ENTITY.activeWorkout][0]?.createdAt ?? 'No createdAt found'
    },

    getActiveExerciseById: (state) => (exerciseId) => {
      console.log('getActiveExerciseById:', state, exerciseId)
      return {}
    },

    /**
     * Returns only the most recent record from an array of records.
     */
    getMostRecentRecord: (state) => (entity, id) => {
      const filteredRecords = state[entity].filter((r) => r.entityId === id)
      const sortedRecords = filteredRecords.sort(
        (a, b) => b.createdAt - a.createdAt
      )
      return sortedRecords[0]
    },

    getPreviousWorkoutDateById: (_, getters) => (workoutId) => {
      const previousRecord = getters.getMostRecentRecord(
        ENTITY.workoutRecords,
        workoutId
      )

      if (!previousRecord?.data?.date) {
        return 'No previous records'
      }

      return previousRecord.data.date
    },

    getPreviousWorkoutDurationById: (_, getters) => (workoutId) => {
      const previousRecord = getters.getMostRecentRecord(
        ENTITY.workoutRecords,
        workoutId
      )

      if (!previousRecord?.data?.duration) {
        return '-'
      }

      return previousRecord.data.duration
    },
  },

  modules: {},
})
