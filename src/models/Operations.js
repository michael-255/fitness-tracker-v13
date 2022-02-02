import { OPERATION_TYPE } from '../constants/globals.js'

class _Operation {
  constructor(type) {
    this.type = type
  }
}

export class CreateOperation extends _Operation {
  constructor({ onEntity = null, newData = null } = {}) {
    super(OPERATION_TYPE.CreateOperation)
    this.onEntity = onEntity
    this.newData = newData
  }
}

export class UpdateOperation extends _Operation {
  constructor({ onEntity = null, thisData = null } = {}) {
    super(OPERATION_TYPE.UpdateOperation)
    this.onEntity = onEntity
    this.thisData = thisData
  }
}

export class RemoveOperation extends _Operation {
  constructor({ onEntity = null, theseIds = null } = {}) {
    super(OPERATION_TYPE.RemoveOperation)
    this.onEntity = onEntity
    this.theseIds = theseIds
  }
}

export class ClearOperation extends _Operation {
  constructor({ theseEntities = null } = {}) {
    super(OPERATION_TYPE.ClearOperation)
    this.theseEntities = theseEntities
  }
}
