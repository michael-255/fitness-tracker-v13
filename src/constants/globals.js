/**
 * Use this as a prefix for LocalStorage fields to make them unique per version.
 */
export const DATA_VERSION = Object.freeze('fitdata-v2')

// Types

export const OPERATION_TYPE = Object.freeze({
  CreateOperation: 'CreateOperation',
  UpdateOperation: 'UpdateOperation',
  RemoveOperation: 'RemoveOperation',
  ClearOperation: 'ClearOperation',
})

export const ACTION_TYPE = Object.freeze({
  Measurement: 'Measurement',
  Exercise: 'Exercise',
  Workout: 'Workout',
})

export const RECORD_TYPE = Object.freeze({
  MeasurementRecord: 'MeasurementRecord',
  ExerciseRecord: 'ExerciseRecord',
  WorkoutRecord: 'WorkoutRecord',
})

// Entities

export const ACTION_ENTITY = Object.freeze({
  measurements: 'measurements',
  exercises: 'exercises',
  workouts: 'workouts',
})

export const INPROGRESS_ENTITY = Object.freeze({
  inProgressMeasurements: 'inProgressMeasurements',
  inProgressExercises: 'inProgressExercises',
  inProgressWorkouts: 'inProgressWorkouts',
})

export const RECORDS_ENTITY = Object.freeze({
  measurementRecords: 'measurementRecords',
  exerciseRecords: 'exerciseRecords',
  workoutRecords: 'workoutRecords',
})

export const ALL_ENTITY = Object.freeze({
  ...ACTION_ENTITY,
  ...INPROGRESS_ENTITY,
  ...RECORDS_ENTITY,
})

/**
 * @deprecated
 */
export const ENTITY = Object.freeze({
  measurements: 'measurements',
  exercises: 'exercises',
  workouts: 'workouts',
  activeExercises: 'activeExercises',
  activeWorkout: 'activeWorkout',
  records: 'records',
})

// UI Components

const layout = 'Layout'

export const LAYOUT = Object.freeze({
  default: 'Default' + layout,
  activeWorkout: 'ActiveWorkout' + layout,
})

const view = 'View'

export const VIEW = Object.freeze({
  notFound: 'NotFound' + view,
  dashboard: 'Dashboard' + view,
  activeWorkout: 'ActiveWorkout' + view,
})
