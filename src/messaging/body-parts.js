export default class Bodyparts {
  constructor(args) {
    args = args || {}

    this.textmessage = args && args.textmessage
    this.htmlmessage = args && args.htmlmessage
  }
}