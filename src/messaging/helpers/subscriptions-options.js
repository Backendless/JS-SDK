//TODO: should be removed
export default class SubscriptionOptions {
  constructor(args) {
    args = args || {}

    this.subscriberId = args.subscriberId || undefined
    this.subtopic = args.subtopic || undefined
    this.selector = args.selector || undefined
  }
}
