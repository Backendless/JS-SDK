import Backendless from '../bundle'

import { Subscriptions } from './subscriptions'
import { Methods } from './methods'
import { RTSocket } from './socket'

const NativeSocketEvents = {
  CONNECT          : 'connect',
  CONNECT_ERROR    : 'connect_error',
  CONNECT_TIMEOUT  : 'connect_timeout',
  DISCONNECT       : 'disconnect',
  RECONNECT        : 'reconnect',
  RECONNECT_ATTEMPT: 'reconnect_attempt',
  RECONNECTING     : 'reconnecting',
  RECONNECT_ERROR  : 'reconnect_error',
  RECONNECT_FAILED : 'reconnect_failed',
  ERROR            : 'error',
  PING             : 'ping',
  PONG             : 'pong',
}

const delayedOnEvent = event => function(cb) {
  this.runDelayedMethod('on', event, cb)
}

const delayedOffEvent = event => function(cb) {
  this.runDelayedMethod('off', event, cb)
}

export default class RTClient {

  constructor() {
    RTSocket.destroy()
    RTSocket.onInit(this.getInitOptions)

    this.initialized = false
    this.delayedCallbacks = []

    this.subscriptions = new Subscriptions(this)
    this.methods = new Methods(this)
  }

  getInitOptions = () => {
    return {
      onInit   : this.socketInit,
      userToken: Backendless.getUserToken()
    }
  }

  updateUserToken() {
    if (this.initialized) {
      this.methods.updateUserToken({ userToken: Backendless.getUserToken() })
    }
  }

  socketInit = () => {
    this.initialized = true

    this.delayedCallbacks.forEach(([method, args]) => this[method](...args))
    this.delayedCallbacks = []
  }

  runDelayedMethod(method, ...args) {
    if (this.initialized) {
      this[method](...args)

    } else {
      this.delayedCallbacks.push([method, args])
    }
  }
}

Object.setPrototypeOf(RTClient.prototype, {

  on  : RTSocket.proxy('on'),
  off : RTSocket.proxy('off'),
  emit: RTSocket.proxy('emit'),

  onConnect : delayedOnEvent(NativeSocketEvents.CONNECT),
  offConnect: delayedOffEvent(NativeSocketEvents.CONNECT),

  onConnectError : delayedOnEvent(NativeSocketEvents.CONNECT_ERROR),
  offConnectError: delayedOffEvent(NativeSocketEvents.CONNECT_ERROR),

  onConnectTimeout : delayedOnEvent(NativeSocketEvents.CONNECT_TIMEOUT),
  offConnectTimeout: delayedOffEvent(NativeSocketEvents.CONNECT_TIMEOUT),

  onDisconnect : delayedOnEvent(NativeSocketEvents.DISCONNECT),
  offDisconnect: delayedOffEvent(NativeSocketEvents.DISCONNECT),

  onReconnect : delayedOnEvent(NativeSocketEvents.RECONNECT),
  offReconnect: delayedOffEvent(NativeSocketEvents.RECONNECT),

  onReconnectAttempt : delayedOnEvent(NativeSocketEvents.RECONNECT_ATTEMPT),
  offReconnectAttempt: delayedOffEvent(NativeSocketEvents.RECONNECT_ATTEMPT),

  onReconnecting : delayedOnEvent(NativeSocketEvents.RECONNECTING),
  offReconnecting: delayedOffEvent(NativeSocketEvents.RECONNECTING),

  onReconnectError : delayedOnEvent(NativeSocketEvents.RECONNECT_ERROR),
  offReconnectError: delayedOffEvent(NativeSocketEvents.RECONNECT_ERROR),

  onReconnectFailed : delayedOnEvent(NativeSocketEvents.RECONNECT_FAILED),
  offReconnectFailed: delayedOffEvent(NativeSocketEvents.RECONNECT_FAILED)

  // onError : onEvent(NativeSocketEvents.ERROR),
  // offError: offEvent(NativeSocketEvents.ERROR),
  //
  // onPing : onEvent(NativeSocketEvents.PING),
  // offPing: offEvent(NativeSocketEvents.PING),
  //
  // onPong : onEvent(NativeSocketEvents.PONG),
  // offPong: offEvent(NativeSocketEvents.PONG)

})
