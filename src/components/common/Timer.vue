<script>
import { getDurationFromMilliseconds } from '../../utils/string-formatters.js'

export default {
  props: {
    createdAt: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    hours() {
      return getDurationFromMilliseconds(this.createdAt)?.hours
    },

    minutes() {
      return getDurationFromMilliseconds(this.createdAt)?.minutes
    },

    seconds() {
      return getDurationFromMilliseconds(this.createdAt)?.seconds
    },
  },
}
</script>

<template>
  <span>
    <v-icon v-show="hours > 0 || minutes > 0 || seconds > 0" small class="mr-1">
      timer
    </v-icon>
    <span v-show="hours > 0">{{ hours }}</span>
    <span v-show="hours > 0" class="font-weight-thin mr-1">h</span>
    <span v-show="minutes > 0">{{ minutes }}</span>
    <span v-show="minutes > 0" class="font-weight-thin mr-1">m</span>
    <span v-show="seconds > 0">{{ hours }}</span>
    <span v-show="seconds > 0" class="font-weight-thin mr-1">s</span>
  </span>
</template>
