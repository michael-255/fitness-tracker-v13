import ExerciseRecord from '../../models/ExerciseRecord.js'
import WorkoutRecord from '../../models/WorkoutRecord.js'
import { ENTITY_KEY } from '../../constants/globals.js'
import { LocalStorage } from './database.js'
import { createDefaultExercises, createDefaultWorkouts } from './defaults.js'

/**
 * Combined Store Actions - Core actions app can take
 */
export const combinedStoreActions = () => {
  return {
    async initApp({ dispatch }) {
      await Promise.all([
        dispatch(`${ENTITY_KEY.exercises}/initDatabase`),
        dispatch(`${ENTITY_KEY.workouts}/initDatabase`),
        dispatch(`${ENTITY_KEY.exerciseRecords}/initDatabase`),
        dispatch(`${ENTITY_KEY.workoutRecords}/initDatabase`),
        dispatch(`${ENTITY_KEY.activeExerciseRecords}/initDatabase`),
        dispatch(`${ENTITY_KEY.activeWorkoutRecords}/initDatabase`),
      ])
      await Promise.all([
        dispatch(`${ENTITY_KEY.exercises}/setStateWithDatabase`),
        dispatch(`${ENTITY_KEY.workouts}/setStateWithDatabase`),
        dispatch(`${ENTITY_KEY.exerciseRecords}/setStateWithDatabase`),
        dispatch(`${ENTITY_KEY.workoutRecords}/setStateWithDatabase`),
        dispatch(`${ENTITY_KEY.activeExerciseRecords}/setStateWithDatabase`),
        dispatch(`${ENTITY_KEY.activeWorkoutRecords}/setStateWithDatabase`),
      ])
    },
    async clearApp({ dispatch }) {
      await Promise.all([
        dispatch(`${ENTITY_KEY.exercises}/clearDatabase`),
        dispatch(`${ENTITY_KEY.workouts}/clearDatabase`),
        dispatch(`${ENTITY_KEY.exerciseRecords}/clearDatabase`),
        dispatch(`${ENTITY_KEY.workoutRecords}/clearDatabase`),
        dispatch(`${ENTITY_KEY.activeExerciseRecords}/clearDatabase`),
        dispatch(`${ENTITY_KEY.activeWorkoutRecords}/clearDatabase`),
        dispatch(`${ENTITY_KEY.exercises}/clearState`),
        dispatch(`${ENTITY_KEY.workouts}/clearState`),
        dispatch(`${ENTITY_KEY.exerciseRecords}/clearState`),
        dispatch(`${ENTITY_KEY.workoutRecords}/clearState`),
        dispatch(`${ENTITY_KEY.activeExerciseRecords}/clearState`),
        dispatch(`${ENTITY_KEY.activeWorkoutRecords}/clearState`),
      ])
    },
    async useDefaults({ dispatch }) {
      await Promise.all([
        dispatch(`${ENTITY_KEY.exercises}/setStateWithDefaults`),
        dispatch(`${ENTITY_KEY.workouts}/setStateWithDefaults`),
      ])
      await Promise.all([
        dispatch(`${ENTITY_KEY.exercises}/saveStateToDatabase`),
        dispatch(`${ENTITY_KEY.workouts}/saveStateToDatabase`),
      ])
    },

    async beginNewWorkout({ dispatch }, payload) {
      await Promise.all([
        dispatch(
          `${ENTITY_KEY.activeExerciseRecords}/createActiveRecordsForState`,
          payload.exerciseIds
        ),
        dispatch(
          `${ENTITY_KEY.activeWorkoutRecords}/createActiveRecordsForState`,
          payload.workoutId
        ),
      ])
      await Promise.all([
        dispatch(`${ENTITY_KEY.activeExerciseRecords}/saveStateToDatabase`),
        dispatch(`${ENTITY_KEY.activeWorkoutRecords}/saveStateToDatabase`),
      ])
    },

    async existingActiveWorkout({ dispatch }) {
      await Promise.all([
        dispatch(`${ENTITY_KEY.activeExerciseRecords}/setStateWithDatabase`),
        dispatch(`${ENTITY_KEY.activeWorkoutRecords}/setStateWithDatabase`),
      ])
    },
    async cancelWorkout({ dispatch }) {
      await Promise.all([
        dispatch(`${ENTITY_KEY.activeExerciseRecords}/clearDatabase`),
        dispatch(`${ENTITY_KEY.activeWorkoutRecords}/clearDatabase`),
        dispatch(`${ENTITY_KEY.activeExerciseRecords}/clearState`),
        dispatch(`${ENTITY_KEY.activeWorkoutRecords}/clearState`),
      ])
    },
    async finishWorkout({ dispatch, getters }) {
      const activeExerciseRecords = getters['activeExerciseRecords/getState']
      const activeWorkoutRecords = getters['activeWorkoutRecords/getState']

      // Update exercises previous records
      for (const record of activeExerciseRecords) {
        const payload = {
          recordId: record.exerciseId,
          recordData: record,
        }
        await dispatch(
          `${ENTITY_KEY.exercises}/updatePreviousRecordForState`,
          payload
        )
      }
      // Update workouts previous records
      for (const record of activeWorkoutRecords) {
        const payload = {
          recordId: record.workoutId,
          recordData: record,
        }
        await dispatch(
          `${ENTITY_KEY.workouts}/updatePreviousRecordForState`,
          payload
        )
      }

      await Promise.all([
        dispatch(
          `${ENTITY_KEY.exerciseRecords}/insertPayloadToState`,
          activeExerciseRecords
        ),
        dispatch(
          `${ENTITY_KEY.workoutRecords}/insertPayloadToState`,
          activeWorkoutRecords
        ),
      ])
      await Promise.all([
        dispatch(`${ENTITY_KEY.exercises}/saveStateToDatabase`),
        dispatch(`${ENTITY_KEY.workouts}/saveStateToDatabase`),
        dispatch(`${ENTITY_KEY.exerciseRecords}/saveStateToDatabase`),
        dispatch(`${ENTITY_KEY.workoutRecords}/saveStateToDatabase`),
      ])
      await Promise.all([
        dispatch(`${ENTITY_KEY.activeExerciseRecords}/clearDatabase`),
        dispatch(`${ENTITY_KEY.activeWorkoutRecords}/clearDatabase`),
        dispatch(`${ENTITY_KEY.activeExerciseRecords}/clearState`),
        dispatch(`${ENTITY_KEY.activeWorkoutRecords}/clearState`),
      ])
    },
    async updateActiveExerciseSet({ dispatch }, payload) {
      await dispatch('activeExerciseRecords/putPayloadToState', payload)
      await dispatch(`${ENTITY_KEY.activeExerciseRecords}/saveStateToDatabase`)
    },
  }
}

