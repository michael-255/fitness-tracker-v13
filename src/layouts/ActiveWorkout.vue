<script>
import { LAYOUT } from '../constants/globals.js'
import ActiveWorkoutAppBar from '../components/layout/ActiveWorkoutAppBar.vue'
import WorkoutTimerFooter from '../components/layout/ActiveWorkoutFooter.vue'

export default {
  name: LAYOUT.activeWorkout,

  components: {
    ActiveWorkoutAppBar,
    WorkoutTimerFooter,
  },
}
</script>

<template>
  <div>
    <ActiveWorkoutAppBar />
    <v-main>
      <slot />
    </v-main>
    <WorkoutTimerFooter />
  </div>
</template>
