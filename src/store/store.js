import Vue from 'vue'
import Vuex from 'vuex'
import LocalStorage from '../utils/local-storage.js'
import Defaults from '../utils/defaults.js'
import { arrayWrap, isArrayReady } from '../utils/common.js'
import { getDurationFromMilliseconds } from '../utils/time.js'
import { ExerciseRecord, WorkoutRecord } from '../models/Entities.js'
import { SOURCE, OPERATION_TYPE } from '../constants/globals.js'
import {
  InitOperation,
  ClearOperation,
  CreateOperation,
  UpdateOperation,
} from '../models/Operations.js'

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
      dispatch(
        'operationResolver',
        new InitOperation({ theseSources: Object.keys(SOURCE) })
      )
    },

    /**
     * Removes all state and local storage data from the app (even records).
     */
    clearAppData({ dispatch }) {
      dispatch(
        'operationResolver',
        new ClearOperation({ theseSources: Object.keys(SOURCE) })
      )
    },

    /**
     * Loads default measurements, exercises, and workouts into the app.
     */
    setDefaultAppData({ dispatch }) {
      dispatch(
        'operationResolver',
        new CreateOperation({
          onSource: SOURCE.measurements,
          newEntities: Defaults.getMeasurements(),
        })
      )
      dispatch(
        'operationResolver',
        new CreateOperation({
          onSource: SOURCE.exercises,
          newEntities: Defaults.getExercises(),
        })
      )
      dispatch(
        'operationResolver',
        new CreateOperation({
          onSource: SOURCE.workouts,
          newEntities: Defaults.getWorkouts(),
        })
      )
    },

    beginNewWorkout({ dispatch }, workout) {
      const { id, exerciseIds } = workout
      dispatch('createInProgressExercises', exerciseIds)
      dispatch('createInProgressWorkout', id)
    },

    createInProgressExercises({ dispatch, getters }, exerciseIds) {
      const newInProgressExercises = exerciseIds.map((exerciseId) => {
        const exercise = getters.getExerciseById(exerciseId)
        const setCount = exercise.inputs.setCount

        return new ExerciseRecord({
          actionId: exercise.id,
          actionName: exercise.name,
          data: {
            sets: new Array(setCount).fill({
              weight: null,
              reps: null,
            }),
          },
        })
      })

      dispatch(
        'operationResolver',
        new CreateOperation({
          onSource: SOURCE.exercisesInProgress,
          newEntities: newInProgressExercises,
        })
      )
    },

    createInProgressWorkout({ dispatch, getters }, workoutId) {
      const workout = getters.getWorkoutById(workoutId)

      const newInProgressWorkout = new Array(
        new WorkoutRecord({
          actionId: workoutId,
          actionName: workout.name,
        })
      )

      dispatch(
        'operationResolver',
        new CreateOperation({
          onSource: SOURCE.workoutsInProgress,
          newEntities: newInProgressWorkout,
        })
      )
    },

    async finishWorkout({ dispatch, state }) {
      const inProgressExercises = state[SOURCE.exercisesInProgress]
      const inProgressWorkouts = state[SOURCE.workoutsInProgress]

      const endedAt = new Date().getTime()
      const durationMS = endedAt - inProgressWorkouts[0].createdAt
      inProgressWorkouts[0].endedAt = endedAt
      inProgressWorkouts[0].duration = getDurationFromMilliseconds(durationMS)

      dispatch(
        'operationResolver',
        new CreateOperation({
          onSource: SOURCE.exerciseRecords,
          newEntities: inProgressExercises,
        })
      )
      dispatch(
        'operationResolver',
        new CreateOperation({
          onSource: SOURCE.workoutRecords,
          newEntities: inProgressWorkouts,
        })
      )
      dispatch('clearInProgressWorkout')
    },

    clearInProgressWorkout({ dispatch }) {
      dispatch(
        'operationResolver',
        new ClearOperation({
          theseSources: [SOURCE.exercisesInProgress, SOURCE.workoutsInProgress],
        })
      )
    },

    updateInProgressExercises({ dispatch }, updatedRecord) {
      // const inProgressExercises = getters.getState(SOURCE.exercisesInProgress)

      dispatch(
        'operationResolver',
        new UpdateOperation({
          onSource: SOURCE.exercisesInProgress,
          theseEntities: updatedRecord,
        })
      )

      /**
       * @todo May need this code to maintain entity positions in the source!
       */
      // arrayWrap(updatedRecord).forEach((ur) => {
      //   const index = inProgressExercises.findIndex(
      //     (i) => i.exerciseId === ur.exerciseId
      //   )

      //   if (index === -1) {
      //     inProgressExercises.push(ur)
      //   } else {
      //     inProgressExercises[index] = ur
      //   }
      // })

      // commit('SET_STATE', {
      //   source: SOURCE.exercisesInProgress,
      //   data: inProgressExercises,
      // })
    },

    /**
     * OPERATION RESOLVER:
     * Pass operations into this action to have them completed on the
     * appropriate State and Local Storage sources.
     */
    operationResolver({ dispatch }, operation) {
      switch (operation.type) {
        case OPERATION_TYPE.InitOperation:
          dispatch('init', operation)
          break
        case OPERATION_TYPE.ReadOperation:
          dispatch('read', operation)
          break
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
     * INIT:
     * Local storage gets initialized with the correct default keys and values
     * on the provided sources if it is missing them. Then it loads any local
     * storage data that is present into the state.
     * @param {object} operation.theseSources SOURCE constants to initialize
     */
    init({ commit }, operation) {
      try {
        let { theseSources } = operation
        theseSources = arrayWrap(theseSources)

        LocalStorage.initByKeys(theseSources)

        theseSources.map((source) => {
          commit('SET_STATE', { source, data: LocalStorage.get(source) })
        })

        if (!theseSources.length) {
          console.error('No sources provided for init operation')
        }
      } catch (error) {
        console.error('Init operation failed:', error)
      }
    },

    /**
     * READ:
     * Loads data from the provided sources into the app state.
     * @param {object} operation.theseSources SOURCE constants to read from
     */
    read({ commit }, operation) {
      try {
        let { theseSources } = operation
        theseSources = arrayWrap(theseSources)

        theseSources.map((source) => {
          commit('SET_STATE', { source, data: LocalStorage.get(source) })
        })

        if (!theseSources.length) {
          console.error('No sources provided for read operation')
        }
      } catch (error) {
        console.error('Read operation failed:', error)
      }
    },

    /**
     * CREATE:
     * Adds new entities to the provided source.
     * @param {object} operation.onSource SOURCE constant
     * @param {object} operation.newEntities Entities to add
     */
    create({ commit, state }, operation) {
      try {
        const { onSource, newEntities } = operation
        const createdEntities = arrayWrap(newEntities)
        const sourceIds = state[onSource].map((s) => s.id)
        let additions = []
        let duplicates = []

        createdEntities.forEach((createdEntity) => {
          if (sourceIds.includes(createdEntity.id)) {
            duplicates.push(createdEntity)
          } else {
            additions.push(createdEntity)
          }
        })

        if (duplicates.length) {
          console.error(`Duplicate(s) found on source ${onSource}:`, duplicates)
        }

        if (!additions.length) {
          console.error(`No additions found on source ${onSource}`)
        } else {
          console.log(`Addition(s) for source ${onSource}:`, additions)

          const resultData = [...state[onSource], ...additions]

          commit('SET_STATE', {
            source: onSource,
            data: resultData,
          })
          LocalStorage.set(onSource, resultData)
        }
      } catch (error) {
        console.error('Create operation failed:', error)
      }
    },

    /**
     * UPDATE:
     * Replaces the entities in state and local storage with the updated
     * version you provide.
     * @param {object} operation.onSource SOURCE constant
     * @param {object} operation.theseEntities Entities to update with
     */
    update({ commit, state }, operation) {
      try {
        const { onSource, theseEntities } = operation
        const updatedEntities = arrayWrap(theseEntities)
        const sourceIds = state[onSource].map((s) => s.id)
        const updatedIds = updatedEntities.map((s) => s.id)
        let update = []
        let noMatch = []
        let retain = []

        updatedEntities.forEach((updatedEntity) => {
          if (sourceIds.includes(updatedEntity.id)) {
            update.push(updatedEntity)
          } else {
            noMatch.push(updatedEntity)
          }
        })

        state[onSource].forEach((entity) => {
          if (!updatedIds.includes(entity.id)) {
            retain.push(entity)
          }
        })

        if (noMatch.length) {
          console.error(`No matches found on source ${onSource} for:`, noMatch)
        }

        if (update.length) {
          console.log(`Updating entities on source ${onSource}:`, update)
          console.log(`Retaining entities on source ${onSource}:`, retain)

          const resultData = [...retain, ...update]

          commit('SET_STATE', {
            source: onSource,
            data: resultData,
          })
          LocalStorage.set(onSource, resultData)
        }
      } catch (error) {
        console.error('Update operation failed:', error)
      }
    },

    /**
     * REMOVE:
     * Removes entities from state and local storage by the ids provided.
     * @param {object} operation.onSource SOURCE constant
     * @param {object} operation.theseIds Ids of entities to remove
     */
    remove({ commit, state }, operation) {
      try {
        const { onSource, theseIds } = operation
        const removalIds = arrayWrap(theseIds)
        let remove = []
        let retain = []

        state[onSource].forEach((entity) => {
          if (removalIds.includes(entity.id)) {
            remove.push(entity)
          } else {
            retain.push(entity)
          }
        })

        if (!retain.length) {
          console.error(`No retain(s) found on source ${onSource}`)
        }

        if (!remove.length) {
          console.error(`No remove(s) found on source ${onSource}`)
        } else {
          console.log(`Remove(s) for source ${onSource}:`, remove)

          commit('SET_STATE', {
            source: onSource,
            data: retain,
          })
          LocalStorage.set(onSource, retain)
        }
      } catch (error) {
        console.error('Remove operation failed:', error)
      }
    },

    /**
     * CLEAR:
     * Clears all state and local storage data to it's default values for the
     * provided sources.
     * @param {object} operation.theseSources SOURCE constants to clear
     */
    clear({ commit }, operation) {
      try {
        let { theseSources } = operation
        theseSources = arrayWrap(theseSources)

        theseSources.map((source) => {
          commit('SET_STATE', { source, data: [] })
        })

        LocalStorage.clearByKeys(theseSources)

        if (!theseSources.length) {
          console.error('No sources provided for clear operation')
        }
      } catch (error) {
        console.error('Clear operation failed:', error)
      }
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
