import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

import { validateQueryObject } from './query-validator'
import { toQueryParams } from './query-params'

export function getGeopointCount(fenceName, query, asyncHandler) {
  if (Utils.isObject(fenceName)) {
    asyncHandler = query
    query = fenceName
    fenceName = undefined
  }

  if (!Utils.isObject(query)) {
    throw new Error('Geo query must be specified')
  }

  if (fenceName) {
    query['geoFence'] = fenceName
  }

  validateQueryObject(query)

  const url = Urls.geoCount() + '?' + toQueryParams(query)

  return Request.get({
    url         : url,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
