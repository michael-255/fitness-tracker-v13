<script>
import RecommendationsContainer from '../components/view/RecommendationsContainer.vue'
import WorkoutsContainer from '../components/view/WorkoutsContainer.vue'
import { VIEW } from '../constants/globals.js'

export default {
  name: VIEW.dashboard,

  components: {
    RecommendationsContainer,
    WorkoutsContainer,
  },

  created() {
    // Ensure activeWorkout is current if moving between pages
    // this.$store.dispatch('saturateStateFromStorage', [ENTITY.activeWorkout])
  },

  computed: {
    renderWorkouts() {
      return this.$store.getters.isWorkoutStateReady
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
