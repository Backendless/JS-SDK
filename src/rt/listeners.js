export default class RTListeners {

  constructor() {
    this.subscriptions = {}
    this.simpleListeners = {}
  }

  addSubscription(type, subscriberFn, callback, onError, extraOptions) {
    const subscriptionsStack = this.subscriptions[type] = this.subscriptions[type] || []

    const options = {
      ...this.getSubscriptionOptions(),
      ...extraOptions
    }

    const subscription = subscriberFn(options, {
      onData : callback,
      onError: onError,
      onStop : () => this.subscriptions[type] = this.subscriptions[type].filter(s => s.subscription !== subscription),
    })

    subscriptionsStack.push({ callback, extraOptions, subscription })
  }

  getSubscriptionOptions() {
    return {}
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

  addSimpleListener(type, callback) {
    const listenersStack = this.simpleListeners[type] = this.simpleListeners[type] || []

    listenersStack.push(callback)
  }

  removeSimpleListener(type, callback) {
    if (this.simpleListeners[type]) {
      this.simpleListeners[type] = callback
        ? this.simpleListeners[type].filter(cb => cb !== callback)
        : []
    }
  }

  runSimpleListeners(type, ...args) {
    if (this.simpleListeners[type]) {
      this.simpleListeners[type].forEach(callback => callback(...args))
    }
  }

  removeAllListeners() {
    Object.keys(this.subscriptions).map(listenerType => {
      this.subscriptions[listenerType].forEach(({ subscription }) => subscription.stop())
    })

    Object.keys(this.simpleListeners).map(listenerType => {
      this.simpleListeners[listenerType] = []
    })
  }
}
