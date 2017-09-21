import { SubscriptionTypes } from '../constants'

export default class RTMessaging {

  constructor(rtClient) {
    this.rtClient = rtClient
  }

  onPubSubMessage(channel, callback, options) {
    this.rtClient.subscribe(SubscriptionTypes.PUB_SUB, { channel, ...options }, callback)
  }

  offPubSubMessage(channel, callback, options) {
    this.rtClient.unsubscribe(SubscriptionTypes.PUB_SUB, { channel, ...options }, callback)
  }
}
