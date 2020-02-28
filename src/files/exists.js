import Utils from '../utils'

export function exists(path, asyncHandler) {
  if (!path || !Utils.isString(path)) {
    throw new Error('Files "path" must not be empty and must be String')
  }

  return this.app.request.get({
    url         : this.app.urls.filePath(path),
    query       : { action: 'exists' },
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
