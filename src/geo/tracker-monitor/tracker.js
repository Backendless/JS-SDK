export default class GeoTracker {
  constructor() {
    this.monitoringId = null
    this._timers = {}
    this._trackedFences = []
    this._lastResults = {}
  }
}