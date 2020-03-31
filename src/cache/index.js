import Utils from '../utils'
import { Validators } from '../validators'

export default class Cache {
  constructor(app) {
    this.app = app

    this.parsers = {}

    Utils.enableAsyncHandlers(this, [
      'put',
      'get',
      'remove',
      'contains',
      'expireIn',
      'expireAt'
    ])
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
    if (Utils.isObject(item) && item.constructor !== Object) {
      item.___class = item.___class || Utils.getClassName(item)
    }

    return JSON.stringify(item)
  }

  async put(key, value, timeToLive) {
    Validators.requiredString('Cache Key', key)
    Validators.optionalNumber('Cache TimeToLive', key)

    return this.app.request.put({
      url    : this.app.urls.cacheItem(key),
      query  : { timeout: timeToLive },
      headers: { 'Content-Type': 'application/json' },
      data   : this.stringifyItem(value),
    })
  }

  async get(key) {
    Validators.requiredString('Cache Key', key)

    return this.app.request
      .get({
        url: this.app.urls.cacheItem(key),
      })
      .then(item => this.parseItem(item))
  }

  async remove(key) {
    Validators.requiredString('Cache Key', key)

    return this.app.request.delete({
      url: this.app.urls.cacheItem(key),
    })
  }

  async contains(key) {
    Validators.requiredString('Cache Key', key)

    return this.app.request.get({
      url: this.app.urls.cacheItemCheck(key),
    })
  }

  async expireIn(key, seconds) {
    Validators.requiredString('Cache Key', key)
    Validators.positiveNumber('Cache Expiration', seconds, 'number of seconds')

    return this.app.request.put({
      url  : this.app.urls.cacheItemExpireIn(key),
      query: { timeout: seconds },
      data : {},
    })
  }

  async expireAt(key, timestamp) {
    timestamp = timestamp instanceof Date ? timestamp.getTime() : timestamp

    Validators.requiredString('Cache Key', key)
    Validators.positiveNumber('Cache Expiration', timestamp, 'timestamp or instance of Date')

    return this.app.request.put({
      url  : this.app.urls.cacheItemExpireAt(key),
      query: { timestamp },
      data : {},
    })
  }

}
