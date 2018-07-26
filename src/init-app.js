export function initApp(appId, secretKey) {
  const { default: LocalVars } = require('./local-vars')
  const { default: LoggingCollector } = require('./logging/collector')
  const { default: GeoTracker } = require('./geo/tracker-monitor/tracker')
  const { initRTClient } = require('./rt')
  const { setLocalCurrentUser } = require('./users/current-user')

  LocalVars.applicationId = appId
  LocalVars.secretKey = secretKey
  LocalVars.appPath = [LocalVars.serverURL, appId, secretKey].join('/')

  initRTClient()

  LoggingCollector.reset()
  GeoTracker.reset()

  setLocalCurrentUser()
}
