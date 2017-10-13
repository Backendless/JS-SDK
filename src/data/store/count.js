import Backendless from '../../bundle'
import Urls from '../../urls'
import Async from '../../request/async'
import Request from '../../request'

export function getObjectCount(condition, async) {
  if (condition instanceof Async) {
    async = condition
    condition = null
  }

  if (condition instanceof Backendless.DataQueryBuilder) {
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
