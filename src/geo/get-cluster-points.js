import Urls from '../urls'
import Request from '../request'
import Async from '../request/async'

import GeoCluster from './cluster'
import GeoPoint from './point'
import GeoQuery from './query'
import FindHelpers from './find-helpers'

export function getClusterPoints(geoObject, asyncHandler) {
  if (!geoObject.objectId || !(geoObject instanceof GeoCluster)) {
    throw new Error('Method argument must be a valid instance of GeoCluster persisted on the server')
  }

  if (!(geoObject.geoQuery instanceof GeoQuery)) {
    throw new Error(
      'Invalid GeoCluster object. ' +
      'Make sure to obtain an instance of GeoCluster using the Backendless.Geo.find API'
    )
  }

  let url = Urls.geoClusterPoints(geoObject.objectId) + '?'

  const geoQuery = geoObject.geoQuery

  for (const prop in geoQuery) {
    if (geoQuery.hasOwnProperty(prop) && FindHelpers.hasOwnProperty(prop) && geoQuery[prop] != null) {
      url += '&' + FindHelpers[prop](geoQuery[prop])
    }
  }

  const responderOverride = asyncHandler => {
    const success = geoCollection => {
      for (let i = 0; i < geoCollection.length; i++) {
        geoCollection[i] = new GeoPoint(geoCollection[i])
      }

      asyncHandler.success(geoCollection)
    }

    const error = data => asyncHandler.fault(data)

    return new Async(success, error)
  }


  asyncHandler = responderOverride(asyncHandler)

  return Request.get({
    url         : url,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
