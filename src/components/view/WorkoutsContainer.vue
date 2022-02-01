<script>
import ResumeCard from './ResumeCard.vue'
import WorkoutCard from './WorkoutCard.vue'
import { ENTITY } from '../../constants/globals.js'

export default {
  components: {
    ResumeCard,
    WorkoutCard,
  },

  computed: {
    workouts() {
      return this.$store.getters.getState(ENTITY.workouts)
    },

    renderResumeCard() {
      return this.$store.getters.isWorkoutInProgress
    },
  },
}
</script>

<template>
  <v-row>
    <v-col class="text-center text-h6 col-12 py-0">
      <v-banner single-line>Workouts</v-banner>
    </v-col>

    <ResumeCard v-if="renderResumeCard" />

    <WorkoutCard
      v-for="workout in workouts"
      :key="workout.id"
      :workout="workout"
    />
  </v-row>
</template>
