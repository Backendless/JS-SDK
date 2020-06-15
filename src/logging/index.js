import Logger from './logger'

export default class Logging {

  constructor(app) {
    this.app = app

    this.reset()
  }

  reset() {
    this.loggers = {}
    this.pool = []
    this.numOfMessages = 10
    this.timeFrequency = 1
  }

  getLogger(loggerName) {
    if (!loggerName || typeof loggerName !== 'string') {
      throw new Error('Logger Name must be provided and must be a string.')
    }

    if (!this.loggers[loggerName]) {
      this.loggers[loggerName] = new Logger(loggerName, this)
    }

    return this.loggers[loggerName]
  }

  async flush() {
    if (!this.flushRequest && this.pool.length) {
      this.stopFlushInterval()

      this.flushRequest = this.app.request
        .put({
          url : this.app.urls.logging(),
          data: this.pool
        })
        .then(() => {
          delete this.flushRequest
        })

      this.pool = []
    }

    return this.flushRequest
  }

  push(logger, logLevel, message, exception) {
    this.pool.push({ logger, message, exception, 'log-level': logLevel, timestamp: Date.now() })

    this.checkMessagesLen()
  }

  checkMessagesLen() {
    if (this.pool.length >= this.numOfMessages) {
      this.startFlushInterval()
    }
  }

  startFlushInterval() {
    if (!this.flushInterval) {
      this.flushInterval = setTimeout(() => this.flush(), this.timeFrequency * 1000)
    }
  }

  stopFlushInterval() {
    if (this.flushInterval) {
      clearTimeout(this.flushInterval)

      delete this.flushInterval
    }
  }

  setLogReportingPolicy(numOfMessages, timeFrequency) {
    if (timeFrequency !== undefined && this.timeFrequency !== timeFrequency) {
      this.stopFlushInterval()
    }

    this.numOfMessages = numOfMessages
    this.timeFrequency = timeFrequency

    this.checkMessagesLen()
  }

}
