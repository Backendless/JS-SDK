import Backendless from '../../bundle'
import Utils from '../utils'
import Urls from '../../urls'
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
    data.data = JSON.stringify(geoPoint)
  }

  return Backendless._ajax(data)
}

const runOnStayAction = (geoFenceName, geoPoint, async) => runFenceAction('onstay', geoFenceName, geoPoint, async)
const runOnExitAction = (geoFenceName, geoPoint, async) => runFenceAction('onexit', geoFenceName, geoPoint, async)
const runOnEnterAction = (geoFenceName, geoPoint, async) => runFenceAction('onenter', geoFenceName, geoPoint, async)

const GeoFenceActions = {
  run: runFenceAction,

  enter: runOnStayAction,
  stay : runOnEnterAction,
  exist: runOnExitAction,
}

export default GeoFenceActions
