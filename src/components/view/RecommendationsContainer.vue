<script>
import ControlPanelCard from './ControlPanelCard.vue'

export default {
  components: {
    ControlPanelCard,
  },
}
</script>

<template>
  <v-row>
    <v-col class="text-center text-h6 col-12 py-0">
      <v-banner single-line>Recommendations</v-banner>
    </v-col>

    <ControlPanelCard />
  </v-row>
</template>
