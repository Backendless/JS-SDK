import Utils from '../utils'
import Async from '../request/async'

export function listing(path, pattern, sub, pagesize, offset, asyncHandler) {
  if (offset instanceof Async) {
    asyncHandler = offset
    offset = undefined

  } else if (pagesize instanceof Async) {
    asyncHandler = pagesize
    pagesize = undefined
    offset = undefined

  } else if (sub instanceof Async) {
    asyncHandler = sub
    sub = undefined
    pagesize = undefined
    offset = undefined

  } else if (pattern instanceof Async) {
    asyncHandler = pattern
    pattern = undefined
    sub = undefined
    pagesize = undefined
    offset = undefined
  }

  const query = {}

  if (Utils.isString(pattern)) {
    query.pattern = pattern
  }

  if (Utils.isBoolean(sub)) {
    query.sub = sub
  }

  if (Utils.isNumber(pagesize)) {
    query.pagesize = pagesize
  }

  if (Utils.isNumber(offset)) {
    query.offset = offset
  }

  return this.app.request.get({
    url         : this.app.urls.filePath(path),
    query       : query,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
