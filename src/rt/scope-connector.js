import Utils from '../utils'

import RTListeners from './listeners'

const ListenerTypes = Utils.mirrorKeys({
  CONNECT    : null,
  ERROR      : null,
  COMMAND    : null,
  USER_STATUS: null,
})

export default class RTScopeConnector extends RTListeners {

  static delayedOperation = delayedOperation

  get connectSubscriber() {
    return null
  }

  get commandSubscriber() {
    return null
  }

  get usersSubscriber() {
    return null
  }

  get commandSender() {
    return null
  }

  constructor(options) {
    super()

    this.options = options

    this.delayedOperations = []

    this.connect()
  }

  connect() {
    if (!this.isConnected()) {
      this.connection = this.connectSubscriber(this.getScopeOptions(), {
        onError: error => this.onError(error),
        onReady: () => this.onConnect(),
        onStop : () => this.onDisconnect()
      })
    }
  }

  disconnect() {
    if (this.isConnected()) {
      this.removeAllListeners()

      this.connection.stop()
    }
  }

  isConnected() {
    return !!this.connection && this.connection.isReady()
  }

  getSubscriptionOptions() {
    return this.getScopeOptions()
  }

  getScopeOptions() {
    return this.options
  }

  onConnect() {
    this.delayedOperations.forEach(operation => operation())
    this.delayedOperations = []

    this.runSimpleListeners(ListenerTypes.CONNECT)
  }

  onError(error) {
    this.runSimpleListeners(ListenerTypes.ERROR, error)
  }

  onDisconnect() {
    this.connection = null
  }

  removeAllListeners() {
    this.delayedOperations = []

    super.removeAllListeners()
  }

  addConnectListener(callback, onError) {
    this.addSimpleListener(ListenerTypes.CONNECT, callback)

    if (onError) {
      this.addSimpleListener(ListenerTypes.ERROR, onError)
    }
  }

  removeConnectListeners(callback, onError) {
    this.removeSimpleListener(ListenerTypes.CONNECT, callback)

    if (onError) {
      this.removeSimpleListener(ListenerTypes.ERROR, onError)
    }
  }

  @delayedOperation()
  addCommandListener(callback, onError) {
    this.addSubscription(ListenerTypes.COMMAND, this.commandSubscriber, {
      callback,
      onError
    })
  }

  @delayedOperation()
  removeCommandListeners(callback) {
    this.stopSubscription(ListenerTypes.COMMAND, { callback })
  }

  @delayedOperation()
  addUserStatusListener(callback, onError) {
    this.addSubscription(ListenerTypes.USER_STATUS, this.usersSubscriber, {
      callback,
      onError
    })
  }

  @delayedOperation()
  removeUserStatusListeners(callback) {
    this.stopSubscription(ListenerTypes.USER_STATUS, { callback })
  }

  @delayedOperation(true)
  send(type, data) {
    return this.commandSender({ ...this.getScopeOptions(), type, data })
  }

}

function delayedOperation(usePromise) {
  return function(target, key, descriptor) {
    const decorated = descriptor.value

    descriptor.value = function() {
      const run = () => decorated.apply(this, arguments)

      if (this.isConnected()) {
        return run()
      }

      if (usePromise) {
        return new Promise((resolve, reject) => this.delayedOperations.push(() => run().then(resolve, reject)))
      }

      this.delayedOperations.push(run)
    }

    return descriptor
  }
}
