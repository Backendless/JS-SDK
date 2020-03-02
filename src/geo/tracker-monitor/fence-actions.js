import Utils from '../../utils'
import Async from '../../request/async'

import GeoPoint from '../point'

//TODO: refactor me

export default class GeoFenceActions {
  constructor(app) {
    this.app = app
  }

  run(action, geoFenceName, geoPoint, asyncHandler) {
    if (geoPoint instanceof Async) {
      asyncHandler = geoPoint
      geoPoint = undefined
    }

    if (!Utils.isString(geoFenceName)) {
      throw new Error("Invalid value for parameter 'geoFenceName'. Geo Fence Name must be a String")
    }

    if (geoPoint && !(geoPoint instanceof GeoPoint) && !geoPoint.objectId) {
      throw new Error('Method argument must be a valid instance of GeoPoint persisted on the server')
    }

    return this.app.request.post({
      url         : this.app.urls.geoFence(action, geoFenceName),
      isAsync     : !!asyncHandler,
      data        : geoPoint,
      asyncHandler: asyncHandler
    })
  }

  enter(geoFenceName, geoPoint, asyncHandler) {
    return this.run('onenter', geoFenceName, geoPoint, asyncHandler)
  }

  stay(geoFenceName, geoPoint, asyncHandler) {
    return this.run('onstay', geoFenceName, geoPoint, asyncHandler)
  }

  exit(geoFenceName, geoPoint, asyncHandler) {
    return this.run('onexit', geoFenceName, geoPoint, asyncHandler)
  }
}
