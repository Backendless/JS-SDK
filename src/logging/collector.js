import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'
import Async from '../request/async'

import Logger from './logger'

let lastFlushListeners

const LoggingCollector = {
  loggers      : {},
  pool         : [],
  numOfMessages: 10,
  timeFrequency: 1,

  reset() {
    this.loggers = {}
    this.pool = []
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

    this.checkMessagesLen()
  },

  checkMessagesLen: function() {
    if (this.pool.length >= this.numOfMessages) {
      this.sendRequest()
    }
  },

  flush    : Utils.promisified('_flush'),
  flushSync: Utils.synchronized('_flush'),

  _flush: function(asyncHandler) {
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

      if (asyncHandler) {
        listeners = lastFlushListeners = lastFlushListeners ? lastFlushListeners.splice(0) : []
        listeners.push(asyncHandler)
      }

      Request.put({
        isAsync     : !!asyncHandler,
        asyncHandler: asyncHandler && new Async(cb('success'), cb('fault')),
        url         : Urls.logging(),
        data        : this.pool
      })

      this.pool = []

    } else if (asyncHandler) {
      if (lastFlushListeners) {
        lastFlushListeners.push(asyncHandler)
      } else {
        setTimeout(asyncHandler.success, 0)
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
    this.checkMessagesLen()
  }
}

export default LoggingCollector
