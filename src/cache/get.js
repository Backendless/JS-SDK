import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'
import { Parsers } from './parsers'

export function get(key, async) {
  if (!Utils.isString(key)) {
    throw new Error('The "key" argument must be String')
  }

  function parseResult(result) {
    const className = result && result.___class

    if (className) {
      const clazz = Parsers.get(className) // || root[className]

      if (clazz) {
        result = new clazz(result)
      }
    }

    return result
  }

  let responder = Utils.extractResponder(arguments), isAsync = false

  if (responder) {
    isAsync = true
    responder = Utils.wrapAsync(responder, parseResult, this)
  }

  const result = Backendless._ajax({
    method      : 'GET',
    url         : Urls.cacheItem(key),
    isAsync     : isAsync,
    asyncHandler: responder
  })

  return isAsync ? result : parseResult(result)
}
