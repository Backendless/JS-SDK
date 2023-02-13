import Logger from './logger'

export default class Logging {

  constructor(app) {
    this.app = app

    this.reset()
  }

  reset() {
    this.loggers = {}
    this.messages = []
    this.numOfMessages = 10
    this.timeFrequency = 1
    this.messagesLimit = 100
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
    if (!this.flushRequest && this.messages.length) {
      this.stopFlushInterval()

      const messages = [...this.messages]

      this.messages = []

      this.flushRequest = this.app.request
        .put({
          url : this.app.urls.logging(),
          data: messages
        })
        .catch(error => {
          this.messages = [...messages, ...this.messages]

          this.checkMessagesLimit()

          throw error
        })
        .finally(() => delete this.flushRequest)
    }

    return this.flushRequest
  }

  push(logger, logLevel, message, exception) {
    if (typeof message !== 'string') {
      throw new Error('"message" must be a string')
    }

    this.messages.push({ logger, message, exception, 'log-level': logLevel, timestamp: Date.now() })

    this.checkMessagesLimit()
    this.checkMessagesLen()
  }

  checkMessagesLen() {
    if (this.messages.length >= this.numOfMessages) {
      this.startFlushInterval()
    }
  }

  checkMessagesLimit() {
    if (this.messages.length > this.messagesLimit) {
      this.messages = this.messages.slice(this.messages.length - this.messagesLimit)
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

    if (numOfMessages > this.messagesLimit) {
      this.messagesLimit = numOfMessages
    }

    this.numOfMessages = numOfMessages
    this.timeFrequency = timeFrequency

    this.checkMessagesLen()
  }

  setMessagesLimit(messagesLimit) {
    this.messagesLimit = messagesLimit

    this.checkMessagesLimit()
  }

}
