/**
 * Use this as a prefix for LocalStorage fields to make them unique per version.
 */
export const DATA_VERSION = Object.freeze('FTData-v1')

export const MILLISECONDS = Object.freeze({
  perDay: 86400000,
  perHour: 3600000,
  perMinute: 60000,
  perSecond: 1000,
})

export const ENTITY = Object.freeze({
  measurements: 'measurements',
  exercises: 'exercises',
  workouts: 'workouts',
  measurementRecords: 'measurementRecords',
  exerciseRecords: 'exerciseRecords',
  workoutRecords: 'workoutRecords',
  activeExercises: 'activeExercises',
  activeWorkout: 'activeWorkout',
})

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
