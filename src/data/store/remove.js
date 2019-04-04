import Utils from '../../utils'

import { parseFindResponse } from './parse'

export function remove(object, asyncHandler) {
  if (!Utils.isObject(object) && !Utils.isString(object)) {
    throw new Error('Invalid value for the "value" argument. The argument must contain only string or object values')
  }

  const result = this.backendless.request.delete({
    url         : this.backendless.urls.dataTableObject(this.className, object.objectId || object),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })

  if (asyncHandler) {
    return result
  }

  return parseFindResponse(result, this.model)
}
