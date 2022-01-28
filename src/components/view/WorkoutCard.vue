<script>
import { mapGetters } from 'vuex'
import { VIEW } from '../../constants/globals.js'
import { getDaysSinceFromDate } from '../../utils/string-formatters.js'

export default {
  props: {
    workout: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapGetters([
      'getPreviousWorkoutDateById',
      'getPreviousWorkoutDurationById',
      'isWorkoutInProgress',
    ]),

    workoutName() {
      return this.workout?.name
    },

    previousWorkoutDate() {
      return this.getPreviousWorkoutDateById(this.workout?.id)
    },

    previousWorkoutDuration() {
      return this.getPreviousWorkoutDurationById(this.workout?.id)
    },

    daysSinceLastWorkout() {
      return getDaysSinceFromDate(this.previousWorkoutDate)
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
        <div>
          <v-icon small class="mr-1">event_available</v-icon>
          <span>{{ previousWorkoutDate }}</span>
          <v-badge
            v-show="this.daysSinceLastWorkout"
            class="ml-1"
            inline
            color="secondary"
            :content="this.daysSinceLastWorkout"
          />
        </div>
        <div>
          <v-icon small class="mr-1">timer</v-icon>
          <span>{{ previousWorkoutDuration }}</span>
        </div>
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
