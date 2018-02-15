import LocalVars from './local-vars'
import LoggingCollector from './logging/collector'
import GeoTrackerMonitor from './geo/tracker-monitor'
import { initRTClient } from './rt'
import { setLocalCurrentUser } from './users/current-user'

export function initApp(appId, secretKey) {
  LocalVars.applicationId = appId
  LocalVars.secretKey = secretKey
  LocalVars.appPath = [LocalVars.serverURL, appId, secretKey].join('/')

  initRTClient()

  LoggingCollector.reset()
  GeoTrackerMonitor.reset()

  setLocalCurrentUser()
}
