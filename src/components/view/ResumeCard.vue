<script>
import { VIEW } from '../../constants/globals.js'

export default {
  computed: {
    activeWorkoutName() {
      return this.$store.getters.getActiveWorkoutName
    },

    activeWorkoutCreatedDate() {
      return this.$store.getters.getActiveWorkoutCreatedDate
    },
  },

  methods: {
    resumeWorkout() {
      this.$router.push({ name: VIEW.activeWorkout })
    },

    async cancelWorkout() {
      if (confirm('Cancel this workout?')) {
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

      <v-card-subtitle class="pb-0">
        <v-icon small class="mr-1">start</v-icon>
        <span>{{ activeWorkoutCreatedDate }}</span>
      </v-card-subtitle>

      <v-btn icon absolute top right color="error" @click="cancelWorkout()">
        <v-icon>delete_forever</v-icon>
      </v-btn>

      <v-card-actions>
        <v-container>
          <v-btn small color="success" @click="resumeWorkout()">
            Resume Workout
          </v-btn>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-col>
</template>
