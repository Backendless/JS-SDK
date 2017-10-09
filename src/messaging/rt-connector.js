import Utils from '../utils'

const delayedOperation = usePromise => (target, key, descriptor) => {
  const decorated = descriptor.value

  descriptor.value = function() {
    const run = () => decorated.apply(this, arguments)

    if (this.isConnected()) {
      return run() || this
    }

    if (usePromise) {
      return new Promise((resolve, reject) => this.delayedOperations.push(() => run().then(resolve, reject)))
    }

    this.delayedOperations.push(run)

    return this
  }

  return descriptor
}

const ListenerTypes = Utils.mirrorKeys({
  CONNECT    : null,
  ERROR      : null,
  COMMAND    : null,
  USER_STATUS: null,
})

export default class RTConnector {

  static get delayedOperation() {
    return delayedOperation
  }

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
    this.options = options

    this.delayedOperations = []

    this.connectSubscription = null
    this.subscriptions = {}

    this.simpleListeners = {}

    this.connect()
  }

  connect() {
    if (!this.isConnected()) {
      this.connection = this.connectSubscriber(this.options, null, {
        onReady: () => this.onConnect(),
        onError: () => this.onError(error),
        onStop : () => this.onDisconnect()
      })
    }

    return this
  }

  disconnect() {
    if (this.isConnected()) {
      this.removeAllListeners()

      this.connection.stop()
    }

    return this
  }

  isConnected() {
    return !!this.connection && this.connection.isReady()
  }

  addSubscription(type, subscriberFn, callback, extraOptions) {
    const subscriptionsStack = this.subscriptions[type] = this.subscriptions[type] || []

    const options = {
      ...this.options,
      ...extraOptions
    }

    const subscription = subscriberFn(options, callback, {
      onError: this.onError,
      onStop : () => this.subscriptions[type] = this.subscriptions[type].filter(s => s.subscription !== subscription),
    })

    subscriptionsStack.push({ callback, extraOptions, subscription })
  }

  stopSubscription(type, { callback, argumentsMatcher }) {
    const subscriptionsStack = this.subscriptions[type] = this.subscriptions[type] || []

    if (argumentsMatcher) {
      subscriptionsStack.forEach(s => {
        if (argumentsMatcher(s)) {
          s.subscription.stop()
        }
      })

    } else {
      subscriptionsStack.forEach(s => {
        if (!callback || s.callback === callback) {
          s.subscription.stop()
        }
      })
    }
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

  onError(error) {
    const listenersStack = this.simpleListeners[ListenerTypes.ERROR] || []

    listenersStack.forEach(callback => callback(error))
  }

  removeAllListeners() {
    this.delayedOperations = []

    Object.keys(this.subscriptions).map(listenerType => {
      this.subscriptions[listenerType].forEach(({ subscription }) => subscription.stop())
    })

    Object.keys(this.simpleListeners).map(listenerType => {
      this.simpleListeners[listenerType] = []
    })

    return this
  }

  addSimpleListener(type, callback) {
    const listenersStack = this.simpleListeners[type] = this.simpleListeners[type] || []

    listenersStack.push(callback)

    return this
  }

  removeSimpleListener(type, callback) {
    if (this.simpleListeners[type]) {
      this.simpleListeners[type] = callback
        ? this.simpleListeners[type].filter(cb => cb !== callback)
        : []
    }

    return this
  }

  addConnectListener(callback) {
    return this.addSimpleListener(ListenerTypes.CONNECT, callback)
  }

  removeConnectListener(callback) {
    return this.removeSimpleListener(ListenerTypes.CONNECT, callback)
  }

  addErrorListener(callback) {
    return this.addSimpleListener(ListenerTypes.ERROR, callback)
  }

  removeErrorListener(callback) {
    return this.removeSimpleListener(ListenerTypes.ERROR, callback)
  }

  @delayedOperation()
  addCommandListener(callback) {
    this.addSubscription(ListenerTypes.COMMAND, this.commandSubscriber, callback)
  }

  @delayedOperation()
  removeCommandListener(callback) {
    this.stopSubscription(ListenerTypes.COMMAND, { callback })
  }

  @delayedOperation()
  addUserStatusListener(callback) {
    this.addSubscription(ListenerTypes.USER_STATUS, this.usersSubscriber, callback)
  }

  @delayedOperation()
  removeUserStatusListener(callback) {
    this.stopSubscription(ListenerTypes.USER_STATUS, { callback })
  }

  @delayedOperation(true)
  send(type, data) {
    return this.commandSender({ ...this.options, type, data })
  }

}
