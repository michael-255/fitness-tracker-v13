<script>
import ControlPanelCard from './ControlPanelCard.vue'
import MeasurementsCard from './MeasurementsCard.vue'
import ResumeCard from './ResumeCard.vue'

export default {
  components: {
    ResumeCard,
    MeasurementsCard,
    ControlPanelCard,
  },

  computed: {
    renderResumeCard() {
      return this.$store.getters.isWorkoutInProgress
    },
  },
}
</script>

<template>
  <v-row>
    <ControlPanelCard />
    <MeasurementsCard />
    <ResumeCard v-if="renderResumeCard" />
  </v-row>
</template>
