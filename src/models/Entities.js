import { v4 as uuid } from 'uuid'
import { ACTION_TYPE, RECORD_TYPE } from '../constants/globals.js'

class _Entity {
  constructor({ id = uuid(), type = null } = {}) {
    this.id = id
    this.type = type
  }
}

class _Action extends _Entity {
  constructor({ id, type, name = null } = {}) {
    super({ id, type })
    this.name = name
  }
}

export class Measurement extends _Action {
  constructor({ id, name = 'My Measurement' } = {}) {
    super({ id, type: ACTION_TYPE.Measurement, name })
  }
}

export class Exercise extends _Action {
  constructor({ id, name = 'My Exercise', inputs = {} } = {}) {
    super({ id, type: ACTION_TYPE.Exercise, name })
    this.inputs = inputs
  }
}

export class Workout extends _Action {
  constructor({ id, name = 'My Workout', exerciseIds = [] } = {}) {
    super({ id, type: ACTION_TYPE.Workout, name })
    this.exerciseIds = exerciseIds
  }
}

class _Record extends _Entity {
  constructor({
    id,
    type,
    createdAt = new Date().getTime(),
    actionId = null,
    actionName = null,
    date = new Date().toDateString(),
  } = {}) {
    super({ id, type })
    this.createdAt = createdAt
    this.actionId = actionId
    this.actionName = actionName
    this.date = date
  }
}

export class MeasurementRecord extends _Record {
  constructor({
    id,
    createdAt,
    actionId,
    actionName,
    date,
    value = null,
  } = {}) {
    super({
      id,
      type: RECORD_TYPE.MeasurementRecord,
      createdAt,
      actionId,
      actionName,
      date,
    })
    this.value = value
  }
}

export class ExerciseRecord extends _Record {
  constructor({ id, createdAt, actionId, actionName, date, data = {} } = {}) {
    super({
      id,
      type: RECORD_TYPE.ExerciseRecord,
      createdAt,
      actionId,
      actionName,
      date,
    })
    this.data = data
  }
}

export class WorkoutRecord extends _Record {
  constructor({
    id,
    createdAt,
    actionId,
    actionName,
    date,
    endedAt = null,
    duration = null,
  } = {}) {
    super({
      id,
      type: RECORD_TYPE.WorkoutRecord,
      createdAt,
      actionId,
      actionName,
      date,
    })
    this.endedAt = endedAt
    this.duration = duration
  }
}
