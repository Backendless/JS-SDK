import Utils from '../utils'
import Urls from '../urls'
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

  const result = Request.send({
    method      : geoPoint.objectId ? Request.Methods.PATCH : Request.Methods.POST,
    url         : geoPoint.objectId ? Urls.geoPoint(geoPoint.objectId) : Urls.geoPoints(),
    data        : geoPoint,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
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