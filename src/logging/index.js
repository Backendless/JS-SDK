import LoggingCollector from './collector'

const Logging = {

  getLogger: LoggingCollector.getLogger,

  flush    : LoggingCollector.flush,
  flushSync: LoggingCollector.flushSync,

  setLogReportingPolicy: LoggingCollector.setLogReportingPolicy
}

export default Logging
