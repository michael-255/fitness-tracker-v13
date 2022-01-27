<script>
import ResumeCard from './ResumeCard.vue'
import ControlPanelCard from './ControlPanelCard.vue'

export default {
  components: {
    ResumeCard,
    ControlPanelCard,
  },

  computed: {
    renderResumeCard() {
      return this.$store.getters.isWorkoutStateReady
    },
  },
}
</script>

<template>
  <v-row>
    <ControlPanelCard />
    <ResumeCard v-if="renderResumeCard" />
  </v-row>
</template>
