<script>
import RecommendationsContainer from '../components/view/RecommendationsContainer.vue'
import WorkoutsContainer from '../components/view/WorkoutsContainer.vue'
import { ENTITY, VIEW } from '../constants/globals.js'

export default {
  name: VIEW.dashboard,

  components: {
    RecommendationsContainer,
    WorkoutsContainer,
  },

  created() {
    // Ensure active entities are current if moving between pages
    this.$store.dispatch('refreshStateFromStorage', [
      ENTITY.activeWorkout,
      ENTITY.activeExercises,
    ])
  },

  computed: {
    renderWorkouts() {
      return this.$store.getters.isStateReady(ENTITY.workouts)
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
