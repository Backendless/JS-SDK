import Urls from '../urls'
import Utils from '../utils'
import Request from '../request'

import GeoPoint from './point'

import { validateQueryObject } from './query-validator'
import { toQueryParams } from './query-params'

//TODO: refactor me

export function relativeFind(query, asyncHandler) {
  if (!(query.relativeFindMetadata && query.relativeFindPercentThreshold)) {
    throw new Error(
      'Inconsistent geo query. ' +
      'Query should contain both relativeFindPercentThreshold and relativeFindMetadata'
    )
  }

  validateQueryObject(query)

  query.url = Urls.geoRelative()

  const url = query.url + (query.searchRectangle ? '/rect' : '/points') + '?' + toQueryParams(query)

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler, resp => responseParser(resp))
  }

  const result = Request.get({
    url         : url,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })

  if (asyncHandler) {
    return result
  }

  return responseParser(result)
}

function responseParser(items) {
  return items.map(item => ({
    geoPoint: new GeoPoint(item.geoPoint),
    matches : item.matches
  }))
}


