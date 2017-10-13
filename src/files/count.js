import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

export function getFileCount(path, /** pattern, recursive, countDirectories, async */) {
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder
  const query = buildCountQueryObject(arguments, isAsync)

  if (!query.path || !Utils.isString(query.path)) {
    throw new Error('Missing value for the "path" argument. The argument must contain a string value')
  }

  if (!query.pattern || !Utils.isString(query.pattern)) {
    throw new Error('Missing value for the "pattern" argument. The argument must contain a string value')
  }

  if (!Utils.isBoolean(query.recursive)) {
    throw new Error('Missing value for the "recursive" argument. The argument must contain a boolean value')
  }

  if (!Utils.isBoolean(query.countDirectories)) {
    throw new Error('Missing value for the "countDirectories" argument. The argument must contain a boolean value')
  }

  delete query.path

  const url = Urls.filePath(path) + '?' + Utils.toQueryParams(query)

  return Backendless._ajax({
    method      : 'GET',
    url         : url,
    isAsync     : isAsync,
    asyncHandler: responder
  })
}

export function buildCountQueryObject(args, isAsync) {
  args = isAsync ? Array.prototype.slice.call(args, 0, -1) : args

  return {
    action          : 'count',
    path            : args[0],
    pattern         : args[1] !== undefined ? args[1] : '*',
    recursive       : args[2] !== undefined ? args[2] : false,
    countDirectories: args[3] !== undefined ? args[3] : false
  }
}
