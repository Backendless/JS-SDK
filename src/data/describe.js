import Utils from '../utils'

export function describe(className, asyncHandler) {
  className = Utils.isString(className) ? className : Utils.getClassName(className)

  return this.app.request.get({
    url         : this.app.urls.dataTableProps(className),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}