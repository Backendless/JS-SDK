import io from 'socket.io-client'

import Backendless from '../bundle'

const getRTServerHost = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ host: 'http://localhost:5000', token: 'some-token' })
    }, 300)
  })
}

const logMessage = (type, event, data) => {
  if (Backendless.debugMode) {
    console.log(`[${type}] - [event: ${event}] - arguments: ${JSON.stringify(data)} `)
  }
}

let rtSocketPromise = null

let initializeCallbacks = []

export class RTSocket {

  static onInit(cb) {
    initializeCallbacks.push(cb)
  }

  static destroy() {
    if (rtSocketPromise) {
      rtSocketPromise.then(rtClient => rtClient.socket.close())
      rtSocketPromise = undefined
    }

    initializeCallbacks = []
  }

  static proxy(rtClientMethod) {
    return (...args) => {
      if (!rtSocketPromise) {
        rtSocketPromise = getRTServerHost().then(({ host, token }) => {
          const rtClient = new RTSocket(host, token)

          initializeCallbacks.forEach(cb => cb())

          return rtClient
        })
      }

      rtSocketPromise.then(rtClient => rtClient[rtClientMethod](...args))
    }
  }

  constructor(host, token) {
    this.host = host
    this.token = token
    this.socket = io(this.host, { path: `/${Backendless.applicationId}/${this.token}` })

    this.events = {}
    this.subscribedEvents = {}

    this.debugMode = false
  }

  on(event, callback) {
    this.events[event] = this.events[event] || []
    this.events[event].push(callback)

    if (!this.subscribedEvents[event]) {
      this.socket.on(event, data => {
        logMessage('FROM SERVER', event, data)

        this.events[event].forEach(callback => callback(data))
      })

      this.subscribedEvents[event] = true
    }
  }

  off(event, callback) {
    this.events[event] = callback
      ? this.events[event].filter(f => f !== callback)
      : []
  }

  emit(event, options) {
    logMessage('TO SERVER', event, options)

    this.socket.emit(event, options)
  }

}
