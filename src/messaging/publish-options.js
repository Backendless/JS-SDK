export default class PublishOptions {
  constructor(args) {
    args = args || {}

    this.publisherId = args.publisherId || undefined
    this.headers = args.headers || undefined
    this.subtopic = args.subtopic || undefined
  }
}
