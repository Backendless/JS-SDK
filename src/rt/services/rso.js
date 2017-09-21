import { SubscriptionTypes, MethodTypes } from '../constants'

export default class RTRemoteSharedObject {

  constructor(rtClient) {
    this.rtClient = rtClient
  }

  connect(name, callback) {
    this.rtClient.subscribe(SubscriptionTypes.RSO_CONNECT, { name }, callback)
  }

  disconnect(name, callback) {
    this.rtClient.unsubscribe(SubscriptionTypes.RSO_CONNECT, { name }, callback)
  }

  get(name, key, callback) {
    if (!callback && typeof key === 'function') {
      callback = key
      key = undefined
    }

    this.rtClient.send(MethodTypes.RSO_GET, { name, key }, callback)
  }

  set(name, key, data, callback) {
    if (!callback) {
      if (typeof data === 'function') {
        callback = data
        data = key
        key = undefined

      } else if(!data){
        data = key
        key = undefined
      }
    }

    this.rtClient.send(MethodTypes.RSO_SET, { name, key, data }, callback)
  }

  clear(name, callback) {
    this.rtClient.send(MethodTypes.RSO_CLEAR, { name }, callback)
  }

  onEvent(name, event, callback) {
    this.rtClient.subscribe(SubscriptionTypes.RSO_EVENT, { name, event }, callback)
  }

  offEvent(name, event, callback) {
    this.rtClient.unsubscribe(SubscriptionTypes.RSO_EVENT, { name, event }, callback)
  }
}
