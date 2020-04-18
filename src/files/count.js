import Utils from '../utils'
import Async from '../request/async'

export function getFileCount(path, pattern, sub, countDirectories, asyncHandler) {

  if (countDirectories instanceof Async) {
    asyncHandler = countDirectories
    countDirectories = undefined

  } else if (sub instanceof Async) {
    asyncHandler = sub
    sub = undefined
    countDirectories = undefined

  } else if (pattern instanceof Async) {
    asyncHandler = pattern
    pattern = undefined
    sub = undefined
    countDirectories = undefined
  }

  const query = {
    action          : 'count',
    pattern         : pattern !== undefined ? pattern : '*',
    sub             : !!sub,
    countDirectories: !!countDirectories
  }

  if (!path || !Utils.isString(path)) {
    throw new Error('Files "path" must not be empty and must be String')
  }

  if (!query.pattern || !Utils.isString(query.pattern)) {
    throw new Error('Files "path" must not be empty and must be String')
  }

  return this.app.request.get({
    url         : this.app.urls.filePath(path),
    query       : query,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
