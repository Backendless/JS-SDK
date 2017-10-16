import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

export function exists(path, asyncHandler) {
  if (!path || !Utils.isString(path)) {
    throw new Error('Files "path" must not be empty and must be String')
  }

  return Request.get({
    url         : Urls.filePath(path),
    query       : { action: 'exists' },
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
