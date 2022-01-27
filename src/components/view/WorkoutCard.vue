<script>
import { mapGetters } from 'vuex'
import { VIEW } from '../../constants/globals.js'

export default {
  props: {
    workout: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapGetters(['getPreviousWorkoutReadableDate', 'isWorkoutInProgress']),

    workoutName() {
      return this.workout?.name
    },

    previousWorkoutDate() {
      return this.getPreviousWorkoutReadableDate(this.workout?.id)
    },

    previousWorkoutDuration() {
      return '-'
    },
  },

  methods: {
    beginWorkout() {
      if (this.isWorkoutInProgress) {
        this.replaceWorkout()
      } else {
        this.routeToNewWorkout()
      }
    },

    replaceWorkout() {
      if (confirm('Replace in progress workout?')) {
        this.routeToNewWorkout()
      }
    },

    async routeToNewWorkout() {
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

      <v-card-subtitle class="pb-0">
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
