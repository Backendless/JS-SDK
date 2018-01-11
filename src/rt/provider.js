import { getCurrentUserToken } from '../users/current-user'

import { NativeSocketEvents } from './constants'
import Subscriptions from './subscriptions'
import Methods from './methods'
import Socket from './socket'

const INITIAL_RECONNECTION_TIMEOUT = 200
const MAX_RECONNECTION_TIMEOUT = 60 * 60 * 1000 // a hour

const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))

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

    this.connectAttempt = 0

    this.nativeEvents = {}

    this.subscriptions = new Subscriptions(this)
    this.methods = new Methods(this)
  },

  updateUserToken() {
    if (this.socketPromise) {
      this.methods.updateUserToken({ userToken: getCurrentUserToken() })
    }
  },

  addNativeEventListener(event, callback) {
    this.nativeEvents[event] = this.nativeEvents[event] || []
    this.nativeEvents[event].push(callback)
  },

  removeNativeEventListener(event, callback) {
    if (this.nativeEvents[event]) {
      this.nativeEvents[event] = this.nativeEvents[event].filter(cb => cb !== callback)

      if (!this.nativeEvents[event].length) {
        delete this.nativeEvents[event]
      }
    }
  },

  runNativeEventListeners(event, ...args) {
    if (this.nativeEvents[event]) {
      this.nativeEvents[event].forEach(callback => callback(...args))
    }
  },

  provideConnection() {
    if (this.socketPromise) {
      return this.socketPromise
    }

    this.socketPromise = this.tryToConnect()

    this.socketPromise
      .then(() => {
        this.subscriptions.reconnect()
        this.methods.reconnect()
      })

    return this.socketPromise
  },

  tryToConnect() {
    this.connectAttempt = this.connectAttempt + 1

    return Socket.connect(this.onDisconnect.bind(this))
      .then(rtSocket => {
        this.onConnect()

        return rtSocket
      })
      .catch(error => {
        const factor = INITIAL_RECONNECTION_TIMEOUT * Math.pow(2, this.connectAttempt)
        const timeout = Math.min(factor, MAX_RECONNECTION_TIMEOUT)

        this.onConnectError(error)

        // wait for 400|800|1600|...|MAX_RECONNECTION_TIMEOUT milliseconds
        return wait(timeout).then(() => {
          this.onConnectAttempt(this.connectAttempt - 1, timeout)

          return this.tryToConnect()
        })
      })
  },

  destroyConnection() {
    if (this.socketPromise) {
      this.socketPromise.then(rtSocket => rtSocket.close())

      delete this.socketPromise
    }
  },

  onDisconnect(reason) {
    this.destroyConnection()
    this.provideConnection()

    this.runNativeEventListeners(NativeSocketEvents.DISCONNECT, reason)
  },

  onConnect() {
    this.connectAttempt = 0

    this.runNativeEventListeners(NativeSocketEvents.CONNECT)
  },

  onConnectError(error) {
    this.runNativeEventListeners(NativeSocketEvents.CONNECT_ERROR, error)
  },

  onConnectAttempt(attempt, timeout) {
    this.runNativeEventListeners(NativeSocketEvents.RECONNECT_ATTEMPT, attempt, timeout)
  },

}

export default RTProvider
