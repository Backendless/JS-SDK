import Backendless from '../../bundle'
import Utils from '../../utils'
import Urls from '../../urls'

import { parseFindResponse } from './parse'

export function remove(object, async) {
  if (!Utils.isObject(object) && !Utils.isString(object)) {
    throw new Error('Invalid value for the "value" argument. The argument must contain only string or object values')
  }

  const result = Backendless._ajax({
    method      : 'DELETE',
    url         : Urls.dataTableObject(this.className, object.objectId || object),
    isAsync     : !!async,
    asyncHandler: async
  })

  if (async) {
    return result
  }

  return parseFindResponse(result, this.model)
}
