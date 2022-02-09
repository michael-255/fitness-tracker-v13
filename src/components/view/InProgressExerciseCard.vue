<script>
import InProgressExerciseSet from './InProgressExerciseSet.vue'

export default {
  props: {
    inProgressExercise: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
    }
  },

  components: {
    InProgressExerciseSet,
  },

  computed: {
    exerciseName() {
      return this.inProgressExercise?.actionName
    },

    exerciseId() {
      return this.inProgressExercise?.actionId
    },

    setCount() {
      return this.$store.getters.getExerciseSetCountById(
        this.inProgressExercise?.actionId
      )
    },
  },
}
</script>

<template>
  <v-col class="col-12">
    <v-card>
      <v-card-title>
        <span>{{ exerciseName }}</span>
        <v-btn icon absolute top right @click="viewRecords()">
          <v-icon>assignment</v-icon>
        </v-btn>
        <!-- TEST DIALOG -->
        <v-row justify="center">
          <v-dialog
            v-model="dialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon absolute top right v-bind="attrs" v-on="on">
                <v-icon>assignment</v-icon>
              </v-btn>
            </template>

            <v-card>
              <v-toolbar dark color="primary">
                <v-toolbar-title>Previous Records</v-toolbar-title>
                <v-spacer />
                <v-toolbar-items>
                  <v-btn icon @click="dialog = false">
                    <v-icon>close</v-icon>
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <div>
                Hello World!
              </div>
            </v-card>
          </v-dialog>
        </v-row>
        <!-- TEST DIALOG -->
      </v-card-title>

      <v-card-text>
        <div v-if="setCount">
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left px-1">Set</th>

                  <th class="text-left px-1">
                    <v-icon small class="mr-1">fitness_center</v-icon>
                    <span>Weight</span>
                  </th>

                  <th class="text-left px-1">
                    <v-icon small class="mr-1">filter_list</v-icon>
                    <span>Reps</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                <InProgressExerciseSet
                  v-for="i in setCount"
                  :key="i"
                  :inProgressExercise="inProgressExercise"
                  :setNumber="i - 1"
                />
              </tbody>
            </template>
          </v-simple-table>
        </div>
      </v-card-text>
    </v-card>
  </v-col>
</template>
