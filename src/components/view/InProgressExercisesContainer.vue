<script>
import InProgressExerciseCard from './InProgressExerciseCard.vue'
import { SOURCE } from '../../constants/globals.js'

export default {
  components: {
    InProgressExerciseCard,
  },

  computed: {
    inProgressExercises() {
      return this.$store.getters.getState(SOURCE.exercisesInProgress)
    },
  },
}
</script>

<template>
  <v-row>
    <v-col class="text-center text-h6 col-12 py-0">
      <v-banner single-line>Active Workout</v-banner>
    </v-col>

    <InProgressExerciseCard
      v-for="inProgressExercise in inProgressExercises"
      :key="inProgressExercise.id"
      :inProgressExercise="inProgressExercise"
    />
  </v-row>
</template>
