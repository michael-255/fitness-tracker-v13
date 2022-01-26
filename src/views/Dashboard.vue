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
    this.$store.dispatch('setStateWithActiveWorkoutFromStorage')
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
