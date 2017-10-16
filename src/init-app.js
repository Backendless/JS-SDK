import LocalVars from './local-vars'
import LoggingCollector from './logging/collector'
import GeoTrackerMonitor from './geo/tracker-monitor'
import Data from './data'
import { setLocalCurrentUser } from './users/current-user'

export function initApp(appId, secretKey) {
  LoggingCollector.reset()
  GeoTrackerMonitor.reset()

  //TODO: remove it
  Data.reset()

  setLocalCurrentUser()

  LocalVars.applicationId = appId
  LocalVars.secretKey = secretKey
  LocalVars.appPath = [LocalVars.serverURL, appId, secretKey].join('/')
}
