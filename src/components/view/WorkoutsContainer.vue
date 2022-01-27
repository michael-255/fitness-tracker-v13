<script>
import WorkoutCard from './WorkoutCard.vue'
import { ENTITY_KEY } from '../../constants/globals.js'

export default {
  components: {
    WorkoutCard,
  },

  computed: {
    workouts() {
      return this.$store.getters.getState(ENTITY_KEY.workouts)
    },
  },
}
</script>

<template>
  <v-row>
    <WorkoutCard
      v-for="workout in workouts"
      :key="workout.id"
      :workout="workout"
    />
  </v-row>
</template>
