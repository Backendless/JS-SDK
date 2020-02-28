import { deprecated } from '../decorators'

import LoggingCollector from './collector'

class Logging {
  constructor(app) {
    this.app = app
    this.loggingCollector = new LoggingCollector(app)
  }

  getLogger(...args) {
    return this.loggingCollector.getLogger(...args)
  }

  @deprecated('Backendless.Logging', 'Backendless.Logging.flush')
  flushSync(...args) {
    return this.loggingCollector.flushSync(...args)
  }

  flush(...args) {
    return this.loggingCollector.flush(...args)
  }

  reset(...args) {
    return this.loggingCollector.reset(...args)
  }

  setLogReportingPolicy(...args) {
    return this.loggingCollector.setLogReportingPolicy(...args)
  }
}

export default Logging
