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

  runOnEnterAction(...args) {
    return Utils.promisified(this.geoFenceActions.enter)
      .call(this.geoFenceActions, ...args)
  }

  runOnEnterActionSync(...args) {
    return Utils.synchronized(this.geoFenceActions.enter)
      .call(this.geoFenceActions, ...args)
  }

  runOnStayAction(...args) {
    return Utils.promisified(this.geoFenceActions.stay)
      .call(this.geoFenceActions, ...args)
  }

  runOnStayActionSync(...args) {
    return Utils.synchronized(this.geoFenceActions.stay)
      .call(this.geoFenceActions, ...args)
  }

  runOnExitAction(...args) {
    return Utils.promisified(this.geoFenceActions.exit)
      .call(this.geoFenceActions, ...args)
  }

  runOnExitActionSync(...args) {
    return Utils.synchronized(this.geoFenceActions.exit)
      .call(this.geoFenceActions, ...args)
  }

  startGeofenceMonitoringWithInAppCallback(...args) {
    return Utils.promisified(startMonitoring).call(this, ...args)
  }

  startGeofenceMonitoringWithInAppCallbackSync(...args) {
    return Utils.synchronized(startMonitoring).call(this, ...args)
  }

  startGeofenceMonitoringWithRemoteCallback(...args) {
    return Utils.promisified(startMonitoring).call(this, ...args)
  }

  startGeofenceMonitoringWithRemoteCallbackSync(...args) {
    return Utils.synchronized(startMonitoring).call(this, ...args)
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
