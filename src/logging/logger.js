export default class Logger {

  constructor(name, logging) {
    this.name = name
    this.logging = logging
  }

  debug(message) {
    return this.logging.push(this.name, 'DEBUG', message)
  }

  info(message) {
    return this.logging.push(this.name, 'INFO', message)
  }

  warn(message, exception) {
    return this.logging.push(this.name, 'WARN', message, exception)
  }

  error(message, exception) {
    return this.logging.push(this.name, 'ERROR', message, exception)
  }

  fatal(message, exception) {
    return this.logging.push(this.name, 'FATAL', message, exception)
  }

  trace(message) {
    return this.logging.push(this.name, 'TRACE', message)
  }
}
