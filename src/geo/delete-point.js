import Utils from '../utils'

export function deletePoint(point, asyncHandler) {
  if (!point || Utils.isFunction(point)) {
    throw new Error('Point argument name is required, must be string (object Id), or point object')
  }

  const pointId = Utils.isString(point) ? point : point.objectId

  let result = {}

  try {
    result = this.app.request.delete({
      url         : this.app.urls.geoPoint(pointId),
      isAsync     : !!asyncHandler,
      asyncHandler: asyncHandler
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