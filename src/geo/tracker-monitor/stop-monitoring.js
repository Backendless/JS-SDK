import GeoUtils from '../utils'

//TODO: refactor me
export default function stopMonitoring(geofenceName) {
  const tracker = this.geoTracker

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
