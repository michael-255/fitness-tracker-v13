import { v4 as uuid } from 'uuid'

export class Measurement {
  constructor({ id = uuid(), name = 'My Measurement' } = {}) {
    this.id = id
    this.name = name
  }
}

export class Exercise {
  constructor({ id = uuid(), name = 'My Exercise', inputs = {} } = {}) {
    this.id = id
    this.name = name
    this.inputs = inputs
  }
}

export class Workout {
  constructor({ id = uuid(), name = 'My Workout', exerciseIds = [] } = {}) {
    this.id = id
    this.name = name
    this.exerciseIds = exerciseIds
  }
}

export class Record {
  constructor({
    id = uuid(),
    entityId = null,
    entityName = 'Entity',
    createdTime = new Date().getTime(),
    createdDate = new Date().toDateString(),
    data = {},
  } = {}) {
    this.id = id
    this.entityId = entityId
    this.entityName = entityName
    this.createdTime = createdTime
    this.createdDate = createdDate
    this.data = data
  }
}
