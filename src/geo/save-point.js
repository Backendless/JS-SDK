import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'
import Async from '../request/async'
import GeoPoint from './point'

export function savePoint(geopoint /**, async */) {
  if (null == geopoint.latitude || null == geopoint.longitude) {
    throw new Error('Latitude or longitude not a number')
  }
  geopoint.categories = geopoint.categories || ['Default']
  geopoint.categories = Utils.isArray(geopoint.categories) ? geopoint.categories : [geopoint.categories]

  const objectId = geopoint.objectId
  const method = objectId ? 'PATCH' : 'POST'
  let url = Urls.geoPoints()

  if (objectId) {
    url += '/' + objectId
  }

  let responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  const responderOverride = async => {
    const success = data => {
      const geoPoint = new GeoPoint()
      geoPoint.categories = data.geopoint.categories
      geoPoint.latitude = data.geopoint.latitude
      geoPoint.longitude = data.geopoint.longitude
      geoPoint.metadata = data.geopoint.metadata
      geoPoint.objectId = data.geopoint.objectId

      async.success(geoPoint)
    }

    const error = data => async.fault(data)

    return new Async(success, error)
  }

  responder = responderOverride(responder)

  return Backendless._ajax({
    method      : method,
    url         : url,
    data        : JSON.stringify(geopoint),
    isAsync     : isAsync,
    asyncHandler: responder
  })
}
