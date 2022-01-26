<script>
import { LAYOUT } from '../constants/globals.js'
import ActiveWorkoutAppBar from '../components/layout/ActiveWorkoutAppBar.vue'

export default {
  name: LAYOUT.activeWorkout,

  components: {
    ActiveWorkoutAppBar,
  },

  /**
   * @todo Add the Workout Timer from the older version of the app?
   */
}
</script>

<template>
  <div>
    <ActiveWorkoutAppBar />
    <v-main>
      <slot />
    </v-main>
  </div>
</template>
