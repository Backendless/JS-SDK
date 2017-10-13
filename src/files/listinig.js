import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'
import Async from '../request/async'

export function listing(path, pattern, recursively, pagesize, offset/**, async */) {
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder
  let url = Urls.filePath(path)

  if ((arguments.length > 1) && !(arguments[1] instanceof Async)) {
    url += '?'
  }

  if (Utils.isString(pattern)) {
    url += ('pattern=' + pattern)
  }

  if (Utils.isBoolean(recursively)) {
    url += ('&sub=' + recursively)
  }

  if (Utils.isNumber(pagesize)) {
    url += '&pagesize=' + pagesize
  }

  if (Utils.isNumber(offset)) {
    url += '&offset=' + offset
  }

  return Backendless._ajax({
    method      : 'GET',
    url         : url,
    isAsync     : isAsync,
    asyncHandler: responder
  })
}
