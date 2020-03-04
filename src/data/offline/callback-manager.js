const noop = () => {}

const noopCallbacks = [noop, noop]

class CallbackManager {
  constructor() {
    this.callbacks = {
      [ActionTypes.SAVE]  : {},
      [ActionTypes.DELETE]: {}
    }
  }

  register(actionType, tableName, callbacks) {
    this.callbacks[actionType][tableName] = callbacks

    return this
  }

  getCallbacks(actionType, tableName) {
    return this.callbacks[actionType][tableName] || noopCallbacks
  }
}

export const ActionTypes = {
  SAVE  : 'SAVE',
  DELETE: 'DELETE'
}

export const callbackManager = new CallbackManager()
