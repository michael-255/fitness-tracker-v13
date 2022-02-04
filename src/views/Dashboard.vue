<script>
import RecommendationsContainer from '../components/view/RecommendationsContainer.vue'
import WorkoutsContainer from '../components/view/WorkoutsContainer.vue'
import { SOURCE, VIEW } from '../constants/globals.js'

export default {
  name: VIEW.dashboard,

  components: {
    RecommendationsContainer,
    WorkoutsContainer,
  },

  created() {
    // Ensures active state is up-to-date during page loads and crashes
    this.$store.dispatch('setStateFromLocalStorage', [
      SOURCE.exercisesInProgress,
      SOURCE.workoutsInProgress,
    ])
  },

  computed: {
    renderWorkouts() {
      return this.$store.getters.isStateReady(SOURCE.workouts)
    },
  },
}
</script>

<template>
  <v-container>
    <RecommendationsContainer />
    <WorkoutsContainer v-if="renderWorkouts" />
  </v-container>
</template>
