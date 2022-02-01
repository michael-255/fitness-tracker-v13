<script>
export default {
  props: {
    activeExercise: {
      type: Object,
      required: true,
    },
  },

  computed: {
    exerciseName() {
      return this.activeExercise?.entityName
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
                <tr v-for="i in setCount" :key="i">
                  <td class="px-1">
                    <v-avatar size="32" color="info">{{ i }}</v-avatar>
                  </td>
                  <td class="px-1">
                    <v-text-field
                      @blur="saveChanges()"
                      type="number"
                      label="135"
                      dense
                      outlined
                      hide-details
                      class="my-2"
                    />
                  </td>
                  <td class="px-1">
                    <v-text-field
                      @blur="saveChanges()"
                      type="number"
                      label="5"
                      dense
                      outlined
                      hide-details
                      class="my-2"
                    />
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
      </v-card-text>
    </v-card>
  </v-col>
</template>
