export default class DeliveryOptions {
  constructor(args) {
    args = args || {}

    this.publishPolicy = args.publishPolicy || undefined
    this.pushBroadcast = args.pushBroadcast || undefined
    this.pushSinglecast = args.pushSinglecast || undefined
    this.publishAt = args.publishAt || undefined
    this.repeatEvery = args.repeatEvery || undefined
    this.repeatExpiresAt = args.repeatExpiresAt || undefined
  }
}
