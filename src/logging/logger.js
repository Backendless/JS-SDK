import LoggingCollector from './collector'

export default class Logger {
  constructor(name) {
    this.name = name
  }

  debug(message) {
    return LoggingCollector.push(this.name, 'DEBUG', message)
  }

  info(message) {
    return LoggingCollector.push(this.name, 'INFO', message)
  }

  warn(message, exception) {
    return LoggingCollector.push(this.name, 'WARN', message, exception)
  }

  error(message, exception) {
    return LoggingCollector.push(this.name, 'ERROR', message, exception)
  }

  fatal(message, exception) {
    return LoggingCollector.push(this.name, 'FATAL', message, exception)
  }

  trace(message) {
    return LoggingCollector.push(this.name, 'TRACE', message)
  }
}
