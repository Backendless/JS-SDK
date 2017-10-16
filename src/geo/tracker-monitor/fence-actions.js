import Utils from '../../utils'
import Urls from '../../urls'
import Request from '../../request'
import Async from '../../request/async'

import GeoPoint from '../point'

function runFenceAction(action, geoFenceName, geoPoint /**, async */) {
  if (!Utils.isString(geoFenceName)) {
    throw new Error("Invalid value for parameter 'geoFenceName'. Geo Fence Name must be a String")
  }

  if (geoPoint && !(geoPoint instanceof Async) && !(geoPoint instanceof GeoPoint) && !geoPoint.objectId) {
    throw new Error('Method argument must be a valid instance of GeoPoint persisted on the server')
  }

  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  const data = {
    method      : 'POST',
    url         : Urls.geoFence(action, geoFenceName),
    isAsync     : isAsync,
    asyncHandler: responder
  }

  if (geoPoint) {
    data.data = geoPoint
  }

  return Request.send(data)
}

const runOnStayAction = (geoFenceName, geoPoint, asyncHandler) => {
  return runFenceAction('onstay', geoFenceName, geoPoint, asyncHandler)
}

const runOnExitAction = (geoFenceName, geoPoint, asyncHandler) => {
  return runFenceAction('onexit', geoFenceName, geoPoint, asyncHandler)
}

const runOnEnterAction = (geoFenceName, geoPoint, asyncHandler) => {
  return runFenceAction('onenter', geoFenceName, geoPoint, asyncHandler)
}

const GeoFenceActions = {
  run: runFenceAction,

  enter: runOnEnterAction,
  stay : runOnStayAction,
  exist: runOnExitAction,
}

export default GeoFenceActions
