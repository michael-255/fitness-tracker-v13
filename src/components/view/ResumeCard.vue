<script>
import { VIEW } from '../../constants/globals.js'

export default {
  computed: {
    // activeWorkout() {
    //   return this.$store.getters.getState(ENTITY.activeWorkout)[0]
    // },
    // activeWorkoutName() {
    //   return this.activeWorkout?.name
    // },
    // activeWorkoutRecordCreatedAt() {
    //   return this.$store.getters['getActiveWorkoutRecordCreatedAt']
    // },
  },

  methods: {
    resumeWorkout() {
      this.$router.push({ name: VIEW.activeWorkout })
    },

    async cancelWorkout() {
      if (confirm('Cancel this active workout?')) {
        await this.$store.dispatch('cancelWorkout')
      }
    },
  },
}
</script>

<template>
  <v-col class="col-12">
    <v-card>
      <v-card-title>{{ activeWorkoutName }}</v-card-title>

      <v-card-subtitle>
        @todo: Wed Jan 26 2022
      </v-card-subtitle>

      <v-btn icon absolute top right @click="cancelWorkout()">X</v-btn>

      <v-card-actions>
        <v-container>
          <v-btn color="success" @click="resumeWorkout()">
            Resume Workout
          </v-btn>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-col>
</template>
