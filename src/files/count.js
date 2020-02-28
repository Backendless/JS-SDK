import Utils from '../utils'
import Async from '../request/async'

export function getFileCount(path, pattern, recursive, countDirectories, asyncHandler) {

  if (countDirectories instanceof Async) {
    asyncHandler = countDirectories
    countDirectories = undefined

  } else if (recursive instanceof Async) {
    asyncHandler = recursive
    recursive = undefined
    countDirectories = undefined

  } else if (pattern instanceof Async) {
    asyncHandler = pattern
    pattern = undefined
    recursive = undefined
    countDirectories = undefined
  }

  const query = {
    action          : 'count',
    pattern         : pattern !== undefined ? pattern : '*',
    recursive       : !!recursive,
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
