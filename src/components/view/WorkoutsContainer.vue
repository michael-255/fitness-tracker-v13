<script>
import WorkoutCard from './WorkoutCard.vue'
import { ENTITY } from '../../constants/globals.js'

export default {
  components: {
    WorkoutCard,
  },

  computed: {
    workouts() {
      return this.$store.getters.getState(ENTITY.workouts)
    },
  },
}
</script>

<template>
  <v-row>
    <v-col class="text-center text-h6 col-12">
      <v-banner single-line>Workouts</v-banner>
    </v-col>

    <WorkoutCard
      v-for="workout in workouts"
      :key="workout.id"
      :workout="workout"
    />
  </v-row>
</template>
