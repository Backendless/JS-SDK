import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'
import Async from '../request/async'

import Logger from './logger'

let lastFlushListeners

const LoggingCollector = {
  loggers      : {},
  pool         : [],
  messagesCount: 0,
  numOfMessages: 10,
  timeFrequency: 1,

  reset() {
    this.loggers = {}
    this.pool = []
    this.messagesCount = 0
    this.numOfMessages = 10
    this.timeFrequency = 1
  },

  getLogger(loggerName) {
    if (!Utils.isString(loggerName)) {
      throw new Error("Invalid 'loggerName' value. LoggerName must be a string value")
    }

    return this.loggers[loggerName] = this.loggers[loggerName] || new Logger(loggerName)
  },

  push(logger, logLevel, message, exception) {
    const messageObj = {
      logger,
      logLevel,
      message,
      exception,
      timestamp: Date.now()
    }

    this.pool.push(messageObj)
    this.messagesCount++
    this.checkMessagesLen()
  },

  flush    : Utils.promisified('_flush'),
  flushSync: Utils.synchronized('_flush'),

  _flush: function() {
    const async = Utils.extractResponder(arguments)

    if (this.pool.length) {
      if (this.flushInterval) {
        clearTimeout(this.flushInterval)
      }

      let listeners

      const cb = method => function() {
        listeners.forEach(callbacks => {
          callbacks[method].apply(null, arguments)
        })

        if (listeners === lastFlushListeners) {
          lastFlushListeners = null
        }
      }

      if (async) {
        listeners = lastFlushListeners = lastFlushListeners ? lastFlushListeners.splice(0) : []
        listeners.push(async)
      }

      Backendless._ajax({
        method      : 'PUT',
        isAsync     : !!async,
        asyncHandler: async && new Async(cb('success'), cb('fault')),
        url         : Urls.logging(),
        data        : JSON.stringify(this.pool)
      })

      this.pool = []
      this.messagesCount = 0

    } else if (async) {
      if (lastFlushListeners) {
        lastFlushListeners.push(async)
      } else {
        setTimeout(async.success, 0)
      }
    }
  },

  sendRequest: function() {
    this.flushInterval = setTimeout(() => this.flush(), this.timeFrequency * 1000)
  },

  setLogReportingPolicy: function(numOfMessages, timeFrequency) {
    this.numOfMessages = numOfMessages
    this.timeFrequency = timeFrequency

    //TODO: check when set new timeFrequency
    if (this.messagesCount > (this.numOfMessages - 1)) {
      this.sendRequest()
    }
  }
}

export default LoggingCollector
