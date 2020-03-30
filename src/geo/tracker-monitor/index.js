import Utils from '../../utils'

import GeoTracker from './tracker'
import GeoFenceActions from './fence-actions'

import startMonitoring from './start-monitoring'
import stopMonitoring from './stop-monitoring'

export default class GeoTrackerMonitor {
  constructor(app) {
    this.app = app
    this.geoFenceActions = new GeoFenceActions(app)
    this.reset()
  }

  reset() {
    delete this.geoTracker

    this.geoTracker = new GeoTracker()
  }

  runOnEnterAction(geoFenceName, geoPoint, asyncHandler) {
    return this.geoFenceActions.enter(geoFenceName, geoPoint, asyncHandler)
  }

  runOnStayAction(geoFenceName, geoPoint, asyncHandler) {
    return this.geoFenceActions.stay(geoFenceName, geoPoint, asyncHandler)
  }

  runOnExitAction(geoFenceName, geoPoint, asyncHandler) {
    return this.geoFenceActions.exit(geoFenceName, geoPoint, asyncHandler)
  }

  startGeofenceMonitoringWithInAppCallback(...args) {
    return startMonitoring.call(this, ...args)
  }

  startGeofenceMonitoringWithRemoteCallback(...args) {
    return startMonitoring.call(this, ...args)
  }

  stopGeofenceMonitoring(...args) {
    return stopMonitoring.call(this, ...args)
  }

  getFences(geoFence) {
    return this.app.request.get({
      url: this.app.urls.geoFences(geoFence)
    })
  }
}
