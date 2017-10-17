import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'
import { Parsers } from './parsers'

function parseResult(result) {
  const className = result && result.___class

  if (className) {
    const Class = Parsers.get(className)

    if (Class) {
      result = new Class(result)
    }
  }

  return result
}

export function get(key, asyncHandler) {
  if (!key || !Utils.isString(key)) {
    throw new Error('Cache Key must be non empty String')
  }

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler, parseResult)
  }

  const result = Request.get({
    url         : Urls.cacheItem(key),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })

  if (asyncHandler) {
    return result
  }

  return parseResult(result)
}
