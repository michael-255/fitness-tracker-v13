import { v4 as uuid } from 'uuid'

class _Entity {
  constructor({ id = uuid(), name = null } = {}) {
    this.id = id
    this.name = name
  }
}

export class Measurement extends _Entity {
  constructor({ id, name = 'My Measurement' } = {}) {
    super({ id, name })
  }
}

export class Exercise extends _Entity {
  constructor({ id, name = 'My Exercise', inputs = {} } = {}) {
    super({ id, name })
    this.inputs = inputs
  }
}

export class Workout extends _Entity {
  constructor({ id, name = 'My Workout', exerciseIds = [] } = {}) {
    super({ id, name })
    this.exerciseIds = exerciseIds
  }
}

export class Record {
  constructor({
    entityId = null,
    entityName = 'My Entity',
    createdAt = new Date().getTime(),
    data = {},
  } = {}) {
    this.entityId = entityId
    this.entityName = entityName
    this.createdAt = createdAt
    this.data = data
  }
}
