export default class Logger {
  /**
   * @param {string} name
   * @param {LoggingCollector} loggingCollector
   */
  constructor(name, loggingCollector) {
    this.name = name
    this.loggingCollector = loggingCollector
  }

  debug(message) {
    return this.loggingCollector.push(this.name, 'DEBUG', message)
  }

  info(message) {
    return this.loggingCollector.push(this.name, 'INFO', message)
  }

  warn(message, exception) {
    return this.loggingCollector.push(this.name, 'WARN', message, exception)
  }

  error(message, exception) {
    return this.loggingCollector.push(this.name, 'ERROR', message, exception)
  }

  fatal(message, exception) {
    return this.loggingCollector.push(this.name, 'FATAL', message, exception)
  }

  trace(message) {
    return this.loggingCollector.push(this.name, 'TRACE', message)
  }
}