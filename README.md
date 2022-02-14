# Fitness Tracker v13

Fitness Tracker Web App v13

## Todo - Continue carefully refactoring the project

- Implement `Import` feature:
  - Imports state data from `vue-fitness-progression (v11)`
  - Will need to map over old records to the new record ids (by name?)
  - Will require some data manipulation for the new records
- Implement `Charts` features:
  - Will need to include a charting package for the app
  - Add charts above record summaries
  - Create charts screen with measurements, exercises, and workouts
- App cleanup:
  - Cleanup `store.js` functions by moving some to the component level
  - Implement custom `Dialogs` to replace browser confirm boxes (Vuetify?)
  - Increment Fit Data Version for `inProgressMeasurements` removal
