<script>
export default {
  methods: {
    defaultApp() {
      if (
        confirm('Reset the app with the defaults (does NOT remove records)?')
      ) {
        this.$store.dispatch('setDefaultAppData')
      }
    },

    clearApp() {
      if (confirm('Clear all app data and records?')) {
        this.$store.dispatch('clearAppData')
      }
    },

    exportRecords() {
      confirm('Not Implemented')
    },
  },
}
</script>

<template>
  <v-col class="col-12">
    <v-card>
      <v-card-title class="pb-0">
        <v-icon>settings</v-icon>
        <span class="ml-3">Control Panel</span>
      </v-card-title>

      <v-card-actions class="pt-0">
        <v-container class="pt-0">
          <v-btn small class="success mr-3 mt-3" @click="defaultApp()">
            Reset Defaults
          </v-btn>

          <v-btn small class="error mr-3 mt-3" @click="clearApp()">
            Clear App
          </v-btn>

          <v-btn small class="warning mr-3 mt-3" @click="exportRecords()">
            Export Records
          </v-btn>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-col>
</template>
