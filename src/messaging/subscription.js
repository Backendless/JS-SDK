import Utils from '../utils'
import Async from '../request/async'
import Request from '../request'
import PollingProxy from './polling-proxy'
import SocketProxy from './socket-proxy'

export default class Subscription {

  constructor(config) {
    this.channelName = config.channelName
    this.options = config.options
    this.channelProperties = config.channelProperties
    this.subscriptionId = null
    this.restUrl = config.restUrl + '/' + config.channelName
    this.responder = config.responder
    this._subscribe(config.onSubscribe)
  }

  _subscribe(/** async */) {
    const responder = Utils.extractResponder(arguments)
    const isAsync = !!responder
    const self = this

    const _async = new Async(function(data) {
      self.subscriptionId = data.subscriptionId
      self._startSubscription()
    }, function(e) {
      responder.fault(e)
    })

    const subscription = Request.post({
      url         : this.restUrl + '/subscribe',
      isAsync     : isAsync,
      data        : this.options,
      asyncHandler: _async
    })

    if (!isAsync) {
      this.subscriptionId = subscription.subscriptionId
      this._startSubscription()
    }
  }

  _startSubscription() {
    if (WebSocket) {
      const url = this.channelProperties['websocket'] + '/' + this.subscriptionId
      this.proxy = new SocketProxy(url)

      this.proxy.on('socketClose', () => {
        this._switchToPolling()
      })

      this.proxy.on('messageReceived', () => {
        if (this.responder) {
          this.responder()
        }
      })
    } else {
      this._switchToPolling()
    }

    this._startSubscription = function() {
    }
  }

  cancelSubscription() {
    this.proxy && this.proxy.close()
    this._startSubscription = function() {
    }
  }

  _switchToPolling() {
    const url = this.restUrl + '/' + this.subscriptionId
    this.proxy = new PollingProxy(url)
    const self = this

    this.proxy.on('messageReceived', function(data) {
      if (data.messages.length) {
        self.responder(data)
      }
    })
  }
}
