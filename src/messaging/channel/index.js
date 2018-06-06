import Utils from '../../utils'
import { RTClient, RTScopeConnector, disallowInBusinessLogic } from '../../rt'

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

  @disallowInBusinessLogic('MessagingChannel.addMessageListener')
  @RTScopeConnector.connectionRequired()
  addMessageListener(selector, callback, onError) {
    if (typeof selector === 'function') {
      onError = callback
      callback = selector
      selector = undefined
    }

    this.addSubscription(ListenerTypes.MESSAGE, RTClient.subscriptions.onPubSubMessage, {
      callback,
      onError,
      params: {
        selector
      }
    })
  }

  removeMessageListener(selector, callback) {
    if (typeof selector === 'function') {
      callback = selector
      selector = undefined
    }

    if (selector && typeof selector !== 'string') {
      throw new Error('"selector" must be string')
    }

    if (typeof callback !== 'function') {
      throw new Error('"callback" must be function')
    }

    const matcher = subscription => {
      const params = subscription.params

      if (selector) {
        return params.selector === selector && params.callback === callback
      }

      return subscription.callback === callback
    }

    this.stopSubscription(ListenerTypes.MESSAGE, { matcher })
  }

  removeMessageListeners(selector) {
    if (typeof selector !== 'string') {
      throw new Error('"selector" must be string')
    }

    const matcher = subscription => subscription.params.selector === selector

    this.stopSubscription(ListenerTypes.MESSAGE, { matcher })
  }

  removeAllMessageListeners() {
    this.stopSubscription(ListenerTypes.MESSAGE, {})
  }

  @disallowInBusinessLogic('MessagingChannel.addCommandListener')
  addCommandListener() {
    return super.addCommandListener.apply(this, arguments)
  }

  @disallowInBusinessLogic('MessagingChannel.addUserStatusListener')
  addUserStatusListener() {
    return super.addUserStatusListener.apply(this, arguments)
  }

  join() {
    super.connect()
  }

  leave() {
    super.disconnect()
  }

  isJoined() {
    return super.isConnected()
  }
}
