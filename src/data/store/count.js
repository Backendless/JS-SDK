import Urls from '../../urls'
import Async from '../../request/async'
import Request from '../../request'

import DataQueryBuilder from '../query-builder'

export function getObjectCount(condition, asyncHandler) {
  if (condition instanceof Async) {
    asyncHandler = condition
    condition = null
  }

  if (condition instanceof DataQueryBuilder) {
    condition = condition.build().condition
  }

  let url = Urls.dataTableCount(this.className)

  if (condition) {
    url += '?where=' + encodeURIComponent(condition)
  }

  return Request.get({
    url         : url,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
