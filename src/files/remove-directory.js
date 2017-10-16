import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

export function removeDirectory(path, asyncHandler) {
  if (!path || !Utils.isString(path)) {
    throw new Error('Directory "path" must not be empty and must be String')
  }

  Request.delete({
    url         : Urls.filePath(path),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
