import GeoPoint from '../point'

//TODO: refactor me

export default class GeoFenceActions {
  constructor(app) {
    this.app = app
  }

  async run(action, geoFenceName, geoPoint) {
    if (typeof geoFenceName !== 'string') {
      throw new Error('Invalid value for parameter \'geoFenceName\'. Geo Fence Name must be a String')
    }

    if (geoPoint && !(geoPoint instanceof GeoPoint) && !geoPoint.objectId) {
      throw new Error('Method argument must be a valid instance of GeoPoint persisted on the server')
    }

    return this.app.request.post({
      url : this.app.urls.geoFence(action, geoFenceName),
      data: geoPoint,
    })
  }

  enter(geoFenceName, geoPoint) {
    return this.run('onenter', geoFenceName, geoPoint)
  }

  stay(geoFenceName, geoPoint) {
    return this.run('onstay', geoFenceName, geoPoint)
  }

  exit(geoFenceName, geoPoint) {
    return this.run('onexit', geoFenceName, geoPoint)
  }
}
