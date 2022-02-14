<script>
import DrawerListItem from './DrawerListItem.vue'
import { DATA_VERSION, VIEW } from '../../constants/globals.js'
import { downloadFile, createId } from '../../utils/common.js'

export default {
  components: {
    DrawerListItem,
  },

  data() {
    return {
      dataVersion: DATA_VERSION,
    }
  },

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

  methods: {
    closeDrawer() {
      this.$store.dispatch('setDrawer', false)
    },

    measurements() {
      this.$router.push({ name: VIEW.measurements })
      this.closeDrawer()
    },

    charts() {
      // Confirm dialog won't be needed for new CHARTS screen once implemented
      if (confirm('Not Implemented')) {
        this.closeDrawer()
      }
    },

    exportState() {
      if (confirm('Export app state as JSON?')) {
        const fileName = `fitness-state-export-${createId()}.json`
        const fileData = this.$store.getters.getStateJSON
        downloadFile(fileName, fileData)
        this.closeDrawer()
      }
    },

    importData() {
      if (confirm('Not Implemented')) {
        this.closeDrawer()
      }
    },

    loadDefaults() {
      if (confirm('Load defaults for the app?')) {
        this.$store.dispatch('setDefaultAppData')
        this.closeDrawer()
      }
    },

    clearApp() {
      if (confirm('Clear all app data and records?')) {
        this.$store.dispatch('clearAppData')
        this.closeDrawer()
      }
    },
  },
}
</script>

<template>
  <v-navigation-drawer v-model="navDrawer" app>
    <v-list nav>
      <v-subheader class="mb-2 pt-2">MENU</v-subheader>

      <v-divider class="mb-2" />

      <DrawerListItem
        :func="this.measurements"
        icon="straighten"
        name="Measurements"
      />

      <DrawerListItem :func="this.charts" icon="timeline" name="Charts" />

      <v-divider class="mb-2" />

      <DrawerListItem
        :func="this.exportState"
        icon="inventory_2"
        name="Export State JSON"
      />

      <DrawerListItem
        :func="this.importData"
        icon="system_update_alt"
        name="Import Data"
      />

      <DrawerListItem
        :func="this.loadDefaults"
        icon="settings_backup_restore"
        name="Load Defaults"
      />

      <v-divider class="mb-2" />

      <DrawerListItem
        :func="this.clearApp"
        icon="delete"
        name="Clear App Data"
      />

      <v-divider class="mb-2" />
    </v-list>

    <div class="caption font-weight-thin ml-4">{{ dataVersion }}</div>
  </v-navigation-drawer>
</template>
