import Utils from '../utils'
import Urls from '../urls'
import Async from '../request/async'
import Request from '../request'

export function listing(path, pattern, recursively, pagesize, offset, asyncHandler) {
  if (offset instanceof Async) {
    asyncHandler = offset
    offset = undefined

  } else if (pagesize instanceof Async) {
    asyncHandler = pagesize
    pagesize = undefined
    offset = undefined

  } else if (recursively instanceof Async) {
    asyncHandler = recursively
    recursively = undefined
    pagesize = undefined
    offset = undefined

  } else if (pattern instanceof Async) {
    asyncHandler = pattern
    pattern = undefined
    recursively = undefined
    pagesize = undefined
    offset = undefined
  }

  const query = {}

  if (Utils.isString(pattern)) {
    query.pattern = pattern
  }

  if (Utils.isBoolean(recursively)) {
    query.sub = recursively
  }

  if (Utils.isNumber(pagesize)) {
    query.pagesize = pagesize
  }

  if (Utils.isNumber(offset)) {
    query.offset = offset
  }

  return Request.get({
    url         : Urls.filePath(path),
    query       : query,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
