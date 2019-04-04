import Utils from '../utils'

export function describe(className, asyncHandler) {
  className = Utils.isString(className) ? className : Utils.getClassName(className)

  return this.backendless.request.get({
    url         : this.backendless.urls.dataTableProps(className),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}