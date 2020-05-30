import { APP_ID } from './contants'
import Backendless from './sandbox'

const RT_SERVER_PORT = 12345

export const RTSocketEvents = {
  CONNECT: 'CONNECT',

  SUB_ON   : 'SUB_ON',
  SUB_OFF  : 'SUB_OFF',
  SUB_RES  : 'SUB_RES',
  SUB_READY: 'SUB_READY',

  MET_REQ: 'MET_REQ',
  MET_RES: 'MET_RES',
}

export const RTSubscriptionTypes = {
  OBJECTS_CHANGES: 'OBJECTS_CHANGES',

  PUB_SUB_CONNECT : 'PUB_SUB_CONNECT',
  PUB_SUB_MESSAGES: 'PUB_SUB_MESSAGES',
  PUB_SUB_COMMANDS: 'PUB_SUB_COMMANDS',
  PUB_SUB_USERS   : 'PUB_SUB_USERS',

  RSO_CONNECT : 'RSO_CONNECT',
  RSO_CHANGES : 'RSO_CHANGES',
  RSO_CLEARED : 'RSO_CLEARED',
  RSO_COMMANDS: 'RSO_COMMANDS',
  RSO_INVOKE  : 'RSO_INVOKE',
  RSO_USERS   : 'RSO_USERS',
}

export const RTMethodTypes = {
  SET_USER_TOKEN: 'SET_USER_TOKEN',

  RSO_GET    : 'RSO_GET',
  RSO_SET    : 'RSO_SET',
  RSO_CLEAR  : 'RSO_CLEAR',
  RSO_COMMAND: 'RSO_COMMAND',
  RSO_INVOKE : 'RSO_INVOKE',

  PUB_SUB_COMMAND: 'PUB_SUB_COMMAND',
}

export function createMockRTServer() {
  const server = require('http').createServer()

  const io = require('socket.io')({ path: `/${APP_ID}` })

  io.attach(server, {
    pingInterval: 10000,
    pingTimeout : 5000,
  })

  const receivedEvents = {}
  const requestedEvents = {}

  function onMessage(type, data) {
    if (rtServer.debug) {
      console.log('FROM_CLIENT:', type, data)
    }

    receivedEvents[type] = receivedEvents[type] || []
    requestedEvents[type] = requestedEvents[type] || []

    if (requestedEvents[type].length) {
      requestedEvents[type].shift()(data)
    } else {
      receivedEvents[type].push(data)
    }
  }

  const getNextEvent = type => () => {
    receivedEvents[type] = receivedEvents[type] || []

    if (receivedEvents[type].length) {
      return Promise.resolve(receivedEvents[type].shift())
    }

    return new Promise(resolve => {
      requestedEvents[type] = requestedEvents[type] || []
      requestedEvents[type].push(resolve)
    })
  }

  let socket

  io.of(`/${APP_ID}`).on('connection', (s) => {
    socket = s

    const { apiKey, clientId, userToken } = socket.handshake.query

    socket.on(RTSocketEvents.MET_REQ, data => onMessage(RTSocketEvents.MET_REQ, data))
    socket.on(RTSocketEvents.SUB_ON, data => onMessage(RTSocketEvents.SUB_ON, data))
    socket.on(RTSocketEvents.SUB_OFF, data => onMessage(RTSocketEvents.SUB_OFF, data))

    onMessage(RTSocketEvents.CONNECT, { apiKey, clientId, userToken: userToken === 'null' ? null : userToken })
  })

  const emit = (type, data) => {
    setTimeout(() => {
      if (rtServer.debug) {
        console.log('FROM_SERVER', type, data)
      }

      socket.emit(type, data)
    }, 0)
  }

  const getUnprocessedEvents = () => {
    const result = []

    Object.keys(receivedEvents).forEach(type => {
      result.push(...receivedEvents[type])
    })

    return result
  }

  const rtServer = {
    RTSocketEvents,
    RTSubscriptionTypes,
    RTMethodTypes,

    receivedEvents,
    requestedEvents,

    debug: false,

    host: `http://localhost:${RT_SERVER_PORT}`,

    getNext_CONNECT: getNextEvent(RTSocketEvents.CONNECT),
    getNext_MET_REQ: getNextEvent(RTSocketEvents.MET_REQ),
    getNext_SUB_ON : getNextEvent(RTSocketEvents.SUB_ON),
    getNext_SUB_OFF: getNextEvent(RTSocketEvents.SUB_OFF),

    getUnprocessedEvents,

    subReady(id) {
      emit(RTSocketEvents.SUB_READY, { id })
    },

    subRes(id, data, error) {
      emit(RTSocketEvents.SUB_RES, { id, data, error })
    },

    metRes(id, result, error) {
      emit(RTSocketEvents.MET_RES, { id, result, error })
    },

    stop() {
      Backendless.resetRT()

      server.close()

      return getUnprocessedEvents()
    }
  }

  return new Promise((resolve, reject) => {
    server.listen(RT_SERVER_PORT, error => {
      if (error) {
        reject(error)
      } else {
        resolve(rtServer)
      }
    })
  })
}
