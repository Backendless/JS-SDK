import Urls from '../../urls'
import Async from '../../request/async'
import Request from '../../request'

import DataQueryBuilder from '../query-builder'

export function getObjectCount(condition, async) {
  if (condition instanceof Async) {
    async = condition
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
    isAsync     : !!async,
    asyncHandler: async
  })
}
