<script>
import { VIEW } from '../../constants/globals.js'

export default {
  props: {
    workout: {
      type: Object,
      required: true,
    },
  },

  computed: {
    workoutName() {
      return this.workout?.name ?? null
    },

    previousWorkoutDate() {
      return this.$store.getters.getPreviousWorkoutDateById(this.workout.id)
    },

    previousWorkoutDuration() {
      return this.$store.getters.getPreviousWorkoutDurationById(this.workout.id)
    },
  },

  methods: {
    beginWorkout() {
      const inProgressWorkout = this.$store.getters['getActiveWorkoutName']

      if (!inProgressWorkout) {
        this.routeToActiveWorkout()
      } else {
        if (confirm('Replace in progress workout?')) {
          this.routeToActiveWorkout()
        }
      }
    },

    async routeToActiveWorkout() {
      const payload = {
        workoutId: this.workout.id,
        exerciseIds: this.workout.exerciseIds,
      }

      this.$router.push({ name: VIEW.activeWorkout })
      await this.$store.dispatch('beginNewWorkout', payload)
    },
  },
}
</script>

<template>
  <v-col class="col-12 col-sm-6 col-md-4 col-xl-3">
    <v-card>
      <v-card-title>{{ workoutName }}</v-card-title>

      <v-card-subtitle>
        {{ previousWorkoutDate }}
        <br />
        {{ previousWorkoutDuration }}
      </v-card-subtitle>

      <v-card-actions>
        <v-container>
          <v-btn block color="primary" @click="beginWorkout()">
            Begin
          </v-btn>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-col>
</template>
