<script>
import { VIEW } from '../constants/globals'
import ActiveExercisesContainer from '../components/view/ActiveExercisesContainer.vue'

export default {
  name: VIEW.activeWorkout,

  components: {
    ActiveExercisesContainer,
  },

  methods: {
    async finishWorkout() {
      if (confirm('Finish and save this workout?')) {
        this.$router.push({ name: VIEW.dashboard })
        await this.$store.dispatch('finishWorkout')
      }
    },
  },
}
</script>

<template>
  <v-container>
    <ActiveExercisesContainer />

    <v-row class="mb-3 mt-5">
      <v-spacer />
      <v-btn large color="success" @click="finishWorkout()">
        Finish Workout
      </v-btn>
      <v-spacer />
    </v-row>
  </v-container>
</template>
