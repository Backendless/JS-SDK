import Utils from '../utils'

export default class Cache {
  constructor(app) {
    this.app = app

    this.parsers = {}

    Utils.enableAsyncHandlers(this, ['put', 'get', 'remove', 'contains', 'expireIn', 'expireAt'])
  }

  setObjectFactory(objectName, factoryMethod) {
    this.parsers[objectName] = factoryMethod
  }

  async put(key, value, timeToLive) {
    if (!key || !Utils.isString(key)) {
      throw new Error('Cache Key must be non empty String')
    }

    if (timeToLive && !Utils.isNumber(timeToLive)) {
      throw new Error('Cache timeToLive must be Number')
    }

    if (Utils.isObject(value) && value.constructor !== Object) {
      value.___class = value.___class || Utils.getClassName(value)
    }

    return this.app.request.put({
      url    : this.app.urls.cacheItem(key) + ((timeToLive) ? '?timeout=' + timeToLive : ''),
      headers: { 'Content-Type': 'application/json' },
      data   : JSON.stringify(value),
    })
  }

  async get(key) {
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

    return this.app.request
      .get({
        url: this.app.urls.cacheItem(key),
      })
      .then(parseResult)
  }

  async remove(key) {
    if (!key || !Utils.isString(key)) {
      throw new Error('Cache Key must be non empty String')
    }

    return this.app.request.delete({
      url: this.app.urls.cacheItem(key),
    })
  }

  async contains(key) {
    if (!key || !Utils.isString(key)) {
      throw new Error('Cache Key must be non empty String')
    }

    return this.app.request.get({
      url: this.app.urls.cacheItemCheck(key),
    })
  }

  async expireIn(key, seconds) {
    if (!key || !Utils.isString(key)) {
      throw new Error('Cache Key must be non empty String')
    }

    if (!seconds) {
      throw new Error('Cache Expiration must be number of seconds')
    }

    return this.app.request.put({
      url : this.app.urls.cacheItemExpireIn(key) + '?timeout=' + seconds,
      data: {},
    })

  }

  async expireAt(key, timestamp) {
    if (!key || !Utils.isString(key)) {
      throw new Error('Cache Key must be non empty String')
    }

    if (!timestamp) {
      throw new Error('Cache Expiration must be timestamp or instance of Date')
    }

    timestamp = Utils.isDate(timestamp) ? timestamp.getTime() : timestamp

    return this.app.request.put({
      url : this.app.urls.cacheItemExpireAt(key) + '?timestamp=' + timestamp,
      data: {},
    })

  }

}
