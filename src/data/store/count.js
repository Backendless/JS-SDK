import Async from '../../request/async'

import DataQueryBuilder from '../query-builder'

export function getObjectCount(condition, asyncHandler) {
  if (condition instanceof Async) {
    asyncHandler = condition
    condition = undefined
  }

  if (condition instanceof DataQueryBuilder) {
    condition = condition.build().condition || undefined
  }

  return this.app.request.get({
    url         : this.app.urls.dataTableCount(this.className),
    query       : { where: condition },
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
