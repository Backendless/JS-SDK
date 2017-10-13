import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

import GeoCluster from './cluster'
import GeoPoint from './point'
import GeoQuery from './query'
import FindHelpers from './find-helpers'

export function loadMetadata(geoObject /**, async */) {
  let url = ''
  const responder = Utils.extractResponder(arguments)
  let isAsync = false

  if (geoObject.objectId) {
    if (geoObject instanceof GeoCluster) {
      if (geoObject.geoQuery instanceof GeoQuery) {
        url = Urls.geoPointMetaData(geoObject.objectId) + '?'

        for (const prop in geoObject.geoQuery) {
          if (geoObject.geoQuery.hasOwnProperty(prop)
            && FindHelpers.hasOwnProperty(prop)
            && geoObject.geoQuery[prop] != null) {

            url += '&' + FindHelpers[prop](geoObject.geoQuery[prop])
          }
        }
      } else {
        throw new Error(
          'Invalid GeoCluster object. ' +
          'Make sure to obtain an instance of GeoCluster using the Backendless.Geo.find API'
        )
      }
    } else if (geoObject instanceof GeoPoint) {
      url = Urls.geoPointMetaData(geoObject.objectId)

    } else {
      throw new Error('Method argument must be a valid instance of GeoPoint or GeoCluster persisted on the server')
    }
  } else {
    throw new Error('Method argument must be a valid instance of GeoPoint or GeoCluster persisted on the server')
  }

  if (responder) {
    isAsync = true
  }

  return Request.get({
    url         : url,
    isAsync     : isAsync,
    asyncHandler: responder
  })
}
