<script>
import { ENTITY, VIEW } from '../../constants/globals.js'

export default {
  props: {
    workout: {
      type: Object,
      required: true,
    },
  },

  computed: {
    workoutName() {
      return this.workout?.name
    },

    previousWorkoutDate() {
      return (
        this.$store.getters.getPreviousWorkoutRecordCreatedDate(
          this.workout?.id
        ) ?? 'No previous records'
      )
    },

    previousWorkoutDuration() {
      return (
        this.$store.getters.getPreviousWorkoutRecordDuration(
          this.workout?.id
        ) ?? '-'
      )
    },
  },

  methods: {
    beginWorkout() {
      const activeWorkout = this.$store.getters.isStateReady(
        ENTITY.activeWorkout
      )

      if (!activeWorkout) {
        this.routeToActiveWorkout()
      } else {
        if (confirm('Replace in progress workout?')) {
          this.routeToActiveWorkout()
        }
      }
    },

    async routeToActiveWorkout() {
      this.$router.push({ name: VIEW.activeWorkout })
      await this.$store.dispatch('beginNewWorkout', this.workout)
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
