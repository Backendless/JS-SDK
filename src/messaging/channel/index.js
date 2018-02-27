import Utils from '../../utils'
import { RTClient, RTScopeConnector } from '../../rt'

import Messaging from '../index'

const ListenerTypes = Utils.mirrorKeys({
  MESSAGE: null
})

export default class Channel extends RTScopeConnector {

  get connectSubscriber() {
    return RTClient.subscriptions.connectToPubSub
  }

  get usersSubscriber() {
    return RTClient.subscriptions.onPubSubUserStatus
  }

  get commandSubscriber() {
    return RTClient.subscriptions.onPubSubCommand
  }

  get commandSender() {
    return RTClient.methods.sendPubSubCommand
  }

  getScopeOptions() {
    const { name } = this.options

    return {
      channel: name
    }
  }

  publish(message, publishOptions, deliveryTarget) {
    return Messaging.publish(this.options.name, message, publishOptions, deliveryTarget)
  }

  @RTScopeConnector.connectionRequired()
  addMessageListener(selector, callback, onError) {
    if (typeof selector === 'function') {
      onError = callback
      callback = selector
      selector = undefined
    }

    this.addScopeSubscription(ListenerTypes.MESSAGE, RTClient.subscriptions.onPubSubMessage, {
      callback,
      onError,
      extraOptions: {
        selector
      }
    })
  }

  @RTScopeConnector.connectionRequired()
  removeMessageListeners(selector, callback) {
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
}
