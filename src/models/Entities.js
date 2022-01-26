import { v4 as uuid } from 'uuid'

export class _Entity {
  constructor({ id = uuid() } = {}) {
    this.id = id
  }
}

export class Measurement extends _Entity {
  constructor({ id } = {}) {
    super({ id })
    this.name = 'Measurement'
  }
}

export class Exercise extends _Entity {
  constructor({ id, name = 'My Exercise', inputs = {} } = {}) {
    super({ id })
    this.name = name
    this.inputs = inputs
  }
}

export class Workout extends _Entity {
  constructor({ id, name = 'My Workout', exerciseIds = [] } = {}) {
    super({ id })
    this.name = name
    this.exerciseIds = exerciseIds
  }
}

export class Record extends _Entity {
  constructor({
    id,
    associatedEntityId = null,
    createdAt = new Date().toISOString(),
    data = {},
  } = {}) {
    super({ id })
    this.associatedEntityId = associatedEntityId
    this.createdAt = createdAt
    this.data = data
  }
}
