import Backendless from './bundle'
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

  Backendless.applicationId = appId
  Backendless.secretKey = secretKey
  Backendless.appPath = [Backendless.serverURL, appId, secretKey].join('/')
}
