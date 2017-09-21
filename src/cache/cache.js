import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'
import Async from '../request/async'

const FactoryMethods = {}

export default class Cache {

  constructor() {
    // this.restUrl = Urls.cache()
  }

  put = Utils.promisified('_put')

  putSync = Utils.synchronized('_put')

  _put(key, value, timeToLive, async) {
    if (!Utils.isString(key)) {
      throw new Error('You can use only String as key to put into Cache')
    }

    if (!(timeToLive instanceof Async)) {
      if (typeof timeToLive === 'object' && !arguments[3]) {
        async = timeToLive
        timeToLive = null
      } else if (typeof timeToLive !== ('number' || 'string') && timeToLive != null) {
        throw new Error('You can use only String as timeToLive attribute to put into Cache')
      }
    } else {
      async = timeToLive
      timeToLive = null
    }

    if (Utils.isObject(value) && value.constructor !== Object) {
      value.___class = value.___class || Utils.getClassName(value)
    }

    let responder = Utils.extractResponder([async]), isAsync = false

    if (responder) {
      isAsync = true
      responder = Utils.wrapAsync(responder)
    }

    return Backendless._ajax({
      method      : 'PUT',
      url         : Urls.cacheItem(key) + ((timeToLive) ? '?timeout=' + timeToLive : ''),
      data        : JSON.stringify(value),
      isAsync     : isAsync,
      asyncHandler: responder
    })
  }

  expireIn = Utils.promisified('_expireIn')

  expireInSync = Utils.synchronized('_expireIn')

  _expireIn(key, seconds, async) {
    if (Utils.isString(key) && (Utils.isNumber(seconds) || Utils.isDate(seconds)) && seconds) {
      seconds = (Utils.isDate(seconds)) ? seconds.getTime() : seconds
      let responder = Utils.extractResponder(arguments), isAsync = false

      if (responder) {
        isAsync = true
        responder = Utils.wrapAsync(responder)
      }

      return Backendless._ajax({
        method      : 'PUT',
        url         : Urls.cacheItemExpireIn(key) + '?timeout=' + seconds,
        data        : JSON.stringify({}),
        isAsync     : isAsync,
        asyncHandler: responder
      })
    } else {
      throw new Error('The "key" argument must be String. The "seconds" argument can be either Number or Date')
    }
  }

  expireAt = Utils.promisified('_expireAt')

  expireAtSync = Utils.synchronized('_expireAt')

  _expireAt(key, timestamp, async) {
    if (Utils.isString(key) && (Utils.isNumber(timestamp) || Utils.isDate(timestamp)) && timestamp) {
      timestamp = (Utils.isDate(timestamp)) ? timestamp.getTime() : timestamp
      let responder = Utils.extractResponder(arguments), isAsync = false
      if (responder) {
        isAsync = true
        responder = Utils.wrapAsync(responder)
      }

      return Backendless._ajax({
        method      : 'PUT',
        url         : Urls.cacheItemExpireAt(key) + '?timestamp=' + timestamp,
        data        : JSON.stringify({}),
        isAsync     : isAsync,
        asyncHandler: responder
      })
    } else {
      throw new Error('You can use only String as key while expire in Cache. Second attribute must be declared and must be a Number or Date type')
    }
  }

  _cacheMethod(method, key, contain, async) {
    if (!Utils.isString(key)) {
      throw new Error('The "key" argument must be String')
    }

    let responder = Utils.extractResponder(arguments), isAsync = false

    if (responder) {
      isAsync = true
      responder = Utils.wrapAsync(responder)
    }

    return Backendless._ajax({
      method      : method,
      url         : contain ? Urls.cacheItemCheck(key) : Urls.cacheItem(key),
      isAsync     : isAsync,
      asyncHandler: responder
    })
  }

  contains = Utils.promisified('_contains')

  containsSync = Utils.synchronized('_contains')

  _contains(key, async) {
    return this._cacheMethod('GET', key, true, async)
  }

  get = Utils.promisified('_get')

  getSync = Utils.synchronized('_get')

  _get(key, async) {
    if (!Utils.isString(key)) {
      throw new Error('The "key" argument must be String')
    }

    function parseResult(result) {
      const className = result && result.___class

      if (className) {
        const clazz = FactoryMethods[className] || root[className]

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

  remove = Utils.promisified('_remove')

  removeSync = Utils.synchronized('_remove')

  _remove(key, async) {
    return this._cacheMethod('DELETE', key, false, async)
  }

  setObjectFactory(objectName, factoryMethod) {
    FactoryMethods[objectName] = factoryMethod
  }
}