/**
 * Database Actions - LocalStorage usage here only!
 */
export const databaseActions = (defaultState, entity) => {
  return {
    async initDatabase() {
      LocalStorage.init(entity, defaultState[entity])
    },
    async saveStateToDatabase({ state }) {
      LocalStorage.overwrite(entity, state[entity])
    },
    async clearDatabase() {
      LocalStorage.clear(entity, defaultState[entity])
    },
    async setStateWithDatabase({ commit }) {
      commit('SET', LocalStorage.get(entity))
    },
  }
}

/**
 * Entity Actions
 */
export const entityActions = (entity) => {
  return {
    async clearState({ commit }) {
      commit('CLEAR_STATE')
    },
    async setStateWithDefaults({ commit }) {
      commit('SET', createDefaultsForEntity(entity))
    },
    async insertPayloadToState({ state, commit }, payload) {
      const combinedState = [...state[entity], ...payload]
      commit('SET', combinedState)
    },
    async putPayloadToState({ state, commit }, payload) {
      if (!Array.isArray(payload)) payload = [payload]

      const stateData = state[entity]

      payload.forEach((pl) => {
        const index = stateData.findIndex((i) => i.id === pl.id)

        if (index === -1) {
          stateData.push(pl)
        } else {
          stateData[index] = pl
        }
      })

      commit('SET', stateData)
    },
  }
}

function createDefaultsForEntity(entity) {
  switch (entity) {
    case ENTITY_KEY.exercises:
      return createDefaultExercises()
    case ENTITY_KEY.workouts:
      return createDefaultWorkouts()
    default:
      return null
  }
}

/**
 * Activity Actions (Exercises and Workouts)
 */
export const activityActions = (entity) => {
  return {
    async updatePreviousRecordForState({ state, commit }, payload) {
      const { recordId, recordData } = payload

      const stateData = state[entity]
      const index = state[entity].findIndex((i) => i.id === recordId)

      if (index !== -1) {
        stateData[index].previousRecord = recordData
        commit('SET', stateData)
      }
    },
  }
}

/**
 * Active Record Actions
 */
export const activeRecordActions = (entity) => {
  return {
    async createActiveRecordsForState({ commit }, ids) {
      const records = createEntityRecords(entity, ids)
      commit('SET', records)
    },
  }
}

function createEntityRecords(entity, ids) {
  if (!Array.isArray(ids)) ids = [ids] // Must be an array, even if only 1 element

  switch (entity) {
    case ENTITY_KEY.activeExerciseRecords:
    case ENTITY_KEY.exerciseRecords:
      return ids.map((id) => new ExerciseRecord({ exerciseId: id }))
    case ENTITY_KEY.activeWorkoutRecords:
    case ENTITY_KEY.workoutRecords:
      return ids.map((id) => new WorkoutRecord({ workoutId: id }))
    default:
      return null
  }
}
