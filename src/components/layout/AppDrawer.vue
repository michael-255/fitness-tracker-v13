<script>
import DrawerListItem from './DrawerListItem.vue'
import { DATA_VERSION, SOURCE, VIEW } from '../../constants/globals.js'
import { downloadFile, createId, createFTv14Id } from '../../utils/common.js'
import { CreateOperation } from '../../models/Operations.js'

export default {
  components: {
    DrawerListItem,
  },

  data() {
    return {
      dataVersion: DATA_VERSION,
      importedData: null,
      mappedData: null,
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
      let fileSelector = document.createElement('input')
      fileSelector.setAttribute('type', 'file')

      fileSelector.onchange = () => {
        const selectedFile = fileSelector.files[0]
        console.log(selectedFile)

        let reader = new FileReader()
        reader.readAsText(selectedFile)

        reader.onload = () => {
          this.importedData = JSON.parse(reader.result)
          // map data to state
          setTimeout(() => {
            const origionExerciseIds = {
              '9dcbeaa2-661f-498f-a1f8-873fa68963c3': 'KSJ-T7H-NJ1',
              '9c25d8c5-2808-4156-9794-3023cb47fb67': '2ON-P4G-YGZ',
              'fb47a085-cdf6-4982-8da0-a1e789a93a87': '8BH-A4O-4D6',
              '9a01bbdc-354c-49b3-a30e-830fe13e4ccf': '822-SIE-1YR',
              '7cd1c763-5690-4533-ad3a-a2ba005c0a87': 'QZW-L12-AZG',
            }

            const originExerciseNames = {
              '9dcbeaa2-661f-498f-a1f8-873fa68963c3': 'Barbell Squats',
              '9c25d8c5-2808-4156-9794-3023cb47fb67': 'Barbell Bench Press',
              'fb47a085-cdf6-4982-8da0-a1e789a93a87': 'Barbell Rows',
              '9a01bbdc-354c-49b3-a30e-830fe13e4ccf': 'Barbell Overhead Press',
              '7cd1c763-5690-4533-ad3a-a2ba005c0a87': 'Deadlift',
            }

            const origionWorkoutIds = {
              '09ef1b6f-3307-4a4e-b24e-c81d11cdeea1': 'L8E-0EO-PPY',
              'c4800305-16f1-4fd6-ad56-c1873eb4ea0a': 'GX2-Z09-CFW',
            }

            const origionWorkoutNames = {
              '09ef1b6f-3307-4a4e-b24e-c81d11cdeea1': 'StrongLifts 5x5 - Alpha',
              'c4800305-16f1-4fd6-ad56-c1873eb4ea0a': 'StrongLifts 5x5 - Beta',
            }

            const exerciseRecords = this.importedData.exerciseRecords.map(
              (er) => {
                return {
                  type: 'ExerciseRecord',
                  createdAt: new Date(er.createdAt).getTime(),
                  date: new Date(er.createdAt).toDateString(),
                  id: createId(),
                  actionId: origionExerciseIds[er.exerciseId],
                  actionName: originExerciseNames[er.exerciseId],
                  data: {
                    sets: er.sets.map((set) => {
                      return {
                        weight: set.weight,
                        reps: set.reps,
                      }
                    }),
                  },
                }
              }
            )

            const workoutRecords = this.importedData.workoutRecords.map(
              (wr) => {
                return {
                  type: 'WorkoutRecord',
                  createdAt: new Date(wr.createdAt).getTime(),
                  date: new Date(wr.createdAt).toDateString(),
                  duration: null,
                  endedAt: null,
                  id: createId(),
                  actionId: origionWorkoutIds[wr.workoutId],
                  actionName: origionWorkoutNames[wr.workoutId],
                }
              }
            )

            this.mappedData = {
              exerciseRecords,
              workoutRecords,
            }

            this.$store.dispatch(
              'operationResolver',
              new CreateOperation({
                onSource: SOURCE.exerciseRecords,
                newEntities: exerciseRecords,
              })
            )
            this.$store.dispatch(
              'operationResolver',
              new CreateOperation({
                onSource: SOURCE.workoutRecords,
                newEntities: workoutRecords,
              })
            )
          }, 500)
        }

        reader.onerror = () => {
          console.error(reader.error)
        }
      }

      fileSelector.click()

      this.closeDrawer()
    },

    ftv14Export() {
      if (confirm('Export app state as Fitness Tracker v14 JSON?')) {
        const stateData = this.$store.getters.getAllStateData
        const records = {
          measurementRecords: stateData.measurementRecords,
          exerciseRecords: stateData.exerciseRecords,
          workoutRecords: stateData.workoutRecords,
        }
        const convertedRecords = {
          measurementRecords: [],
          exerciseRecords: [],
          workoutRecords: [],
        }

        console.log(createFTv14Id())
        console.log(records)

        // Measurement Records
        const convertedMeasurementRecords = records.measurementRecords.map(
          (mr) => {
            // Id lookup
            let addObj = {}
            switch (mr.actionName) {
              case 'Body Weight':
                addObj.parentId = '122G-ISH0-KQQC'
                addObj.lbs = mr.value
                break
              case 'Body Fat':
                addObj.parentId = 'BBV6-WJV0-BO7W'
                addObj.lbs = mr.value
                break
              case 'Neck':
                addObj.parentId = 'F8V7-U81S-RD58'
                addObj.inches = mr.value
                break
              case 'Shoulders':
                addObj.parentId = 'A0DU-AJ0X-LCYD'
                addObj.inches = mr.value
                break
              case 'Chest':
                addObj.parentId = 'QLV9-CXMV-9L87'
                addObj.inches = mr.value
                break
              case 'Left Biceps':
                addObj.parentId = 'VO6C-7X1V-BFZQ'
                addObj.inches = mr.value
                break
              case 'Right Biceps':
                addObj.parentId = 'VLR4-0HZ7-027O'
                addObj.inches = mr.value
                break
              case 'Left Forearms':
                addObj.parentId = 'YKDW-16OB-QM1O'
                addObj.inches = mr.value
                break
              case 'Right Forearms':
                addObj.parentId = 'R6UV-WRQZ-YA3A'
                addObj.inches = mr.value
                break
              case 'Waist':
                addObj.parentId = '2B4M-573D-LLWN'
                addObj.inches = mr.value
                break
              case 'Left Thighs':
                addObj.parentId = 'C48H-L6LV-FTCZ'
                addObj.inches = mr.value
                break
              case 'Right Thighs':
                addObj.parentId = '7BK9-30DF-MD08'
                addObj.inches = mr.value
                break
              case 'Left Calves':
                addObj.parentId = '6CJL-D836-1J0K'
                addObj.inches = mr.value
                break
              case 'Right Calves':
                addObj.parentId = 'S5CG-WH2J-7MIK'
                addObj.inches = mr.value
                break
              case 'Height':
                addObj.parentId = 'VEHP-0EYL-IW3G'
                addObj.inches = mr.value
                break
              default:
                addObj = null
                break
            }

            return {
              id: createFTv14Id(),
              createdAt: new Date(mr.createdAt).toISOString(),
              parentId: addObj.parentId || undefined,
              note: undefined,
              lbs: addObj.lbs || undefined,
              inches: addObj.inches || undefined,
            }
          }
        )

        convertedRecords.measurementRecords = convertedMeasurementRecords

        // Exercise records
        const convertedExerciseRecords = records.exerciseRecords.map((er) => {
          // Id lookup
          let addObj = {}
          switch (er.actionName) {
            case 'Barbell Squats':
              addObj.parentId = 'LI6N-BS98-26RX'
              break
            case 'Barbell Bench Press':
              addObj.parentId = 'SXL4-79XA-Y5GF'
              break
            case 'Barbell Rows':
              addObj.parentId = 'HBPR-WGQ0-NEHJ'
              break
            case 'Barbell Overhead Press':
              addObj.parentId = 'VXZU-4CAZ-FB9U'
              break
            case 'Deadlift':
              addObj.parentId = 'KEM9-NNUN-L3UH'
              break
            default:
              addObj = null
              break
          }

          return {
            id: createFTv14Id(),
            createdAt: new Date(er.createdAt).toISOString(),
            parentId: addObj.parentId,
            note: undefined,
            skipped: undefined,
            sets: er.data.sets.map((s) => ({ reps: s.reps, weight: s.weight })),
          }
        })

        convertedRecords.exerciseRecords = convertedExerciseRecords

        /**
         * WorkoutRecord Class
         * @param {string} obj.id (Inherited, Optional)
         * @param {string} obj.createdAt (Inherited, Optional)
         * @param {string} obj.parentId (Inherited, Required)
         * @param {string} obj.note (Inherited, Optional)
         * @param {string} obj.finishedAt (Optional)
         * @param {string[]} obj.exerciseRecordIds (Defaulted)
         */
        // Workout records
        const convertedWorkoutRecords = records.workoutRecords.map((wr) => {
          // Id lookup
          let addObj = {}
          switch (wr.actionName) {
            case 'StrongLifts 5x5 - Alpha':
              addObj.parentId = '155T-A7DX-DDTZ'
              break
            case 'StrongLifts 5x5 - Beta':
              addObj.parentId = '87R2-WNY8-J9LM'
              break
            default:
              addObj = null
              break
          }

          // Find related exercise records
          const workoutDate = wr.createdAt
          const workoutDateMax = workoutDate + 2000
          const workoutDateMin = workoutDate - 2000
          let relatedExerciseRecords = []
          convertedRecords.exerciseRecords.forEach((r) => {
            const exerciseDate = new Date(r.createdAt).getTime()
            if (
              exerciseDate >= workoutDateMin &&
              exerciseDate <= workoutDateMax
            ) {
              relatedExerciseRecords.push(r.id)
            }
          })

          return {
            id: createFTv14Id(),
            createdAt: new Date(wr.createdAt).toISOString(),
            parentId: addObj.parentId,
            note: undefined,
            finishedAt: new Date(wr.endedAt).toISOString(),
            exerciseRecordIds: relatedExerciseRecords,
          }
        })

        convertedRecords.workoutRecords = convertedWorkoutRecords

        console.log(convertedRecords)

        const fileData = JSON.stringify(convertedRecords)
        const fileName = `fitness-tracket-v14-export-${createId()}.json`
        downloadFile(fileName, fileData)
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
        :func="this.ftv14Export"
        icon="inventory_2"
        name="Export FT v14 JSON"
      />

      <DrawerListItem
        :func="this.importData"
        icon="system_update_alt"
        name="Import v11 App Data"
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
