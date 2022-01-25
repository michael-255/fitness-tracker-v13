<script>
export default {
  methods: {
    async useDefaults() {
      if (confirm('Load default exercises and workouts?')) {
        await this.$store.dispatch('useDefaults')
      }
    },

    async clearApp() {
      if (confirm('Clear all app data?')) {
        await this.$store.dispatch('clearApp')
      }
    },

    basicExport() {
      if (confirm('Download all fitness records?')) {
        this.downloadFile(
          'workouts.txt',
          JSON.stringify(this.$store.getters['workouts/getState'])
        )
        this.downloadFile(
          'exercises.txt',
          JSON.stringify(this.$store.getters['exercises/getState'])
        )
        this.downloadFile(
          'workoutRecords.txt',
          JSON.stringify(this.$store.getters['workoutRecords/getState'])
        )
        this.downloadFile(
          'exerciseRecords.txt',
          JSON.stringify(this.$store.getters['exerciseRecords/getState'])
        )
      }
    },

    downloadFile(filename, textInput) {
      let tempElement = document.createElement('a')
      tempElement.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(textInput)
      )
      tempElement.setAttribute('download', filename)
      document.body.appendChild(tempElement)
      tempElement.click()
      document.body.removeChild(tempElement)
    },

    /**
     * Using this as a way to extract my legacy fitness data in a more useful
     * format for viewing before I rewrite this app.
     */
    advancedExport() {
      if (confirm('Download exercise record CSV?')) {
        this.getExerciseRecordsCSV()
      }
    },

    getExerciseRecordsCSV() {
      /**
       * Try refactoring the ExerciseRecords JSON:
       * - Remove id
       * - Remove note
       * - Replace exerciseId with Exercise name
       */
      let myRecords = this.$store.getters['exerciseRecords/getState']
      let myExercises = this.$store.getters['exercises/getState']

      let cleanedRecords = myRecords.map((r) => {
        // Use the exerciseId to find the exercise name
        const theExercise = myExercises.find((e) => e.id === r.exerciseId)
        const set1weight = `${r.sets[0]?.weight ?? '0'}`
        const set1reps = `${r.sets[0]?.reps ?? '0'}`
        const set2weight = `${r.sets[1]?.weight ?? '0'}`
        const set2reps = `${r.sets[1]?.reps ?? '0'}`
        const set3weight = `${r.sets[2]?.weight ?? '0'}`
        const set3reps = `${r.sets[2]?.reps ?? '0'}`
        const set4weight = `${r.sets[3]?.weight ?? '0'}`
        const set4reps = `${r.sets[3]?.reps ?? '0'}`
        const set5weight = `${r.sets[4]?.weight ?? '0'}`
        const set5reps = `${r.sets[4]?.reps ?? '0'}`

        return {
          name: theExercise.name,
          createdAt: r.createdAt,
          set1weight,
          set1reps,
          set2weight,
          set2reps,
          set3weight,
          set3reps,
          set4weight,
          set4reps,
          set5weight,
          set5reps,
        }
      })

      console.log(cleanedRecords)

      // Exercise Name, Date, Set 1 Weight, Set 1 Reps, Set 2 Weight, Set 2 Reps, ...
      let CSVText =
        'Exercise Name,Date,Set 1 Weight,Set 1 Reps,Set 2 Weight,Set 2 Reps,Set 3 Weight,Set 3 Reps,Set 4 Weight,Set 4 Reps,Set 5 Weight,Set 5 Reps\n'

      cleanedRecords.forEach((r) => {
        CSVText += `${r.name},${r.createdAt},${r.set1weight},${r.set1reps},${r.set2weight},${r.set2reps},${r.set3weight},${r.set3reps},${r.set4weight},${r.set4reps},${r.set5weight},${r.set5reps}\n`
      })

      console.log(CSVText)

      this.downloadFile('Exercise-Records-CSV.txt', CSVText)
    },
  },
}
</script>

<template>
  <v-col class="col-12">
    <v-card>
      <v-card-title>Dashboard Testing</v-card-title>

      <v-card-actions>
        <v-container>
          <v-btn color="success mr-3 mb-3" @click="useDefaults()">
            Set Defaults
          </v-btn>

          <v-btn color="error mr-3 mb-3" @click="clearApp()">
            Clear App
          </v-btn>

          <v-btn color="warning mr-3 mb-3" @click="basicExport()">
            Store Export
          </v-btn>

          <v-btn color="primary mr-3 mb-3" @click="advancedExport()">
            Exercise CSV Export
          </v-btn>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-col>
</template>
