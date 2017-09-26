import Backendless from '../bundle'
import Utils from '../utils'
import Async from '../request/async'

let lastFlushListeners

Backendless.Logging = {
  loggers      : {},
  logInfo      : [],
  messagesCount: 0,
  numOfMessages: 10,
  timeFrequency: 1,

  getLogger: function(loggerName) {
    if (!Utils.isString(loggerName)) {
      throw new Error("Invalid 'loggerName' value. LoggerName must be a string value")
    }

    if (!this.loggers[loggerName]) {
      this.loggers[loggerName] = new Logging(loggerName)
    }

    return this.loggers[loggerName]
  },

  flush: Utils.promisified('_flush'),

  flushSync: Utils.synchronized('_flush'),

  _flush: function() {
    const async = Utils.extractResponder(arguments)

    if (this.logInfo.length) {
      if (this.flushInterval) {
        clearTimeout(this.flushInterval)
      }

      let listeners

      const cb = method => function() {
        for (let i = 0; i < listeners.length; i++) {
          listeners[i][method].apply(null, arguments)
        }

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
        url         : Backendless.appPath + '/log',
        data        : JSON.stringify(this.logInfo)
      })

      this.logInfo = []
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
    const logging = this

    this.flushInterval = setTimeout(function() {
      logging.flush()
    }, this.timeFrequency * 1000)
  },

  checkMessagesLen: function() {
    if (this.messagesCount > (this.numOfMessages - 1)) {
      this.sendRequest()
    }
  },

  setLogReportingPolicy: function(numOfMessages, timeFrequency) {
    this.numOfMessages = numOfMessages
    this.timeFrequency = timeFrequency
    this.checkMessagesLen()
  }
}

function Logging(name) {
  this.name = name
}

function setLogMessage(logger, logLevel, message, exception) {
  const messageObj = {}
  messageObj['message'] = message
  messageObj['timestamp'] = Date.now()
  messageObj['exception'] = (exception) ? exception : null
  messageObj['logger'] = logger
  messageObj['log-level'] = logLevel
  Backendless.Logging.logInfo.push(messageObj)
  Backendless.Logging.messagesCount++
  Backendless.Logging.checkMessagesLen()
}

Logging.prototype = {
  debug: function(message) {
    return setLogMessage(this.name, 'DEBUG', message)
  },
  info : function(message) {
    return setLogMessage(this.name, 'INFO', message)
  },
  warn : function(message, exception) {
    return setLogMessage(this.name, 'WARN', message, exception)
  },
  error: function(message, exception) {
    return setLogMessage(this.name, 'ERROR', message, exception)
  },
  fatal: function(message, exception) {
    return setLogMessage(this.name, 'FATAL', message, exception)
  },
  trace: function(message) {
    return setLogMessage(this.name, 'TRACE', message)
  }
}

export default Logging
