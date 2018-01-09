import { getCurrentUserToken } from '../users/current-user'

import { NativeSocketEvents } from './constants'
import Subscriptions from './subscriptions'
import Methods from './methods'
import Socket from './socket'

const provideConnectionOnMethod = method => (...args) => {
  RTProvider
    .provideConnection()
    .then(rtSocket => rtSocket[method](...args))
}

const RTProvider = {

  on  : provideConnectionOnMethod('on'),
  off : provideConnectionOnMethod('off'),
  emit: provideConnectionOnMethod('emit'),

  init() {
    this.destroyConnection()

    this.nativeEvents = {}

    this.subscriptions = new Subscriptions(this)
    this.methods = new Methods(this)

    this.addNativeEventListener(NativeSocketEvents.DISCONNECT, this.onDisconnect.bind(this))
  },

  updateUserToken() {
    if (this.socketPromise) {
      this.methods.updateUserToken({ userToken: getCurrentUserToken() })
    }
  },

  addNativeEventListener(event, callback) {
    this.nativeEvents[event] = this.nativeEvents[event] || []
    this.nativeEvents[event].push(callback)

    if (this.socketPromise) {
      this.on(event, callback)
    }
  },

  removeNativeEventListener(event, callback) {
    if (this.nativeEvents[event]) {
      this.nativeEvents[event] = this.nativeEvents[event].filter(cb => cb !== callback)

      if (!this.nativeEvents[event].length) {
        delete this.nativeEvents[event]
      }

      if (this.socketPromise) {
        this.off(event, callback)
      }
    }
  },

  provideConnection() {
    if (this.socketPromise) {
      return this.socketPromise
    }

    return this.socketPromise = Socket.connect(this.nativeEvents)
  },

  destroyConnection() {
    if (this.socketPromise) {
      this.socketPromise.then(rtSocket => rtSocket.close())

      delete this.socketPromise
    }
  },

  reconnect() {
    this.destroyConnection()

    this.provideConnection()
      .then(() => {
        this.subscriptions.reconnect()
        this.methods.reconnect()
      })
  },

  onDisconnect() {
    this.reconnect()
  },
}

export default RTProvider
