import Vue from 'vue'
import Vuex from 'vuex'
import LocalStorage from '../utils/local-storage.js'
import Defaults from '../utils/defaults.js'
import { arrayWrap, isArrayReady } from '../utils/common.js'
import { getDurationFromMilliseconds } from '../utils/time.js'
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
  [ENTITY.activeExercises]: [],
  [ENTITY.activeWorkout]: [],
  [ENTITY.records]: [],
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
     * Initializes local storage if needed, then sets the app state from
     * it if any data is found there.
     */
    startApp({ dispatch }) {
      const entities = Object.keys(ENTITY)
      LocalStorage.initByKeys(entities)
      dispatch('setStateFromStorage', entities)
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
     * Set the app state and storage with default data.
     */
    setDefaultAppData({ commit }) {
      const measurements = Defaults.getMeasurements()
      const exercises = Defaults.getExercises()
      const workouts = Defaults.getWorkouts()

      commit('SET_ENTITY', {
        entity: ENTITY.measurements,
        data: measurements,
      })
      LocalStorage.set(ENTITY.measurements, measurements)

      commit('SET_ENTITY', {
        entity: ENTITY.exercises,
        data: exercises,
      })
      LocalStorage.set(ENTITY.exercises, exercises)

      commit('SET_ENTITY', {
        entity: ENTITY.workouts,
        data: workouts,
      })
      LocalStorage.set(ENTITY.workouts, workouts)
    },

    /**
     * Sets app state from local storage.
     */
    setStateFromStorage({ commit }, entities) {
      arrayWrap(entities).map((entity) => {
        commit('SET_ENTITY', { entity, data: LocalStorage.get(entity) })
      })
    },

    beginNewWorkout({ dispatch }, workout) {
      const { id, exerciseIds } = workout
      dispatch('newActiveExercises', exerciseIds)
      dispatch('newActiveWorkout', id)
    },

    newActiveExercises({ commit, getters }, exerciseIds) {
      const newActiveExercises = exerciseIds.map((exerciseId) => {
        const exercise = getters.getExerciseById(exerciseId)

        return new Record({
          entityId: exercise.id,
          entityName: exercise.name,
          data: {
            sets: new Array(exercise.inputs.setCount).fill({
              weight: 0,
              reps: 0,
            }),
          },
        })
      })

      commit('SET_ENTITY', {
        entity: ENTITY.activeExercises,
        data: newActiveExercises,
      })
      LocalStorage.set(ENTITY.activeExercises, newActiveExercises)
    },

    newActiveWorkout({ commit, getters }, workoutId) {
      const workout = getters.getWorkoutById(workoutId)

      const newActiveWorkout = new Array(
        new Record({
          entityId: workoutId,
          entityName: workout.name,
          data: {
            date: new Date().toDateString(),
            duration: null,
          },
        })
      )

      commit('SET_ENTITY', {
        entity: ENTITY.activeWorkout,
        data: newActiveWorkout,
      })
      LocalStorage.set(ENTITY.activeWorkout, newActiveWorkout)
    },

    removeActiveWorkout({ commit }) {
      LocalStorage.clearByKeys([ENTITY.activeExercises, ENTITY.activeWorkout])
      commit('SET_ENTITY', {
        entity: ENTITY.activeExercises,
        data: [],
      })
      commit('SET_ENTITY', {
        entity: ENTITY.activeWorkout,
        data: [],
      })
    },

    finishWorkout({ commit, dispatch, state }) {
      const activeExercises = state[ENTITY.activeExercises]
      const activeWorkout = state[ENTITY.activeWorkout]

      const endedAt = new Date().getTime()
      activeWorkout[0].data.endedAt = endedAt
      activeWorkout[0].data.duration = getDurationFromMilliseconds(
        endedAt - activeWorkout[0].createdAt
      )

      const newRecords = [
        ...state[ENTITY.records],
        ...activeExercises,
        ...activeWorkout,
      ]

      commit('SET_ENTITY', {
        entity: ENTITY.records,
        data: newRecords,
      })
      LocalStorage.set(ENTITY.records, newRecords)

      dispatch('removeActiveWorkout')
    },
  },

  // GETTERS ------------------------------------------------------------------
  getters: {
    getState: (state) => (entity) => state[entity],

    isStateReady: (state) => (entity) => isArrayReady(state[entity]),

    isWorkoutInProgress: (state) => {
      return (
        isArrayReady(state[ENTITY.activeExercises]) &&
        isArrayReady(state[ENTITY.activeWorkout])
      )
    },

    getEntityById: (state) => (entity, id) => {
      return state[entity].find((e) => e.id === id)
    },

    // Exercises

    getExerciseById: (_, getters) => (exerciseId) => {
      return getters.getEntityById(ENTITY.exercises, exerciseId)
    },

    getExerciseNameById: (_, getters) => (exerciseId) => {
      return getters.getEntityById(ENTITY.exercises, exerciseId)?.name
    },

    getExerciseInputsById: (_, getters) => (exerciseId) => {
      return getters.getEntityById(ENTITY.exercises, exerciseId)?.inputs
    },

    getExerciseSetCountById: (_, getters) => (exerciseId) => {
      return getters.getEntityById(ENTITY.exercises, exerciseId)?.inputs
        ?.setCount
    },

    // Workouts

    getWorkoutById: (state) => (workoutId) => {
      return state[ENTITY.workouts].find((w) => w.id === workoutId)
    },

    getWorkoutNameById: (_, getters) => (workoutId) => {
      return getters.getEntityById(ENTITY.workouts, workoutId)?.name
    },

    // Active Exercises

    /**
     * @todo
     */

    // Active Workout

    getActiveWorkout: (state) => state[ENTITY.activeWorkout][0], // Should only be one

    getActiveWorkoutId: (_, getters) => getters.getActiveWorkout?.entityId,

    getActiveWorkoutName: (_, getters) => {
      return getters.getActiveWorkout?.entityName ?? 'No name found'
    },

    getActiveWorkoutDate: (_, getters) => {
      return getters.getActiveWorkout?.data?.date ?? 'No date found'
    },

    getActiveWorkoutCreatedAt: (_, getters) => {
      return getters.getActiveWorkout?.createdAt
    },

    // Previous Records

    getPreviousRecord: (state) => (entity, id) => {
      const filteredRecords = state[entity].filter((r) => r.entityId === id)
      const sortedRecords = filteredRecords.sort(
        (a, b) => b.createdAt - a.createdAt
      )
      return sortedRecords[0] // Only most recent record
    },

    getPreviousWorkoutDateById: (_, getters) => (workoutId) => {
      const previousRecord = getters.getPreviousRecord(
        ENTITY.records,
        workoutId
      )
      return previousRecord?.data?.date ?? 'No records found'
    },

    getPreviousWorkoutDurationById: (_, getters) => (workoutId) => {
      const previousRecord = getters.getPreviousRecord(
        ENTITY.records,
        workoutId
      )
      return previousRecord?.data?.duration ?? '-'
    },
  },
})
