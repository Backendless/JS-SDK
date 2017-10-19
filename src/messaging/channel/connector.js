import Utils from '../../utils'
import { RTProvider, RTScopeConnector } from '../../rt'

const ListenerTypes = Utils.mirrorKeys({
  MESSAGE: null
})

export default class RTChannelConnector extends RTScopeConnector {

  get connectSubscriber() {
    return RTProvider.subscriptions.connectToPubSub
  }

  get usersSubscriber() {
    return RTProvider.subscriptions.onPubSubCommand
  }

  get commandSubscriber() {
    return RTProvider.subscriptions.onPubSubUserStatus
  }

  get commandSender() {
    return RTProvider.methods.sendPubSubCommand
  }

  @RTScopeConnector.delayedOperation()
  addMessageListener(selector, callback) {
    if (typeof selector === 'function') {
      callback = selector
      selector = undefined
    }

    this.addSubscription(ListenerTypes.MESSAGE, RTProvider.subscriptions.onPubSubMessage, callback, { selector })
  }

  @RTScopeConnector.delayedOperation()
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

}
