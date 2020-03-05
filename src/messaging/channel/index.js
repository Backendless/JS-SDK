import Utils from '../../utils'
import { RTScopeConnector } from '../../rt'

const ListenerTypes = Utils.mirrorKeys({
  MESSAGE: null
})

export default class Channel extends RTScopeConnector {
  constructor(options, app) {
    super(options)

    this.app = app

    this.connect()
  }

  get connectSubscriber() {
    return this.app.RT.subscriptions.connectToPubSub
  }

  get usersSubscriber() {
    return this.app.RT.subscriptions.onPubSubUserStatus
  }

  get commandSubscriber() {
    return this.app.RT.subscriptions.onPubSubCommand
  }

  get commandSender() {
    return this.app.RT.methods.sendPubSubCommand
  }

  getScopeOptions() {
    const { name } = this.options

    return {
      channel: name
    }
  }

  connect() {
    if (this.app) {
      return super.connect()
    }
  }

  publish(message, publishOptions, deliveryTarget) {
    return this.app.Messaging.publish(this.options.name, message, publishOptions, deliveryTarget)
  }

  @RTScopeConnector.connectionRequired()
  addMessageListener(selector, callback, onError) {
    if (typeof selector === 'function') {
      onError = callback
      callback = selector
      selector = undefined
    }

    this.addSubscription(ListenerTypes.MESSAGE, this.app.RT.subscriptions.onPubSubMessage, {
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

  addCommandListener() {
    return super.addCommandListener.apply(this, arguments)
  }

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
