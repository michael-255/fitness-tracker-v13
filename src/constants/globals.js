/**
 * Use this as a prefix for LocalStorage fields to make them unique per version.
 */
export const DATA_VERSION = Object.freeze('fitdata-v2')

export const ENTITY = Object.freeze({
  measurements: 'measurements',
  exercises: 'exercises',
  workouts: 'workouts',
  activeExercises: 'activeExercises',
  activeWorkout: 'activeWorkout',
  records: 'records',
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
