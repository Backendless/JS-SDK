import Urls from '../urls'
import Request from '../request'

import GeoCluster from './cluster'
import GeoPoint from './point'
import GeoQuery from './query'
import FindHelpers from './find-helpers'


//TODO: refactor me

export function loadMetadata(geoObject, asyncHandler) {
  const isCluster = geoObject instanceof GeoCluster
  const isPoint = geoObject instanceof GeoPoint

  if (!geoObject.objectId || !isCluster && !isPoint) {
    throw new Error('Method argument must be a valid instance of GeoPoint or GeoCluster persisted on the server')
  }

  let url = Urls.geoPointMetaData(geoObject.objectId)

  if (isCluster) {
    const geoQuery = geoObject.geoQuery

    if (!(geoQuery instanceof GeoQuery)) {
      throw new Error(
        'Invalid GeoCluster object. ' +
        'Make sure to obtain an instance of GeoCluster using the Backendless.Geo.find API'
      )
    }

    url += '?'

    for (const prop in geoQuery) {
      if (geoQuery.hasOwnProperty(prop) && FindHelpers.hasOwnProperty(prop) && geoQuery[prop] != null) {
        url += '&' + FindHelpers[prop](geoQuery[prop])
      }
    }

  }

  return Request.get({
    url         : url,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
