import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'
import Async from '../request/async'

import Logger from './logger'

let lastFlushListeners

function flush(asyncHandler) {
  if (LoggingCollector.pool.length) {
    if (LoggingCollector.flushInterval) {
      clearTimeout(LoggingCollector.flushInterval)
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

    console.log('LoggingCollector.pool', LoggingCollector.pool)

    Request.put({
      isAsync     : !!asyncHandler,
      asyncHandler: asyncHandler && new Async(cb('success'), cb('fault')),
      url         : Urls.logging(),
      data        : LoggingCollector.pool
    })

    LoggingCollector.pool = []

  } else if (asyncHandler) {
    if (lastFlushListeners) {
      lastFlushListeners.push(asyncHandler)
    } else {
      setTimeout(asyncHandler.success, 0)
    }
  }
}

const LoggingCollector = {

  reset() {
    LoggingCollector.loggers = {}
    LoggingCollector.pool = []
    LoggingCollector.numOfMessages = 10
    LoggingCollector.timeFrequency = 1
  },

  getLogger(loggerName) {
    if (!Utils.isString(loggerName)) {
      throw new Error("Invalid 'loggerName' value. LoggerName must be a string value")
    }

    return LoggingCollector.loggers[loggerName] = LoggingCollector.loggers[loggerName] || new Logger(loggerName)
  },

  push(logger, logLevel, message, exception) {
    const messageObj = {
      logger,
      message,
      exception,
      'log-level': logLevel,
      timestamp: Date.now()
    }

    LoggingCollector.pool.push(messageObj)

    LoggingCollector.checkMessagesLen()
  },

  checkMessagesLen() {
    if (LoggingCollector.pool.length >= LoggingCollector.numOfMessages) {
      LoggingCollector.sendRequest()
    }
  },

  flush    : Utils.promisified(flush),
  flushSync: Utils.synchronized(flush),

  sendRequest() {
    LoggingCollector.flushInterval = setTimeout(() => LoggingCollector.flush(), LoggingCollector.timeFrequency * 1000)
  },

  setLogReportingPolicy(numOfMessages, timeFrequency) {
    LoggingCollector.numOfMessages = numOfMessages
    LoggingCollector.timeFrequency = timeFrequency

    //TODO: check when set new timeFrequency
    LoggingCollector.checkMessagesLen()
  }
}

LoggingCollector.reset()

export default LoggingCollector
