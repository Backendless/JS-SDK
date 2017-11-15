import io from 'socket.io-client'

import LocalVars from '../local-vars'

let socketPromise = null
let initializer = null

export default class RTSocket {

  static setInitializer(_initializer) {
    initializer = _initializer
  }

  static destroy() {
    if (socketPromise) {
      socketPromise.then(rtSocket => rtSocket.socket.close())
      socketPromise = null
    }

    initializer = null
  }

  static starterMethod(methodName) {
    return (...args) => {
      if (!socketPromise) {
        socketPromise = launchSocket()
      }

      socketPromise.then(rtSocket => rtSocket[methodName](...args))
    }
  }

  constructor(host, token, userToken) {
    this.socket = io(`${host}/${LocalVars.applicationId}`, {
      path : `/${LocalVars.applicationId}`,
      query: { secretKey: LocalVars.secretKey, token, userToken }
    })

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

    if (this.subscribedEvents[event] && !this.events[event].length) {
      this.socket.off(event)
      this.subscribedEvents[event] = false
    }
  }

  emit(event, data) {
    logMessage('TO SERVER', event, data)

    this.socket.emit(event, data)
  }

}

function getSocketServerHost() {
  //TODO: temporary solution
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ host: `http://${window.location.hostname}:5000`, token: 'some-token' })
    }, 300)
  })
}

function launchSocket() {
  const { userToken, onInit } = initializer()

  return getSocketServerHost().then(({ host, token }) => {
    const rtSocket = new RTSocket(host, token, userToken)

    onInit()

    return rtSocket
  })
}

function logMessage(type, event, data) {
  if (LocalVars.debugMode) {
    console.log(`[${type}] - [event: ${event}] - arguments: ${JSON.stringify(data)} `)
  }
}