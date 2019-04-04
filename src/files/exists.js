import Utils from '../utils'

export function exists(path, asyncHandler) {
  if (!path || !Utils.isString(path)) {
    throw new Error('Files "path" must not be empty and must be String')
  }

  return this.backendless.request.get({
    url         : this.backendless.urls.filePath(path),
    query       : { action: 'exists' },
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
