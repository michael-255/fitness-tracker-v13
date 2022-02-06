<script>
import { CreateOperation } from '../../models/Operations.js'
import { Workout } from '../../models/Entities.js'

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

    createTest1() {
      const operation = new CreateOperation({
        onSource: 'workouts',
        newEntities: [
          new Workout({
            id: '8d4e4291', //'8d4e4291-b87b-4756-b4ed-7cdd153f413a',
            // id: '8d4e4291-b87b-4756-b4ed-7cdd153f413a',
            name: 'Test 1',
            exerciseIds: [],
          }),
          new Workout({
            // id: '8d4e4291', //'8d4e4291-b87b-4756-b4ed-7cdd153f413a',
            id: '8d4e4291-b87b-4756-b4ed-7cdd153f413a',
            name: 'Test 2',
            exerciseIds: [],
          }),
        ],
      })

      this.$store.dispatch('operationResolver', operation)
    },

    updateTest1() {
      console.log('updateTest1')
    },

    removeTest1() {
      console.log('removeTest1')
    },

    clearTest1() {
      console.log('clearTest1')
    },
  },
}
</script>

<template>
  <v-col class="col-12">
    <v-card>
      <v-card-title class="pb-0">
        <v-icon class="mr-3">settings</v-icon>
        <span>Control Panel</span>
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

          <v-btn small class="secondary mr-3 mt-3" @click="createTest1()">
            Create Test 1
          </v-btn>

          <v-btn small class="secondary mr-3 mt-3" @click="updateTest1()">
            Update Test 1
          </v-btn>

          <v-btn small class="secondary mr-3 mt-3" @click="removeTest1()">
            Remove Test 1
          </v-btn>

          <v-btn small class="secondary mr-3 mt-3" @click="clearTest1()">
            Clear Test 1
          </v-btn>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-col>
</template>
