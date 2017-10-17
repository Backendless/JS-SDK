import Utils from '../../utils'

import GeoTracker from './tracker'
import GeoFenceActions from './fence-actions'
import { startMonitoring } from './start-monitoring'
import { stopMonitoring } from './stop-monitoring'

const GeoTrackerMonitor = {

  reset() {
    GeoTracker.reset()
  },

  runOnEnterAction    : Utils.promisified(GeoFenceActions.enter),
  runOnEnterActionSync: Utils.synchronized(GeoFenceActions.enter),

  runOnStayAction    : Utils.promisified(GeoFenceActions.stay),
  runOnStayActionSync: Utils.synchronized(GeoFenceActions.stay),

  runOnExitAction    : Utils.promisified(GeoFenceActions.exist),
  runOnExitActionSync: Utils.synchronized(GeoFenceActions.exist),

  startGeofenceMonitoringWithInAppCallback    : Utils.promisified(startMonitoring),
  startGeofenceMonitoringWithInAppCallbackSync: Utils.synchronized(startMonitoring),

  startGeofenceMonitoringWithRemoteCallback    : Utils.promisified(startMonitoring),
  startGeofenceMonitoringWithRemoteCallbackSync: Utils.synchronized(startMonitoring),

  stopGeofenceMonitoring: stopMonitoring,
}

export default GeoTrackerMonitor
