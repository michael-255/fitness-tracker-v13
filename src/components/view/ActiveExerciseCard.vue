<script>
// import ActiveExerciseCardSet from './ActiveExerciseCardSet.vue'

export default {
  props: {
    exerciseRecord: {
      type: Object,
      required: true,
    },
  },

  components: {
    // ActiveExerciseCardSet,
  },

  computed: {
    exerciseName() {
      return this.exerciseRecord?.entityName
    },
  },
}
</script>

<template>
  <v-col class="col-12 px-0">
    <v-card>
      <v-card-title>{{ exerciseName }}</v-card-title>

      <v-card-text>
        <!-- <div v-for="(item, i) in setLimit" :key="i">
          <v-chip v-if="activeExercise.inputs.hasSets" x-small class="mb-1">
            SET {{ i + 1 }}
          </v-chip>
          <ActiveExerciseCardSet
            :set="i"
            :exerciseRecord="exerciseRecord"
            :exerciseInputs="activeExercise.inputs"
          />
        </div> -->
      </v-card-text>
    </v-card>
  </v-col>
</template>
