<script>
export default {
  components: {},

  computed: {
    navDrawer: {
      get() {
        return this.$store.state.isDrawerActive
      },
      set(drawer) {
        this.$store.dispatch('setDrawer', drawer)
      },
    },
  },
}
</script>

<template>
  <v-navigation-drawer v-model="navDrawer" app clipped>
    <v-list nav>
      <v-list-item link>
        <v-list-item-action>
          <v-icon>timeline</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          Item 1
        </v-list-item-content>
      </v-list-item>

      <v-divider class="mb-2" />

      <v-list-item link>
        <v-list-item-action>
          <v-icon>sd_card</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          Item 2
        </v-list-item-content>
      </v-list-item>

      <v-divider class="mb-2" />

      <v-list-item link>
        <v-list-item-action>
          <v-icon>announcement</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          Item 3
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
