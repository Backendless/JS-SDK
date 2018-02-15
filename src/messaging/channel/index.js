import Utils from '../../utils'
import { RTProvider, RTScopeConnector } from '../../rt'

import Messaging from '../index'

const ListenerTypes = Utils.mirrorKeys({
  MESSAGE: null
})

export default class Channel extends RTScopeConnector {

  get connectSubscriber() {
    return RTProvider.subscriptions.connectToPubSub
  }

  get usersSubscriber() {
    return RTProvider.subscriptions.onPubSubUserStatus
  }

  get commandSubscriber() {
    return RTProvider.subscriptions.onPubSubCommand
  }

  get commandSender() {
    return RTProvider.methods.sendPubSubCommand
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

  @RTScopeConnector.delayedOperation()
  addMessageListener(selector, callback, onError) {
    if (typeof selector === 'function') {
      onError = callback
      callback = selector
      selector = undefined
    }

    this.addSubscription(ListenerTypes.MESSAGE, RTProvider.subscriptions.onPubSubMessage, {
      callback,
      onError,
      extraOptions: {
        selector
      }
    })
  }

  @RTScopeConnector.delayedOperation()
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
