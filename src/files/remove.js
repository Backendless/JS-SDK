import Utils from '../utils'

const isRemoteUrl = url => url.startsWith('http://') || url.startsWith('https://')

export function remove(path, asyncHandler) {
  if (!path || !Utils.isString(path)) {
    throw new Error('File "path" must not be empty and must be String')
  }

  return this.app.request.delete({
    url         : isRemoteUrl(path) ? path : this.app.urls.filePath(path),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
