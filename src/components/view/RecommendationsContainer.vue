<script>
import ResumeCard from './ResumeCard.vue'
import ControlPanelCard from './ControlPanelCard.vue'
import { ENTITY } from '../../constants/globals.js'

export default {
  components: {
    ResumeCard,
    ControlPanelCard,
  },

  computed: {
    renderResumeCard() {
      return this.$store.getters.isEntityStateReady(ENTITY.activeWorkoutRecords)
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
