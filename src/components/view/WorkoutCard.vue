<script>
import { ENTITY, VIEW } from '../../constants/globals.js'
// import Timer from '../common/Timer.vue'

export default {
  props: {
    workout: {
      type: Object,
      required: true,
    },
  },
  components: {
    // Timer,
  },

  computed: {
    workoutName() {
      return this.workout?.name
    },

    previousWorkoutDate() {
      return (
        this.$store.getters.getPreviousWorkoutRecord(this.workout?.id)
          ?.createdDate ?? 'No previous records'
      )
    },
  },

  methods: {
    beginWorkout() {
      const currentWorkout = this.$store.getters.isStateReady(ENTITY.workouts)

      if (!currentWorkout) {
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
        @todo: Wed Jan 26 2022
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
