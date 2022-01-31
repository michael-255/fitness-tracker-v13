<script>
import ActiveExerciseCard from './ActiveExerciseCard.vue'
import { ENTITY } from '../../constants/globals.js'

export default {
  components: {
    ActiveExerciseCard,
  },

  computed: {
    activeExercises() {
      return this.$store.getters.getState(ENTITY.activeExercises)
    },
  },
}
</script>

<template>
  <v-row>
    <v-col class="text-center text-h6 col-12 py-0">
      <v-banner single-line>Active Workout</v-banner>
    </v-col>

    <ActiveExerciseCard
      v-for="activeExercise in activeExercises"
      :key="activeExercise.id"
      :activeExercise="activeExercise"
    />
  </v-row>
</template>
