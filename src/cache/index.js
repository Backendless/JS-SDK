import Utils from '../utils'

export default class Cache {
  constructor(app) {
    this.app = app

    this.parsers = {}
  }

  setObjectFactory(objectName, factoryMethod) {
    this.parsers[objectName] = factoryMethod
  }

  parseItem(item) {
    const className = item && item.___class

    if (className) {
      const Class = this.parsers[className]

      if (Class) {
        item = new Class(item)
      }
    }

    return item
  }

  stringifyItem(item) {
    if (Utils.isCustomClassInstance(item)) {
      item.___class = item.___class || Utils.getClassName(item)
    }

    return JSON.stringify(item)
  }

  async put(key, value, timeToLive) {
    if (!key || typeof key !== 'string') {
      throw new Error('Cache Key must be provided and must be a string.')
    }

    if (timeToLive && (typeof timeToLive !== 'number' || timeToLive < 0)) {
      throw new Error('Cache TimeToLive must be a positive number.')
    }

    return this.app.request.put({
      url    : this.app.urls.cacheItem(key),
      query  : { timeout: timeToLive },
      headers: { 'Content-Type': 'application/json' },
      data   : this.stringifyItem(value),
    })
  }

  async get(key) {
    if (!key || typeof key !== 'string') {
      throw new Error('Cache Key must be provided and must be a string.')
    }

    return this.app.request
      .get({
        url: this.app.urls.cacheItem(key),
      })
      .then(item => this.parseItem(item))
  }

  async remove(key) {
    if (!key || typeof key !== 'string') {
      throw new Error('Cache Key must be provided and must be a string.')
    }

    return this.app.request.delete({
      url: this.app.urls.cacheItem(key),
    })
  }

  async contains(key) {
    if (!key || typeof key !== 'string') {
      throw new Error('Cache Key must be provided and must be a string.')
    }

    return this.app.request.get({
      url: this.app.urls.cacheItemCheck(key),
    })
  }

  async expireIn(key, seconds) {
    if (!key || typeof key !== 'string') {
      throw new Error('Cache Key must be provided and must be a string.')
    }

    if (typeof seconds !== 'number' || seconds <= 0) {
      throw new Error('Cache Expiration must be provided and must be a number of seconds.')
    }

    return this.app.request.put({
      url  : this.app.urls.cacheItemExpireIn(key),
      query: { timeout: seconds },
      data : {},
    })
  }

  async expireAt(key, timestamp) {
    if (!key || typeof key !== 'string') {
      throw new Error('Cache Key must be provided and must be a string.')
    }

    if (timestamp instanceof Date) {
      timestamp = timestamp.getTime()

    } else if (typeof timestamp !== 'number' || timestamp <= 0) {
      throw new Error('Cache Expiration must be provided and must be a timestamp or an instance of Date.')
    }

    return this.app.request.put({
      url  : this.app.urls.cacheItemExpireAt(key),
      query: { timestamp },
      data : {},
    })
  }

}
