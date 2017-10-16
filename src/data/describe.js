import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

export function describe(className, asyncHandler) {
  className = Utils.isString(className) ? className : Utils.getClassName(className)

  return Request.get({
    url         : Urls.dataTableProps(className),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
