import Request from '../request'
import Async from '../request/async'
import Proxy from './proxy'

export default class PollingProxy extends Proxy {

  constructor(url) {
    super()

    this.restUrl = url
    this.timer = 0
    this.timeout = 0
    this.interval = 1000
    this.stopped = false
    this.responder = new Async(this.onMessage, this.onError, this)

    this.poll()
  }

  poll() {
    clearTimeout(this.timer)
    clearTimeout(this.timeout)

    this.timeout = setTimeout(() => this.onTimeout(), 30 * 1000)

    Request.get({
      url         : this.restUrl,
      isAsync     : true,
      asyncHandler: this.responder
    })
  }

  close() {
    clearTimeout(this.timer)
    clearTimeout(this.timeout)

    this.stopped = true
  }

  onTimeout() {
    clearTimeout(this.timeout)

    this.poll()
  }

  onMessage(data) {
    clearTimeout(this.timer)
    clearTimeout(this.timeout)

    if (!this.stopped) {
      this.timer = setTimeout(() => this.poll(), this.interval)

      this.fireEvent('messageReceived', data)
    }
  }

  onError() {
    clearTimeout(this.timer)
    clearTimeout(this.timeout)

    if (!this.stopped) {
      this.timer = setTimeout(() => this.poll(), this.interval)
    }
  }
}

