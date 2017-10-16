import Utils from '../utils'
import Request from '../request'
import Async from '../request/async'

import GeoCluster from './cluster'
import GeoPoint from './point'

import { validateQueryObject } from './query-validator'
import { toQueryParams } from './query-params'

export function loadItems(query/**, async */) {
  let responder = Utils.extractResponder(arguments)
  let isAsync = false

  validateQueryObject(query)

  const url = query.url + (query.searchRectangle ? '/rect' : '/points') + '?' + toQueryParams(query)

  const responderOverride = asyncHandler => {
    const success = data => {
      const geoCollection = []
      let geoObject
      let isCluster
      let GeoItemType

      //TODO: refctor me when released 4.x
      const collection = data.collection || data

      for (let i = 0; i < collection.length; i++) {
        geoObject = collection[i]
        geoObject.geoQuery = query

        isCluster = geoObject.hasOwnProperty('totalPoints')
        GeoItemType = isCluster ? GeoCluster : GeoPoint

        geoCollection.push(new GeoItemType(geoObject))
      }

      asyncHandler.success(geoCollection)
    }

    const error = data => asyncHandler.fault(data)

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
