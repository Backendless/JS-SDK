import { deprecated } from '../decorators'

import LoggingCollector from './collector'

const Logging = {

  getLogger: LoggingCollector.getLogger,

  @deprecated('Backendless.Logging', 'Backendless.Logging.flush')
  flushSync: LoggingCollector.flushSync,
  flush    : LoggingCollector.flush,

  setLogReportingPolicy: LoggingCollector.setLogReportingPolicy
}

export default Logging
