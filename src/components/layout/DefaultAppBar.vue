<script>
import { DATA_VERSION } from '../../constants/globals.js'

export default {
  data() {
    return {
      date: new Date().toDateString(),
      dataVersion: DATA_VERSION,
    }
  },
}
</script>

<template>
  <v-app-bar app dark color="secondary">
    <v-toolbar-title>
      <span>Fitness Tracker</span>
      <v-btn class="ml-2 mb-1" rounded x-small disabled>
        {{ this.dataVersion }}
      </v-btn>
    </v-toolbar-title>

    <v-spacer />

    {{ date }}
  </v-app-bar>
</template>
