import Utils from '../../utils'

export function remove(object, asyncHandler) {
  if (!Utils.isObject(object) && !Utils.isString(object)) {
    throw new Error('Invalid value for the "value" argument. The argument must contain only string or object values')
  }

  const result = this.app.request.delete({
    url         : this.app.urls.dataTableObject(this.className, object.objectId || object),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })

  if (asyncHandler) {
    return result
  }

  return this.parseFindResponse(result)
}
