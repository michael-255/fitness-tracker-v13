<script>
import WorkoutCard from './WorkoutCard.vue'
import { ENTITY } from '../../constants/globals.js'

export default {
  components: {
    WorkoutCard,
  },

  computed: {
    workouts() {
      return this.$store.getters.getEntityState(ENTITY.workouts)
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
