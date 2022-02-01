<script>
import ActiveExerciseSet from './ActiveExerciseSet.vue'

export default {
  props: {
    activeExercise: {
      type: Object,
      required: true,
    },
  },

  components: {
    ActiveExerciseSet,
  },

  computed: {
    exerciseName() {
      return this.activeExercise?.entityName
    },

    exerciseId() {
      return this.activeExercise?.entityId
    },

    setCount() {
      return this.$store.getters.getExerciseSetCountById(
        this.activeExercise?.entityId
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
        <v-btn icon absolute top right>
          <v-icon>list_alt</v-icon>
        </v-btn>
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
                <ActiveExerciseSet
                  v-for="i in setCount"
                  :key="i"
                  :activeExercise="activeExercise"
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
