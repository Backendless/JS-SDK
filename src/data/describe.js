import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

export function describe(className, async) {
  className = Utils.isString(className) ? className : Utils.getClassName(className)

  return Backendless._ajax({
    method      : 'GET',
    url         : Urls.dataTableProps(className),
    isAsync     : !!async,
    asyncHandler: async
  })
}
