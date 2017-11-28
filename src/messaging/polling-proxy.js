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
    this.xhr = null
    this.needReconnect = true
    this.responder = new Async(this.onMessage, this.onError, this)
    this.poll()
  }

  onMessage(data) {
    clearTimeout(this.timeout)

    this.timer = setTimeout(() => {
      this.poll()
    }, this.interval)

    this.fireEvent('messageReceived', data)
  }

  poll() {
    this.timeout = setTimeout(() => {
      this.onTimeout()
    }, 30 * 1000)

    this.xhr = Request.get({
      url         : this.restUrl,
      isAsync     : true,
      asyncHandler: this.responder
    })
  }

  close() {
    clearTimeout(this.timer)
    clearTimeout(this.timeout)

    this.needReconnect = false

    if (this.xhr) {
      this.xhr.abort()
    }
  }

  onTimeout() {
    this.xhr && this.xhr.abort()
  }

  onError() {
    clearTimeout(this.timer)
    clearTimeout(this.timeout)

    if (this.needReconnect) {
      this.xhr = null

      this.timer = setTimeout(() => {
        this.poll()
      }, this.interval)
    }
  }
}

