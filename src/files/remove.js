import Utils from '../utils'

const isRemoteUrl = url => url.startsWith('http://') || url.startsWith('https://')

export function remove(path, asyncHandler) {
  if (!path || !Utils.isString(path)) {
    throw new Error('File "path" must not be empty and must be String')
  }

  return this.backendless.request.delete({
    url         : isRemoteUrl(path) ? path : this.backendless.urls.filePath(path),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
