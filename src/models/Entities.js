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
    startTime = new Date().getTime(),
    endTime = null,
    createdDate = new Date().toDateString(),
    duration = {},
    data = {},
  } = {}) {
    this.id = id
    this.startTime = startTime
    this.endTime = endTime
    this.createdDate = createdDate
    this.duration = duration
    this.data = data
  }
}
