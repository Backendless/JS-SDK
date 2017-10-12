import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

import { validateQueryObject } from './query-validator'
import { toQueryParams } from './query-params'

export function getGeopointCount(fenceName, query /**, async */) {
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder
  query = buildCountQueryObject(arguments, isAsync)

  validateQueryObject(query)

  const url = Urls.geoCount() + '?' + toQueryParams(query)

  return Backendless._ajax({
    method      : 'GET',
    url         : url,
    isAsync     : isAsync,
    asyncHandler: responder
  })
}

function buildCountQueryObject(args, isAsync) {
  args = isAsync ? Array.prototype.slice.call(args, 0, -1) : args

  let query
  let fenceName

  if (args.length === 1) {
    query = args[0]
  }

  if (args.length === 2) {
    fenceName = args[0]
    query = args[1]

    query['geoFence'] = fenceName
  }

  return query
}
