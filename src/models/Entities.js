export class Measurement {
  constructor({ name = 'Measurement' } = {}) {
    this.name = name
  }
}

export class Exercise {
  constructor({ name = 'My Exercise', type = null } = {}) {
    this.name = name
    this.type = type
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
