const LogLevelPriorities = {
  off  : 0,
  fatal: 1,
  error: 2,
  warn : 3,
  info : 4,
  debug: 5,
  trace: 6,
  all  : 6,
}

export default class Logger {

  constructor(name, logging) {
    this.name = name
    this.logging = logging
  }

  debug(message) {
    return this.log('DEBUG', message)
  }

  info(message) {
    return this.log('INFO', message)
  }

  warn(message, exception) {
    return this.log('WARN', message, exception)
  }

  error(message, exception) {
    return this.log('ERROR', message, exception)
  }

  fatal(message, exception) {
    return this.log('FATAL', message, exception)
  }

  trace(message) {
    return this.log('TRACE', message)
  }

  log(level, message, exception) {
    if (this.min(level)) {
      return this.logging.push(this.name, level, message, exception)
    }
  }

  min(level) {
    level = level.toLowerCase()

    const globalLevel = this.logging.globalLevel
    const loggerLevel = this.logging.levels[this.name]

    if (globalLevel && LogLevelPriorities[globalLevel.toLowerCase()] < LogLevelPriorities[level]) {
      return false
    }

    if (!loggerLevel) {
      return true
    }

    return LogLevelPriorities[loggerLevel.toLowerCase()] >= LogLevelPriorities[level]
  }
}
