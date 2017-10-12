let tracker = null

export default class GeoTracker {

  static get() {
    return tracker = tracker || new GeoTracker()
  }

  static reset() {
    tracker = null
  }

  constructor() {
    this.monitoringId = null
    this._timers = {}
    this._trackedFences = []
    this._lastResults = {}
  }
}