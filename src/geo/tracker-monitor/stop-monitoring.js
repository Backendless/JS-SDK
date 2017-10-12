import GeoUtils from '../utils'
import GeoTracker from './tracker'


//TODO: refactor me
export function stopMonitoring(geofenceName) {
  const tracker = GeoTracker.get()

  if (geofenceName) {
    for (let i = 0; i < tracker._trackedFences.length; i++) {
      if (tracker._trackedFences[i].geofenceName === geofenceName) {
        tracker._trackedFences.splice(i, 1)
        delete tracker._lastResults[geofenceName]
      }
    }
  } else {
    tracker._lastResuls = {}
    tracker._trackedFences = []
  }

  if (!tracker._trackedFences.length) {
    tracker.monitoringId = null

    if (!GeoUtils.isMobileDevice()) {
      clearInterval(tracker.monitoringId)
    } else {
      navigator.geolocation.clearWatch(tracker.monitoringId)
    }
  }
}
