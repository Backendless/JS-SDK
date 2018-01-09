import Utils from '../utils'

import RTListeners from './listeners'

const Storage = new WeakMap()

const ListenerTypes = Utils.mirrorKeys({
  CONNECT    : null,
  COMMAND    : null,
  USER_STATUS: null,
})

export default class RTScopeConnector extends RTListeners {

  static delayedOperation = delayedOperation
  static proxyRTMethod = proxyRTMethod

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

  constructor(initiator) {
    super()

    this.initiator = initiator

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
    return this.initiator.options
  }

  onConnect() {
    this.delayedOperations.forEach(operation => operation())
    this.delayedOperations = []

    const listenersStack = this.simpleListeners[ListenerTypes.CONNECT] || []

    listenersStack.forEach(callback => callback())
  }

  onDisconnect() {
    this.connection = null
  }

  removeAllListeners() {
    this.delayedOperations = []

    super.removeAllListeners()
  }

  addConnectListener(callback) {
    this.addSimpleListener(ListenerTypes.CONNECT, callback)
  }

  removeConnectListeners(callback) {
    this.removeSimpleListener(ListenerTypes.CONNECT, callback)
  }

  @delayedOperation()
  addCommandListener(callback) {
    this.addSubscription(ListenerTypes.COMMAND, this.commandSubscriber, callback)
  }

  @delayedOperation()
  removeCommandListeners(callback) {
    this.stopSubscription(ListenerTypes.COMMAND, { callback })
  }

  @delayedOperation()
  addUserStatusListener(callback) {
    this.addSubscription(ListenerTypes.USER_STATUS, this.usersSubscriber, callback)
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

function proxyRTMethod(method, returnResult) {
  const RTScope = this

  return function() {
    const initiator = this

    if (!Storage.has(initiator)) {
      Storage.set(initiator, new RTScope(initiator))
    }

    const rtScope = Storage.get(initiator)

    const result = rtScope[method](...arguments)

    if (returnResult) {
      return result
    }

    return initiator
  }
}