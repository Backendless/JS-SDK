import Utils from '../utils'
import RTUtils from './utils'

const Events = Utils.mirrorKeys({
  SUB_ON : null,
  SUB_OFF: null,
  SUB_RES: null,
})

const Types = Utils.mirrorKeys({
  OBJECTS_CHANGES: null,

  PUB_SUB_CONNECT : null,
  PUB_SUB_MESSAGES: null,
  PUB_SUB_COMMANDS: null,
  PUB_SUB_USERS   : null,

  RSO_CONNECT : null,
  RSO_CHANGES : null,
  RSO_CLEARED : null,
  RSO_COMMANDS: null,
  RSO_INVOKE  : null,
  RSO_USERS   : null,
})

const subscription = type => function(options, callbacks) {
  return this.subscribe(type, options, callbacks)
}

export default class RTSubscriptions {

  constructor(rtProvider) {
    this.rtProvider = rtProvider

    this.subscriptions = {}
  }

  initialize() {
    if (!this.initialized) {
      this.rtProvider.on(Events.SUB_RES, data => this.onSubscriptionResponse(data))

      this.initialized = true
    }
  }

  reconnect() {
    if (this.initialized) {
      this.initialized = false
      this.initialize()
      this.reconnectSubscriptions()
    }
  }

  reconnectSubscriptions() {
    Object
      .keys(this.subscriptions)
      .forEach(subscriptionId => this.onSubscription(subscriptionId))
  }

  subscribe(name, options, { parser, onData, onError, onStop, onReady }) {
    this.initialize()

    const subscriptionId = RTUtils.generateUID()

    this.subscriptions[subscriptionId] = {
      data : { id: subscriptionId, name, options },
      ready: false,
      parser,
      onData,
      onError,
      onStop,
      onReady,
    }

    this.onSubscription(subscriptionId)

    return {
      isReady: () => {
        return !!this.subscriptions[subscriptionId] && this.subscriptions[subscriptionId].ready
      },

      stop: () => {
        if (this.subscriptions[subscriptionId]) {
          this.offSubscription(subscriptionId)
        }
      },
    }
  }

  onSubscription(subscriptionId) {
    const subscription = this.subscriptions[subscriptionId]

    this.rtProvider.emit(Events.SUB_ON, subscription.data)
  }

  offSubscription(subscriptionId) {
    const subscription = this.subscriptions[subscriptionId]

    if (subscription) {
      this.rtProvider.emit(Events.SUB_OFF, { id: subscriptionId })

      if (subscription.onStop) {
        subscription.onStop()
      }

      delete this.subscriptions[subscriptionId]
    }
  }

  onSubscriptionResponse({ id, data, error }) {
    const subscription = this.subscriptions[id]

    if (subscription) {
      if (error) {

        if (subscription.onError) {
          subscription.onError(error)
        }

        if (subscription.onStop) {
          subscription.onStop(error)
        }

        delete this.subscriptions[id]

      } else {
        if (!subscription.ready) {
          subscription.ready = true

          if (subscription.onReady) {
            subscription.onReady()
          }
        }

        if (subscription.onData) {
          if (typeof subscription.parser === 'function') {
            data = subscription.parser(data)
          }

          subscription.onData(data)
        }
      }
    }
  }

  //---------------------------------------//
  //----------- DATA SUBSCRIPTIONS --------//

  onObjectsChanges = subscription(Types.OBJECTS_CHANGES).bind(this)

  //----------- DATA SUBSCRIPTIONS --------//
  //---------------------------------------//

  //---------------------------------------//
  //-------- PUB_SUB SUBSCRIPTIONS --------//

  connectToPubSub = subscription(Types.PUB_SUB_CONNECT).bind(this)
  onPubSubMessage = subscription(Types.PUB_SUB_MESSAGES).bind(this)
  onPubSubCommand = subscription(Types.PUB_SUB_COMMANDS).bind(this)
  onPubSubUserStatus = subscription(Types.PUB_SUB_USERS).bind(this)

  //-------- PUB_SUB SUBSCRIPTIONS --------//
  //---------------------------------------//

  //---------------------------------------//
  //----------- RSO SUBSCRIPTIONS ---------//

  connectToRSO = subscription(Types.RSO_CONNECT).bind(this)
  onRSOChanges = subscription(Types.RSO_CHANGES).bind(this)
  onRSOClear = subscription(Types.RSO_CLEARED).bind(this)
  onRSOCommand = subscription(Types.RSO_COMMANDS).bind(this)
  onRSOInvoke = subscription(Types.RSO_INVOKE).bind(this)
  onRSOUserStatus = subscription(Types.RSO_USERS).bind(this)

  //----------- RSO SUBSCRIPTIONS ---------//
  //---------------------------------------//
}
