import Utils from '../utils'
import Request from '../request'

import GeoCluster from './cluster'
import GeoPoint from './point'

import { validateQueryObject } from './query-validator'
import { toQueryParams } from './query-params'

//TODO: refactor me

export function loadItems(query, asyncHandler) {
  validateQueryObject(query)

  const url = query.url + (query.searchRectangle ? '/rect' : '/points') + '?' + toQueryParams(query)

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler, resp => responseParser(resp, query))
  }

  const result = Request.get({
    url         : url,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })

  if (asyncHandler) {
    return result
  }

  return responseParser(result, query)
}

function responseParser(resp, geoQuery) {
  return resp.map(geoObject => {
    const GeoItem = geoObject.hasOwnProperty('totalPoints')
      ? GeoCluster
      : GeoPoint

    return new GeoItem({ ...geoObject, geoQuery })
  })
}
