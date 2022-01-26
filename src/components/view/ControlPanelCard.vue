<script>
export default {
  methods: {
    defaultApp() {
      if (
        confirm('Reset the app with the defaults (does NOT remove records)?')
      ) {
        this.$store.dispatch('defaultApp')
      }
    },

    clearApp() {
      if (confirm('Clear all app data and records?')) {
        this.$store.dispatch('clearApp')
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
      <v-card-title>Control Panel</v-card-title>

      <v-card-actions>
        <v-container>
          <v-btn color="success mr-3" @click="defaultApp()">
            Set Defaults
          </v-btn>

          <v-btn color="error mr-3" @click="clearApp()">
            Clear App
          </v-btn>

          <v-btn color="warning mr-3" @click="exportRecords()">
            Export Records
          </v-btn>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-col>
</template>
