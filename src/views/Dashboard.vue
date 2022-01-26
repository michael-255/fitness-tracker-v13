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

  async created() {
    const activeWorkoutInState = this.$store.getters.isEntityStateReady(
      ENTITY.activeWorkoutRecords
    )

    if (!activeWorkoutInState) {
      await this.$store.dispatch('loadActiveWorkoutFromStorage')
    }
  },

  computed: {
    renderWorkouts() {
      return this.$store.getters.isEntityStateReady(ENTITY.workouts)
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
