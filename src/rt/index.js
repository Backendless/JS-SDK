import { Subscriptions } from './subscriptions'
import { Methods } from './methods'
import { NativeSocketEvents } from './constants'
import { RTSocket } from './socket'

import Data from './services/data'
import Messaging from './services/messaging'
import RemoteSharedObject from './services/rso'

const delayedOnEvent = event => function(cb) {
  this.runDelayedMethod('on', event, cb)
}

const delayedOffEvent = event => function(cb) {
  this.runDelayedMethod('off', event, cb)
}

export class RTClient {

  constructor() {
    RTSocket.destroy()
    RTSocket.onInit(this.socketInit.bind(this))

    this.initialized = false
    this.delayedCallbacks = []

    this.subscriptions = new Subscriptions(this)
    this.methods = new Methods(this)

    this.DATA = new Data(this)
    this.MESSAGING = new Messaging(this)
    this.RSO = new RemoteSharedObject(this)
  }

  socketInit() {
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

  subscribe(name, options, callback) {
    this.subscriptions.subscribe(name, options, callback)
  }

  unsubscribe(name, options, callback) {
    this.subscriptions.unsubscribe(name, options, callback)
  }

  send(name, options, callback) {
    this.methods.send(name, options, callback)
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
