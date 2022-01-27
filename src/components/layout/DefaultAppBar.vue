<script>
export default {
  data() {
    return {
      date: new Date().toDateString(),
    }
  },
}
</script>

<template>
  <v-app-bar app dark color="secondary">
    <v-toolbar-title>Fitness Tracker</v-toolbar-title>

    <v-spacer />

    {{ date }}
  </v-app-bar>
</template>
