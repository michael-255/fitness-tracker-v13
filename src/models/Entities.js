export class Measurement {
  constructor() {
    this.name = 'Measurement'
  }
}

export class Exercise {
  constructor({ name = 'My Exercise', inputs = {} } = {}) {
    this.name = name
    this.inputs = inputs
  }
}

export class Workout {
  constructor({ name = 'My Workout', exerciseIds = [] } = {}) {
    this.name = name
    this.exerciseIds = exerciseIds
  }
}

export class Record {
  constructor({
    entityId = null,
    createdAt = new Date().toISOString(),
    data = {},
  } = {}) {
    this.entityId = entityId
    this.createdAt = createdAt
    this.data = data
  }
}
