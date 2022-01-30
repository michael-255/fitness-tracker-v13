<script>
import ControlPanelCard from './ControlPanelCard.vue'
// import MeasurementsCard from './MeasurementsCard.vue'
import ResumeCard from './ResumeCard.vue'

export default {
  components: {
    ResumeCard,
    // MeasurementsCard,
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
    <v-col class="text-center text-h6 col-12">
      <v-banner single-line>Recommendations</v-banner>
    </v-col>

    <ControlPanelCard />
    <!-- <MeasurementsCard /> -->
    <ResumeCard v-if="renderResumeCard" />
  </v-row>
</template>
