import Utils from '../utils'

export function removeDirectory(path, asyncHandler) {
  if (!path || !Utils.isString(path)) {
    throw new Error('Directory "path" must not be empty and must be String')
  }

  this.backendless.request.delete({
    url         : this.backendless.urls.filePath(path),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
