# Fitness Tracker v13

Fitness Tracker Web App v13

## Todo

- Add the workout timer footer from an older version of this app
- Workout previous Date and Duration on card
- Workout record summaries
- Exercise record summaries

## WIP Notes

```javascript
// FILE -----------------------------------------------------------------------
const defaultState = () => ({
  [ENTITY_KEY.measurements]: [],
  [ENTITY_KEY.exercises]: [],
  [ENTITY_KEY.workouts]: [],
})

// FILE -----------------------------------------------------------------------
import { v4 as uuid } from 'uuid'

export class Measurement {
  constructor({ id = uuid(), name = 'My Measurement', records = [] } = {}) {
    this.id = id
    this.name = name
    this.records = records
  }
}

export class Exercise {
  constructor({
    id = uuid(),
    name = 'My Exercise',
    inputs = {},
    records = [],
    activeRecords = [],
  } = {}) {
    this.id = id
    this.name = name
    this.inputs = inputs
    this.records = records
    this.activeRecords = activeRecords
  }
}

export class Workout {
  constructor({
    id = uuid(),
    name = 'My Workout',
    exerciseIds = [],
    records = [],
    activeRecord = {},
  } = {}) {
    this.id = id
    this.name = name
    this.exerciseIds = exerciseIds
    this.records = records
    this.activeRecord = activeRecord
  }
}

export class Record {
  constructor({
    id = uuid(),
    createdTime = new Date().getTime(),
    createdDate = new Date().toDateString(),
    data = {},
  } = {}) {
    this.id = id
    this.createdTime = createdTime
    this.createdDate = createdDate
    this.data = data
  }
}
```
