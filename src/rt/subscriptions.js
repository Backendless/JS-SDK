import _isEqual from 'lodash/isEqual'
import { SubscriptionEvents } from './constants'
import { RTUtils } from './utils'

export class Subscriptions {

  constructor(rtClient) {
    this.rtClient = rtClient

    this.subscriptions = {}
  }

  initialize() {
    if (!this.initialized) {
      this.rtClient.on(SubscriptionEvents.SUB_RES, data => this.onSubscriptionResponse(data))
      this.rtClient.on(SubscriptionEvents.SUB_END, data => this.onSubscriptionEnd(data))
      this.rtClient.onReconnect(() => this.reconnectSubscriptions())

      this.initialized = true
    }
  }

  reconnectSubscriptions() {
    Object.keys(this.subscriptions).forEach(subscriptionId => this.onSubscription(subscriptionId))
  }

  subscribe(name, options, callback) {
    this.initialize()
    //TODO: make sure of unique subscriptionId
    const subscriptionId = RTUtils.generateUID()

    this.subscriptions[subscriptionId] = {
      data: { id: subscriptionId, name, options },
      callback
    }

    this.onSubscription(subscriptionId)
  }

  unsubscribe(name, options, callback) {
    const subscription = this.findSub(name, options)

    //TODO: remove all subscription according to options
    //TODO: [subName, {foo:bar}, callback] => unsubscribe all subscriptions for specific callback
    //TODO: [subName, {foo:bar}] => unsubscribe all subscriptions for specific options
    //TODO: [subName] => unsubscribe all subscriptions for specific subName
    //TODO: [] => unsubscribe all subscriptions

    if (subscription) {
      this.offSubscription(subscription.data.id)
    }
  }

  onSubscription(subscriptionId) {
    const subscription = this.subscriptions[subscriptionId]

    this.rtClient.emit(SubscriptionEvents.SUB_ON, subscription.data)
  }

  offSubscription(subscriptionId) {
    this.rtClient.emit(SubscriptionEvents.SUB_OFF, { id: subscriptionId })

    delete this.subscriptions[subscriptionId]
  }

  findSub(name, options) {
    let subscription

    Object.keys(this.subscriptions).forEach(subscriptionId => {
      const sub = this.subscriptions[subscriptionId]

      if (sub.data.name === name && _isEqual(sub.data.options, options)) {
        subscription = sub
      }
    })

    return subscription
  }

  onSubscriptionResponse(data) {
    const subscription = this.subscriptions[data.id]

    if (subscription && subscription.callback) {
      subscription.callback(data.error, data.result)
    }
  }

  onSubscriptionEnd(data) {
    this.onSubscriptionResponse(data)

    delete this.subscriptions[data.id]
  }

}
