/** @deprecated */
export default class SubscriptionOptions {
  constructor(args) {
    // eslint-disable-next-line no-console
    console.warn('"SubscriptionOptions" is deprecated and nowhere used.')
    // eslint-disable-next-line no-console
    console.warn('"SubscriptionOptions" class will be removed in the nearest release.')

    args = args || {}

    this.subscriberId = args.subscriberId || undefined
    this.subtopic = args.subtopic || undefined
    this.selector = args.selector || undefined
  }
}
