<script>
import { getDurationFromMilliseconds } from '../../utils/string-formatters.js'

export default {
  props: {
    createdAt: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      timerId: null,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  },

  created() {
    this.timerId = setInterval(() => {
      const now = new Date().getTime()
      const duration = getDurationFromMilliseconds(
        now - this.getActiveWorkoutCreatedAt
      )
      this.hours = duration.hours
      this.minutes = duration.minutes
      this.seconds = duration.seconds
    }, 1000)
  },

  destroyed() {
    clearInterval(this.timerId)
  },

  computed: {
    getActiveWorkoutCreatedAt() {
      return this.$store.getters['getActiveWorkoutCreatedAt']
    },
  },
}
</script>

<template>
  <v-footer app color="primary" height="40">
    <v-row>
      <v-spacer />
      <v-icon class="mr-1">timer</v-icon>
      <span v-show="hours > 0">{{ hours }}</span>
      <span v-show="hours > 0" class="font-weight-thin mr-1">h</span>
      <span v-show="minutes > 0">{{ minutes }}</span>
      <span v-show="minutes > 0" class="font-weight-thin mr-1">m</span>
      <span v-show="seconds > 0">{{ hours }}</span>
      <span v-show="seconds > 0" class="font-weight-thin mr-1">s</span>
      <v-spacer />
    </v-row>
  </v-footer>
</template>
