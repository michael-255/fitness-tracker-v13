<script>
export default {
  computed: {},

  methods: {
    takeMeasurement() {
      console.log('Not Implemented')
    },
  },
}
</script>

<template>
  <v-col class="col-12">
    <v-card>
      <v-card-title class="pb-0">
        <v-icon class="mr-3">straighten</v-icon>
        <span>Measurements</span>
      </v-card-title>

      <v-card-actions>
        <v-container>
          <v-btn small color="secondary" @click="takeMeasurement()">
            Take Measurement
          </v-btn>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-col>
</template>
