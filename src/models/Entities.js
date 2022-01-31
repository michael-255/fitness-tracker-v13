import { v4 as uuid } from 'uuid'

export class Measurement {
  constructor({ id = uuid(), name = 'My Measurement' } = {}) {
    this.id = id
    this.name = name
  }
}

export class Exercise {
  constructor({ id = uuid(), name = 'My Exercise', setCount = 1 } = {}) {
    this.id = id
    this.name = name
    this.setCount = setCount
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
    entityName = 'My Entity',
    createdAt = new Date().getTime(),
    data = {},
  } = {}) {
    this.id = id
    this.entityId = entityId
    this.entityName = entityName
    this.createdAt = createdAt
    this.data = data
  }
}
