import Utils from '../utils'
import Async from '../request/async'

export default class Cache {
  constructor(app) {
    this.app = app

    this.parsers = {}
  }

  setObjectFactory(objectName, factoryMethod) {
    this.parsers[objectName] = factoryMethod
  }

  async put(key, value, timeToLive, asyncHandler) {
    if (!key || !Utils.isString(key)) {
      throw new Error('Cache Key must be non empty String')
    }

    if (timeToLive instanceof Async) {
      asyncHandler = timeToLive
      timeToLive = undefined
    }

    if (timeToLive && !Utils.isNumber(timeToLive)) {
      throw new Error('Cache timeToLive must be Number')
    }

    if (Utils.isObject(value) && value.constructor !== Object) {
      value.___class = value.___class || Utils.getClassName(value)
    }

    if (asyncHandler) {
      asyncHandler = Utils.wrapAsync(asyncHandler)
    }

    return this.app.request.put({
      url         : this.app.urls.cacheItem(key) + ((timeToLive) ? '?timeout=' + timeToLive : ''),
      headers     : { 'Content-Type': 'application/json' },
      data        : JSON.stringify(value),
      asyncHandler: asyncHandler
    })
  }

  async get(key, asyncHandler) {
    function parseResult(result) {
      const className = result && result.___class

      if (className) {
        const Class = this.parsers[className]

        if (Class) {
          result = new Class(result)
        }
      }

      return result
    }

    if (!key || !Utils.isString(key)) {
      throw new Error('Cache Key must be non empty String')
    }

    if (asyncHandler) {
      asyncHandler = Utils.wrapAsync(asyncHandler, parseResult)
    }

    const result = this.app.request.get({
      url         : this.app.urls.cacheItem(key),
      asyncHandler: asyncHandler
    })

    if (asyncHandler) {
      return result
    }

    return parseResult(result)
  }

  async remove(key, asyncHandler) {
    if (!key || !Utils.isString(key)) {
      throw new Error('Cache Key must be non empty String')
    }

    if (asyncHandler) {
      asyncHandler = Utils.wrapAsync(asyncHandler)
    }

    return this.app.request.delete({
      url         : this.app.urls.cacheItem(key),
      asyncHandler: asyncHandler
    })
  }

  async contains(key, asyncHandler) {
    if (!key || !Utils.isString(key)) {
      throw new Error('Cache Key must be non empty String')
    }

    if (asyncHandler) {
      asyncHandler = Utils.wrapAsync(asyncHandler)
    }

    return this.app.request.get({
      url         : this.app.urls.cacheItemCheck(key),
      asyncHandler: asyncHandler
    })
  }

  async expireIn(key, seconds, asyncHandler) {
    if (!key || !Utils.isString(key)) {
      throw new Error('Cache Key must be non empty String')
    }

    if (!seconds) {
      throw new Error('Cache Expiration must be number of seconds')
    }

    if (asyncHandler) {
      asyncHandler = Utils.wrapAsync(asyncHandler)
    }

    return this.app.request.put({
      url         : this.app.urls.cacheItemExpireIn(key) + '?timeout=' + seconds,
      data        : {},
      asyncHandler: asyncHandler
    })

  }

  async expireAt(key, timestamp, asyncHandler) {
    if (!key || !Utils.isString(key)) {
      throw new Error('Cache Key must be non empty String')
    }

    if (!timestamp) {
      throw new Error('Cache Expiration must be timestamp or instance of Date')
    }

    timestamp = Utils.isDate(timestamp) ? timestamp.getTime() : timestamp

    if (asyncHandler) {
      asyncHandler = Utils.wrapAsync(asyncHandler)
    }

    return this.app.request.put({
      url         : this.app.urls.cacheItemExpireAt(key) + '?timestamp=' + timestamp,
      data        : {},
      asyncHandler: asyncHandler
    })

  }

}
