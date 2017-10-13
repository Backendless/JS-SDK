import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

export function deletePoint(point /**, async */) {
  if (!point || Utils.isFunction(point)) {
    throw new Error('Point argument name is required, must be string (object Id), or point object')
  }

  const pointId = Utils.isString(point) ? point : point.objectId
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder
  let result = {}

  try {
    result = Request.delete({
      url         : Urls.geoPoint(pointId),
      isAsync     : isAsync,
      asyncHandler: responder
    })
  } catch (e) {
    if (e.statusCode === 404) {
      result = false
    } else {
      throw e
    }
  }

  return (typeof result.result === 'undefined') ? result : result.result
}
