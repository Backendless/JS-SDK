import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

const isRemoteUrl = url => url.startsWith('http://') || url.startsWith('https://')

export function remove(path, asyncHandler) {
  if (!path || !Utils.isString(path)) {
    throw new Error('File "path" must not be empty and must be String')
  }

  return Request.delete({
    url         : isRemoteUrl(path) ? path : Urls.filePath(path),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
