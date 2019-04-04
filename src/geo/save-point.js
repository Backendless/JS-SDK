import Utils from '../utils'

import Request from '../request'

import GeoPoint from './point'

export function savePoint(geoPoint, asyncHandler) {
  if (!Utils.isNumber(geoPoint.latitude) || !Utils.isNumber(geoPoint.longitude)) {
    throw new Error('Latitude or longitude not a number')
  }

  geoPoint.categories = Utils.castArray(geoPoint.categories || ['Default'])

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler, parseResponse)
  }

  const method = geoPoint.objectId
    ? Request.Methods.PATCH
    : Request.Methods.POST

  const url = geoPoint.objectId
    ? this.urls.geoPoint(geoPoint.objectId)
    : this.urls.geoPoints()

  const result = Request.send({
    method,
    url,
    data   : geoPoint,
    isAsync: !!asyncHandler,
    asyncHandler
  })

  if (asyncHandler) {
    return result
  }

  return parseResponse(result)
}

function parseResponse(resp) {
  const geoPoint = new GeoPoint()

  geoPoint.categories = resp.geopoint.categories
  geoPoint.latitude = resp.geopoint.latitude
  geoPoint.longitude = resp.geopoint.longitude
  geoPoint.metadata = resp.geopoint.metadata
  geoPoint.objectId = resp.geopoint.objectId

  return geoPoint
}