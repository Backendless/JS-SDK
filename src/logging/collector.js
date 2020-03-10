import Utils from '../utils'
import Async from '../request/async'

class LoggingCollector {
  /**
   * @param {Backendless} app
   */
  constructor(app) {
    this.app = app

    this.flush = Utils.promisified(this.flush)
    this.flushSync = Utils.synchronized(this.flush)

    this.reset()
  }

  reset() {
    this.lastFlushListeners = []
    this.loggers = {}
    this.pool = []
    this.numOfMessages = 10
    this.timeFrequency = 1
  }

  getLogger(loggerName) {
    if (!Utils.isString(loggerName)) {
      throw new Error("Invalid 'loggerName' value. LoggerName must be a string value")
    }

    const { default: Logger } = require('./logger')
    const logger = this.loggers[loggerName] || new Logger(loggerName, this)

    this.loggers[loggerName] = logger

    return logger
  }

  push(logger, logLevel, message, exception) {
    const messageObj = {
      logger,
      message,
      exception,
      'log-level': logLevel,
      timestamp  : Date.now()
    }

    this.pool.push(messageObj)

    this.checkMessagesLen()
  }

  checkMessagesLen() {
    if (this.pool.length >= this.numOfMessages) {
      this.sendRequest()
    }
  }

  sendRequest() {
    if (!this.flushInterval) {
      this.flushInterval = setTimeout(
        () => this.flush(),
        this.timeFrequency * 1000
      )
    }
  }

  setLogReportingPolicy(numOfMessages, timeFrequency) {
    this.numOfMessages = numOfMessages
    this.timeFrequency = timeFrequency

    //TODO: check when set new timeFrequency
    this.checkMessagesLen()
  }

  flush(asyncHandler) {
    if (this.pool.length) {
      if (this.flushInterval) {
        clearTimeout(this.flushInterval)
        delete this.flushInterval
      }

      let listeners
      const loggingCollector = this

      const cb = method => function() {
        listeners.forEach(callbacks => {
          callbacks[method].apply(null, arguments)
        })

        if (listeners === loggingCollector.lastFlushListeners) {
          loggingCollector.lastFlushListeners = null
        }
      }

      if (asyncHandler) {
        listeners = this.lastFlushListeners = this.lastFlushListeners ? this.lastFlushListeners.splice(0) : []
        listeners.push(asyncHandler)
      }

      this.app.request.put({
        isAsync     : !!asyncHandler,
        asyncHandler: asyncHandler && new Async(cb('success'), cb('fault')),
        url         : this.app.urls.logging(),
        data        : this.pool
      })

      this.pool = []

    } else if (asyncHandler) {
      if (this.lastFlushListeners) {
        this.lastFlushListeners.push(asyncHandler)
      } else {
        setTimeout(asyncHandler.success, 0)
      }
    }
  }
}

export default LoggingCollector
