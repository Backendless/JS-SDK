import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

//TODO: rename me
export function cacheMethod(method, key, contain, async) {
  if (!Utils.isString(key)) {
    throw new Error('The "key" argument must be String')
  }

  let responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  if (responder) {
    responder = Utils.wrapAsync(responder)
  }

  return Backendless._ajax({
    method      : method,
    url         : contain ? Urls.cacheItemCheck(key) : Urls.cacheItem(key),
    isAsync     : isAsync,
    asyncHandler: responder
  })
}


export function contains(key, async) {
  return cacheMethod('GET', key, true, async)
}

export function remove(key, async) {
  return cacheMethod('DELETE', key, false, async)
}
