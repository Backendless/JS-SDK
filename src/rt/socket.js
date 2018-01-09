import io from 'socket.io-client'

import Request from '../request'
import Urls from '../urls'
import LocalVars from '../local-vars'
import { getCurrentUserToken } from '../users/current-user'

import { NativeSocketEvents } from './constants'

const INITIAL_RECONNECTION_TIMEOUT = 200
const MAX_RECONNECTION_TIMEOUT = 5 * 1000

const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))

function tryToConnect(nativeEvents, attempt = 1) {
  return Request.get({ url: Urls.rtLookup(), asyncHandler: {} })
    .catch(error => {
      if (nativeEvents[NativeSocketEvents.CONNECT_ERROR]) {
        nativeEvents[NativeSocketEvents.CONNECT_ERROR].forEach(callback => callback(error))
      }

      throw error
    })
    .then(rtServerHost => {
      const rtSocket = new RTSocket(rtServerHost, nativeEvents)

      return new Promise((resolve, reject) => {
        rtSocket.on(NativeSocketEvents.CONNECT, () => resolve(rtSocket))
        rtSocket.on(NativeSocketEvents.CONNECT_ERROR, reject)
        rtSocket.on(NativeSocketEvents.CONNECT_TIMEOUT, reject)
      })
    })
    .catch(() => {
      const factor = INITIAL_RECONNECTION_TIMEOUT * Math.pow(2, attempt)
      const timeout = Math.min(factor, MAX_RECONNECTION_TIMEOUT)

      // wait for 400|800|1600|...|MAX_RECONNECTION_TIMEOUT milliseconds
      return wait(timeout).then(() => tryToConnect(nativeEvents, attempt + 1))
    })
}

export default class RTSocket {

  static connect(nativeEvents) {
    return tryToConnect(nativeEvents)
  }

  constructor(host, nativeEvents) {
    this.events = {}

    this.ioSocket = io(`${host}/${LocalVars.applicationId}`, {
      reconnection: false,
      path        : `/${LocalVars.applicationId}`,
      query       : { apiKey: LocalVars.secretKey, userToken: getCurrentUserToken() }
    })

    if (nativeEvents) {
      Object.keys(nativeEvents).forEach(event => {
        nativeEvents[event].forEach(callback => this.on(event, callback))
      })
    }
  }

  close() {
    this.events = {}
    this.ioSocket.off()
    this.ioSocket.close()
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.ioSocket.on(event, data => this.onEvent(event, data))
    }

    this.events[event] = this.events[event] || []
    this.events[event].push(callback)
  }

  off(event, callback) {
    this.events[event] = callback
      ? this.events[event].filter(f => f !== callback)
      : []

    if (!this.events[event].length) {
      delete this.events[event]
    }

    if (!this.events[event]) {
      this.ioSocket.off(event)
    }
  }

  onEvent(event, data) {
    logMessage('FROM SERVER', event, data)

    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data))
    }
  }

  emit(event, data) {
    logMessage('TO SERVER', event, data)

    this.ioSocket.emit(event, data)
  }

}

function logMessage(type, event, data) {
  if (LocalVars.debugMode) {
    console.log(`[${type}] - [event: ${event}] - arguments: ${JSON.stringify(data)} `)
  }
}