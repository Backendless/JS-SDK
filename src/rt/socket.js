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

let initializer

export class RTSocket {

  static onInit(_initializer) {
    initializer = _initializer
  }

  static destroy() {
    if (rtSocketPromise) {
      rtSocketPromise.then(rtClient => rtClient.socket.close())
      rtSocketPromise = undefined
    }

    initializer = undefined
  }

  static proxy(rtClientMethod) {
    return (...args) => {
      if (!rtSocketPromise) {
        const { userToken, onInit } = initializer()

        rtSocketPromise = getRTServerHost().then(({ host, token }) => {
          const rtSocket = new RTSocket(host, token, userToken)


          onInit()

          return rtSocket
        })
      }

      rtSocketPromise.then(rtSocket => rtSocket[rtClientMethod](...args))
    }
  }

  constructor(host, token, userToken) {
    this.host = host
    this.token = token
    this.socket = io(this.host, { path: `/${Backendless.applicationId}/${this.token}`, query: { userToken } })

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
