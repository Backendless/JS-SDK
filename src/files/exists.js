import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

export function exists(path/**, async */) {
  if (!path || !Utils.isString(path)) {
    throw new Error('Missing value for the "path" argument. The argument must contain a string value')
  }

  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder
  const url = Urls.filePath(path) + '?action=exists'

  return Backendless._ajax({
    method      : 'GET',
    url         : url,
    isAsync     : isAsync,
    asyncHandler: responder
  })
}
