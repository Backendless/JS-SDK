import { RTScopeConnector } from '../../rt'

const ListenerTypes = {
  MESSAGE: 'MESSAGE'
}

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
      throw new Error('Selector must be a string.')
    }

    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function.')
    }

    const matcher = subscription => {
      if (selector) {
        return subscription.params.selector === selector && subscription.callback === callback
      }

      return subscription.callback === callback
    }

    this.stopSubscription(ListenerTypes.MESSAGE, { matcher })
  }

  removeMessageListeners(selector) {
    if (typeof selector !== 'string') {
      throw new Error('Selector must be a string.')
    }

    const matcher = subscription => subscription.params.selector === selector

    this.stopSubscription(ListenerTypes.MESSAGE, { matcher })
  }

  removeAllMessageListeners() {
    this.stopSubscription(ListenerTypes.MESSAGE, {})
  }

  addCommandListener(callback, onError) {
    super.addCommandListener.call(this, callback, onError)

    return this
  }

  addUserStatusListener(callback, onError) {
    super.addUserStatusListener.call(this, callback, onError)

    return this
  }

  removeCommandListener(callback) {
    super.removeCommandListeners.call(this, callback)

    return this
  }

  removeCommandListeners(callback) {
    super.removeCommandListeners.call(this, callback)

    return this
  }

  removeUserStatusListeners(callback) {
    super.removeUserStatusListeners.call(this, callback)

    return this
  }

  addConnectListener(callback, onError) {
    super.addConnectListener.call(this, callback, onError)

    return this
  }

  removeConnectListeners(callback, onError) {
    super.removeConnectListeners.call(this, callback, onError)

    return this
  }

  removeAllListeners() {
    super.removeAllListeners.call(this)

    return this
  }

  send(type, data) {
    return super.send.call(this, type, data)
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
