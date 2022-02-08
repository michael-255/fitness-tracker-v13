<script>
import RecommendationsContainer from '../components/view/RecommendationsContainer.vue'
import WorkoutsContainer from '../components/view/WorkoutsContainer.vue'
import { SOURCE, VIEW } from '../constants/globals.js'
import { LoadOperation } from '../models/Operations.js'

export default {
  name: VIEW.dashboard,

  components: {
    RecommendationsContainer,
    WorkoutsContainer,
  },

  created() {
    // Ensures in progress state is up-to-date during page loads and crashes
    this.$store.dispatch(
      'operationResolver',
      new LoadOperation({
        theseSources: [
          SOURCE.measurementsInProgress,
          SOURCE.exercisesInProgress,
          SOURCE.workoutsInProgress,
        ],
      })
    )
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
