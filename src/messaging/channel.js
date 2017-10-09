import Backendless from '../bundle'
import Utils from '../utils'

import RTConnector from './rt-connector'

const ListenerTypes = Utils.mirrorKeys({
  MESSAGE: null
})

export default class Channel extends RTConnector {

  get connectSubscriber() {
    return Backendless.RT.subscriptions.connectToPubSub
  }

  get usersSubscriber() {
    return Backendless.RT.subscriptions.onPubSubCommand
  }

  get commandSubscriber() {
    return Backendless.RT.subscriptions.onPubSubUserStatus
  }

  get commandSender() {
    return Backendless.RT.methods.sendPubSubCommand
  }

  @RTConnector.delayedOperation()
  addMessageListener(selector, callback) {
    if (typeof selector === 'function') {
      callback = selector
      selector = undefined
    }

    this.addSubscription(ListenerTypes.MESSAGE, Backendless.RT.subscriptions.onPubSubMessage, callback, { selector })
  }

  @RTConnector.delayedOperation()
  removeMessageListener(selector, callback) {
    if (typeof selector === 'function') {
      callback = selector
      selector = undefined
    }

    const argumentsMatcher = subscription => {
      if (selector && callback) {
        return subscription.extraOptions.selector === selector && subscription.callback === callback
      }

      if (selector) {
        return subscription.extraOptions.selector === selector
      }

      if (callback) {
        return !subscription.extraOptions.selector && subscription.callback === callback
      }

      return true
    }

    this.stopSubscription(ListenerTypes.MESSAGE, { argumentsMatcher })
  }

  publish(message, publishOptions, deliveryTarget) {
    publishOptions = { ...publishOptions }

    if (publishOptions.subtopic) {
      publishOptions.subtopic = this.options.subtopic
    }

    return Backendless.Messaging.publish(this.options.name, message, publishOptions, deliveryTarget)
  }

}
