export const ICON = Object.freeze({
  sets: 'list',
  weight: 'fitness_center',
  reps: 'replay',
  duration: 'history',
  distance: 'place',
})

export const ENTITY = Object.freeze({
  measurements: 'measurements',
  exercises: 'exercises',
  workouts: 'workouts',
  measurementRecords: 'measurementRecords',
  exerciseRecords: 'exerciseRecords',
  workoutRecords: 'workoutRecords',
  activeExerciseRecords: 'activeExerciseRecords',
  activeWorkoutRecords: 'activeWorkoutRecords',
})

export const EXERCISE_INPUTS = Object.freeze({
  weightLifting3Set: {
    setCount: 3,
    weight: true,
    reps: true,
  },
  weightLifting4Set: {
    setCount: 4,
    weight: true,
    reps: true,
  },
  weightLifting5Set: {
    setCount: 5,
    weight: true,
    reps: true,
  },
  weightLiftingPyramid: {
    setCount: 10,
    weight: true,
    reps: true,
  },
})

const layout = 'Layout'

export const LAYOUT = Object.freeze({
  default: 'Default' + layout,
  activeWorkout: 'ActiveWorkout' + layout,
})

const view = 'View'

export const VIEW = Object.freeze({
  notFound: 'NotFound' + view,
  login: 'Login' + view,
  dashboard: 'Dashboard' + view,
  activeWorkout: 'ActiveWorkout' + view,
})
