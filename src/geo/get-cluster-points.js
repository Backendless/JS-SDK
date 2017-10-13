import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'
import Async from '../request/async'

import GeoCluster from './cluster'
import GeoPoint from './point'
import GeoQuery from './query'
import FindHelpers from './find-helpers'

export function getClusterPoints(geoObject /**, async */) {
  let url = ''
  let responder = Utils.extractResponder(arguments)
  let isAsync = false

  if (geoObject.objectId) {
    if (geoObject instanceof GeoCluster) {
      if (geoObject.geoQuery instanceof GeoQuery) {
        url = Urls.geoClusterPoints(geoObject.objectId) + '?'

        for (const prop in geoObject.geoQuery) {
          if (geoObject.geoQuery.hasOwnProperty(prop) && FindHelpers.hasOwnProperty(prop) && geoObject.geoQuery[prop] != null) {
            url += '&' + FindHelpers[prop](geoObject.geoQuery[prop])
          }
        }
      } else {
        throw new Error(
          'Invalid GeoCluster object. ' +
          'Make sure to obtain an instance of GeoCluster using the Backendless.Geo.find API'
        )
      }
    } else {
      throw new Error('Method argument must be a valid instance of GeoCluster persisted on the server')
    }
  } else {
    throw new Error('Method argument must be a valid instance of GeoCluster persisted on the server')
  }

  const responderOverride = async => {
    const success = geoCollection => {
      for (let i = 0; i < geoCollection.length; i++) {
        geoCollection[i] = new GeoPoint(geoCollection[i])
      }

      async.success(geoCollection)
    }

    const error = data => async.fault(data)

    return new Async(success, error)
  }

  if (responder) {
    isAsync = true
  }

  responder = responderOverride(responder)

  return Request.get({
    url         : url,
    isAsync     : isAsync,
    asyncHandler: responder
  })
}
