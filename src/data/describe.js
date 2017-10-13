import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

export function describe(className, async) {
  className = Utils.isString(className) ? className : Utils.getClassName(className)

  return Request.get({
    url         : Urls.dataTableProps(className),
    isAsync     : !!async,
    asyncHandler: async
  })
}
