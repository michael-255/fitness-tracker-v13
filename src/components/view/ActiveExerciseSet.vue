<script>
export default {
  props: {
    setNumber: {
      type: Number,
      default: null,
    },
    inputs: {
      type: String,
      required: true,
    },
    exerciseRecordId: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      value: 0,
    }
  },

  methods: {
    saveChanges() {
      let data = {}

      if (!data.sets) {
        data.sets = []
        data.sets[this.setNumber] = {}
        data.sets[this.setNumber][this.dataType] = this.value
      }

      if (!data.sets[this.setNumber]) {
        data.sets[this.setNumber] = {}
        data.sets[this.setNumber][this.dataType] = this.value
      }

      if (!data.sets[this.setNumber][this.dataType]) {
        data.sets[this.setNumber][this.dataType] = this.value
      }

      this.$store.dispatch('updateActiveExerciseSet', this.value)
    },
  },
}
</script>

<template>
  <v-text-field
    @blur="saveChanges()"
    type="number"
    label="5"
    dense
    outlined
    hide-details
    class="my-2"
  />
</template>
