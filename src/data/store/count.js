import Urls from '../../urls'
import Async from '../../request/async'
import Request from '../../request'

import DataQueryBuilder from '../query-builder'

export function getObjectCount(condition, asyncHandler) {
  if (condition instanceof Async) {
    asyncHandler = condition
    condition = undefined
  }

  if (condition instanceof DataQueryBuilder) {
    condition = condition.build().condition || undefined
  }

  return Request.get({
    url         : Urls.dataTableCount(this.className),
    query       : { where: condition },
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
