import Vue from 'vue'
import Vuex from 'vuex'
import LocalStorage from '../utils/local-storage.js'
import Defaults from '../utils/defaults.js'
import { arrayWrap, isArrayReady } from '../utils/common.js'
import { getDurationFromMilliseconds } from '../utils/time.js'
import { ExerciseRecord, WorkoutRecord } from '../models/Entities.js'
import { SOURCE, OPERATION_TYPE } from '../constants/globals.js'

Vue.use(Vuex)

/**
 * The entities that make up the app state.
 * Use the ENTITY constant when accessing.
 */
const defaultState = () => ({
  [SOURCE.measurements]: [],
  [SOURCE.exercises]: [],
  [SOURCE.workouts]: [],
  [SOURCE.measurementsInProgress]: [],
  [SOURCE.exercisesInProgress]: [],
  [SOURCE.workoutsInProgress]: [],
  [SOURCE.measurementRecords]: [],
  [SOURCE.exerciseRecords]: [],
  [SOURCE.workoutRecords]: [],
})

export default new Vuex.Store({
  state: defaultState(),

  mutations: {
    /**
     * Generic state mutation
     * @param {object} payload.source SOURCE constant
     * @param {object} payload.data Entities data
     */
    SET_STATE(state, payload) {
      const { source, data } = payload
      state[source] = data
    },
    CLEAR_STATE(state) {
      Object.assign(state, defaultState())
    },
  },

  /**
   * ACTIONS ------------------------------------------------------------------
   * Most of your important app functionality should be handled by actions.
   */
  actions: {
    /**
     * Init local storage if needed, then retrieve any data for the app state.
     */
    startApp({ dispatch }) {
      const sources = Object.keys(SOURCE)
      LocalStorage.initByKeys(sources)
      dispatch('setStateFromLocalStorage', sources)
    },

    /**
     * Removes all state and local storage data from the app (even records).
     */
    clearAppData({ commit }) {
      LocalStorage.clearByKeys(Object.keys(SOURCE))
      commit('CLEAR_STATE')
    },

    /**
     * Loads default measurements, exercises, and workouts into the app.
     */
    setDefaultAppData({ commit }) {
      const measurements = Defaults.getMeasurements()
      const exercises = Defaults.getExercises()
      const workouts = Defaults.getWorkouts()

      commit('SET_STATE', {
        source: SOURCE.measurements,
        data: measurements,
      })
      LocalStorage.set(SOURCE.measurements, measurements)

      commit('SET_STATE', {
        source: SOURCE.exercises,
        data: exercises,
      })
      LocalStorage.set(SOURCE.exercises, exercises)

      commit('SET_STATE', {
        source: SOURCE.workouts,
        data: workouts,
      })
      LocalStorage.set(SOURCE.workouts, workouts)
    },

    /**
     * Sets state using data from local storage.
     */
    setStateFromLocalStorage({ commit }, sources) {
      arrayWrap(sources).map((source) => {
        commit('SET_STATE', { source, data: LocalStorage.get(source) })
      })
    },

    beginNewWorkout({ dispatch }, workout) {
      const { id, exerciseIds } = workout
      dispatch('createInProgressExercises', exerciseIds)
      dispatch('createInProgressWorkout', id)
    },

    createInProgressExercises({ commit, getters }, exerciseIds) {
      const newInProgressExercises = exerciseIds.map((exerciseId) => {
        const exercise = getters.getExerciseById(exerciseId)

        return new ExerciseRecord({
          actionId: exercise.id,
          actionName: exercise.name,
          data: {
            sets: new Array(exercise.inputs.setCount).fill({
              weight: null,
              reps: null,
            }),
          },
        })
      })

      commit('SET_STATE', {
        source: SOURCE.exercisesInProgress,
        data: newInProgressExercises,
      })
      LocalStorage.set(SOURCE.exercisesInProgress, newInProgressExercises)
    },

    createInProgressWorkout({ commit, getters }, workoutId) {
      const workout = getters.getWorkoutById(workoutId)

      const newInProgressWorkout = new Array(
        new WorkoutRecord({
          actionId: workoutId,
          actionName: workout.name,
        })
      )

      commit('SET_STATE', {
        source: SOURCE.workoutsInProgress,
        data: newInProgressWorkout,
      })
      LocalStorage.set(SOURCE.workoutsInProgress, newInProgressWorkout)
    },

    finishWorkout({ commit, dispatch, state }) {
      const inProgressExercises = state[SOURCE.exercisesInProgress]
      const inProgressWorkouts = state[SOURCE.workoutsInProgress]

      const endedAt = new Date().getTime()
      const durationMS = endedAt - inProgressWorkouts[0].createdAt
      inProgressWorkouts[0].endedAt = endedAt
      inProgressWorkouts[0].duration = getDurationFromMilliseconds(durationMS)

      const newExerciseRecords = [
        ...state[SOURCE.exerciseRecords],
        ...inProgressExercises,
      ]

      const newWorkoutRecords = [
        ...state[SOURCE.workoutRecords],
        ...inProgressWorkouts,
      ]

      commit('SET_STATE', {
        source: SOURCE.exerciseRecords,
        data: newExerciseRecords,
      })
      LocalStorage.set(SOURCE.exerciseRecords, newExerciseRecords)

      commit('SET_STATE', {
        source: SOURCE.workoutRecords,
        data: newWorkoutRecords,
      })
      LocalStorage.set(SOURCE.workoutRecords, newWorkoutRecords)

      dispatch('clearInProgressWorkout')
    },

    clearInProgressWorkout({ commit }) {
      LocalStorage.clearByKeys([
        SOURCE.exercisesInProgress,
        SOURCE.workoutsInProgress,
      ])
      commit('SET_STATE', {
        source: SOURCE.exercisesInProgress,
        data: [],
      })
      commit('SET_STATE', {
        source: SOURCE.workoutsInProgress,
        data: [],
      })
    },

    updateInProgressExercises({ commit, getters }, updatedRecord) {
      const inProgressExercises = getters.getState(SOURCE.exercisesInProgress)

      arrayWrap(updatedRecord).forEach((ur) => {
        const index = inProgressExercises.findIndex(
          (i) => i.exerciseId === ur.exerciseId
        )

        if (index === -1) {
          inProgressExercises.push(ur)
        } else {
          inProgressExercises[index] = ur
        }
      })

      commit('SET_STATE', {
        source: SOURCE.exercisesInProgress,
        data: inProgressExercises,
      })
    },

    operationResolver({ dispatch }, operation) {
      switch (operation.type) {
        case OPERATION_TYPE.CreateOperation:
          dispatch('create', operation)
          break
        case OPERATION_TYPE.UpdateOperation:
          dispatch('update', operation)
          break
        case OPERATION_TYPE.RemoveOperation:
          dispatch('remove', operation)
          break
        case OPERATION_TYPE.ClearOperation:
          dispatch('clear', operation)
          break
        default:
          console.error(`Operation type ${operation.type} is not valid`)
          break
      }
    },

    /**
     * Create operation for source (State and Local Storage)
     * @param {object} operation.onSource SOURCE constant
     * @param {object} operation.newEntities Entities to add
     */
    create({ commit, state }, operation) {
      const { onSource, newEntities } = operation
      const sourceIds = state[onSource].map((s) => s.id)
      let additions = []
      let duplicates = []

      newEntities.forEach((ne) => {
        if (sourceIds.includes(ne.id)) {
          duplicates.push(ne)
        } else {
          additions.push(ne)
        }
      })

      if (duplicates.length) {
        console.error(
          `Duplicate id(s) found on source ${onSource} for:`,
          duplicates
        )
      }

      if (!additions.length) {
        console.error(`No additions found for ${onSource} source`)
      } else {
        console.log(`Additions for ${onSource} source:`, additions)

        const resultData = [...state[onSource], ...additions]

        commit('SET_STATE', {
          source: onSource,
          data: resultData,
        })
        LocalStorage.set(onSource, resultData)
      }
    },

    /**
     * Update operation for source (State and Local Storage)
     * @param {object} operation.onSource SOURCE constant
     * @param {object} operation.theseEntities Entities to update with
     */
    update({ commit }, operation) {
      // - Find each matching id in location
      // - Replace with updated data
      // - Error if no matching data to replace found
      console.log(commit, operation)
    },

    /**
     * Remove
     * (onSource, theseIds)
     * - Find data at location by provided id
     * - Remove data with matching id
     * - Error for each id where a match isnt found
     * Note: State and Local Storage should change together!
     */

    /**
     * Remove operation for source (State and Local Storage)
     * @param {object} operation.onSource SOURCE constant
     * @param {object} operation.theseIds Ids of entities to remove
     */
    remove({ commit }, operation) {
      // - Find data at location by provided id
      // - Remove data with matching id
      // - Error for each id where a match isnt found
      console.log(commit, operation)
    },

    /**
     * Clear operation for source (State and Local Storage)
     * @param {object} operation.theseSources SOURCE constants to clear
     */
    clear({ commit }, operation) {
      // - Clear the state and local storage of the provided sources
      console.log(commit, operation)
    },
  },

  /**
   * GETTERS ------------------------------------------------------------------
   * Most getters are for top level state data unless it is used often.
   * Use computed properties on the component for one off values.
   */
  getters: {
    getState: (state) => (source) => state[source],

    isStateReady: (state) => (source) => isArrayReady(state[source]),

    isWorkoutInProgress: (state) => {
      return (
        isArrayReady(state[SOURCE.exercisesInProgress]) &&
        isArrayReady(state[SOURCE.workoutsInProgress])
      )
    },

    getEntityById: (state) => (source, id) => {
      return state[source].find((e) => e.id === id)
    },

    // Exercises

    getExerciseById: (_, getters) => (exerciseId) => {
      return getters.getEntityById(SOURCE.exercises, exerciseId)
    },

    getExerciseNameById: (_, getters) => (exerciseId) => {
      return getters.getEntityById(SOURCE.exercises, exerciseId)?.name
    },

    getExerciseInputsById: (_, getters) => (exerciseId) => {
      return getters.getEntityById(SOURCE.exercises, exerciseId)?.inputs
    },

    getExerciseSetCountById: (_, getters) => (exerciseId) => {
      return getters.getEntityById(SOURCE.exercises, exerciseId)?.inputs
        ?.setCount
    },

    // Workouts

    getWorkoutById: (state) => (workoutId) => {
      return state[SOURCE.workouts].find((w) => w.id === workoutId)
    },

    getWorkoutNameById: (_, getters) => (workoutId) => {
      return getters.getEntityById(SOURCE.workouts, workoutId)?.name
    },

    // In Progress Workout

    getInProgressWorkout: (state) => state[SOURCE.workoutsInProgress][0], // Should only be one

    getInProgressWorkoutName: (_, getters) => {
      return getters.getInProgressWorkout?.workoutName ?? 'No name found'
    },

    getInProgressWorkoutDate: (_, getters) => {
      return getters.getInProgressWorkout?.date ?? 'No date found'
    },

    getInProgressWorkoutCreatedAt: (_, getters) => {
      return getters.getInProgressWorkout?.createdAt
    },

    // Previous Records

    getPreviousRecord: (state) => (source, actionId) => {
      const filteredRecords = state[source].filter(
        (r) => r.actionId === actionId
      )
      const sortedRecords = filteredRecords.sort(
        (a, b) => b.createdAt - a.createdAt
      )
      return sortedRecords[0] // Only most recent record
    },

    getPreviousExerciseWeightBySetAndId: (_, getters) => (
      setNumber,
      exerciseId
    ) => {
      const previousRecord = getters.getPreviousRecord(
        SOURCE.exerciseRecords,
        exerciseId
      )
      return previousRecord?.data?.sets?.[setNumber]?.weight ?? 0
    },

    getPreviousExerciseRepsBySetAndId: (_, getters) => (
      setNumber,
      exerciseId
    ) => {
      const previousRecord = getters.getPreviousRecord(
        SOURCE.exerciseRecords,
        exerciseId
      )
      return previousRecord?.data?.sets?.[setNumber]?.reps ?? 0
    },

    getPreviousWorkoutDateById: (_, getters) => (workoutId) => {
      const previousRecord = getters.getPreviousRecord(
        SOURCE.workoutRecords,
        workoutId
      )
      return previousRecord?.date ?? 'No records found'
    },

    getPreviousWorkoutDurationById: (_, getters) => (workoutId) => {
      const previousRecord = getters.getPreviousRecord(
        SOURCE.workoutRecords,
        workoutId
      )
      return previousRecord?.duration ?? '-'
    },
  },
})
