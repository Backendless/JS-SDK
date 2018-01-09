import LocalVars from './local-vars'
import LoggingCollector from './logging/collector'
import GeoTrackerMonitor from './geo/tracker-monitor'
import Data from './data'
import { RTProvider } from './rt'
import { setLocalCurrentUser } from './users/current-user'

export function initApp(appId, secretKey) {
  LocalVars.applicationId = appId
  LocalVars.secretKey = secretKey
  LocalVars.appPath = [LocalVars.serverURL, appId, secretKey].join('/')

  RTProvider.init()

  LoggingCollector.reset()
  GeoTrackerMonitor.reset()

  //TODO: remove it
  Data.reset()

  setLocalCurrentUser()
}
