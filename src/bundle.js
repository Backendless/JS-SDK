import Utils from './utils'
import Private from './private'

const Backendless = {}

Backendless.debugMode = true

const localStorageName = 'localStorage'
const previousBackendless = root && root.Backendless

Backendless.serverURL = 'https://api.backendless.com'

Backendless.noConflict = function() {
  if (root) {
    root.Backendless = previousBackendless
  }

  return Backendless
}

Backendless.XMLHttpRequest = typeof XMLHttpRequest !== 'undefined' && XMLHttpRequest

const browser = (function() {
  let ua = 'NodeJS'

  if (Utils.isBrowser) {
    ua = navigator.userAgent ? navigator.userAgent.toLowerCase() : 'hybrid-app'
  }

  const match = (/(chrome)[ \/]([\w.]+)/.exec(ua) ||
    /(webkit)[ \/]([\w.]+)/.exec(ua) ||
    /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
    /(msie) ([\w.]+)/.exec(ua) ||
    ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [])

  const matched = {
    browser: match[1] || '',
    version: match[2] || '0'
  }

  const browser = {}

  if (matched.browser) {
    browser[matched.browser] = true
    browser.version = matched.version
  }

  return browser
})()

Backendless.browser = browser

function setCache() {
  const store = {}
  let storage = {}

  store.enabled = false

  store.exists = function(key) {
    return store.get(key) !== undefined
  }

  store.set = function(key, value) {
    return storage[key] = store.serialize(value)
  }

  store.get = function(key) {
    const result = storage[key]

    return result && store.deserialize(result)
  }

  store.remove = function(key) {
    return delete storage[key]
  }

  store.clear = function() {
    storage = {}
  }

  store.flushExpired = function() {
  }

  store.getCachePolicy = function(/** key */) {
  }

  store.getAll = function() {
    const result = {}

    for (const prop in storage) {
      if (storage.hasOwnProperty(prop)) {
        result[prop] = storage[prop]
      }
    }

    return result
  }

  store.serialize = function(value) {
    return JSON.stringify(value)
  }

  store.deserialize = function(value) {
    if (typeof value !== 'string') {
      return undefined
    }
    try {
      return JSON.parse(value)
    } catch (e) {
      return value || undefined
    }
  }

  function isLocalStorageSupported() {
    try {
      if (Utils.isBrowser && (localStorageName in window && window[localStorageName])) {
        localStorage.setItem('localStorageTest', true)
        localStorage.removeItem('localStorageTest')
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }

  if (isLocalStorageSupported()) {
    return extendToLocalStorageCache(store)
  }

  return store
}

function extendToLocalStorageCache(store) {
  const storage = window[localStorageName]

  const createBndlsStorage = () => {
    if (!(storage.getItem('Backendless'))) {
      storage.setItem('Backendless', store.serialize({}))
    }
  }

  const expired = obj => {
    let result = false

    if (obj && Object.prototype.toString.call(obj).slice(8, -1) === 'Object') {
      if ('cachePolicy' in obj
        && 'timeToLive' in obj.cachePolicy
        && obj.cachePolicy.timeToLive !== -1
        && 'created' in obj.cachePolicy) {

        result = (new Date().getTime() - obj['cachePolicy']['created']) > obj['cachePolicy']['timeToLive']
      }
    }

    return result
  }

  const addTimestamp = obj => {
    if (obj && Object.prototype.toString.call(obj).slice(8, -1) === 'Object') {
      if ('cachePolicy' in obj && 'timeToLive' in obj['cachePolicy']) {
        obj['cachePolicy']['created'] = new Date().getTime()
      }
    }
  }

  createBndlsStorage()

  store.enabled = true

  store.exists = function(key) {
    return store.get(key) !== undefined
  }

  store.set = function(key, val) {
    if (val === undefined) {
      return store.remove(key)
    }

    createBndlsStorage()

    let backendlessObj = store.deserialize(storage.getItem('Backendless'))

    addTimestamp(val)

    backendlessObj[key] = val

    try {
      storage.setItem('Backendless', store.serialize(backendlessObj))
    } catch (e) {
      backendlessObj = {}
      backendlessObj[key] = val
      storage.setItem('Backendless', store.serialize(backendlessObj))
    }

    return val
  }

  store.get = function(key) {
    createBndlsStorage()

    const backendlessObj = store.deserialize(storage.getItem('Backendless'))
    const obj = backendlessObj[key]
    let result = obj

    if (expired(obj)) {
      delete backendlessObj[key]
      storage.setItem('Backendless', store.serialize(backendlessObj))
      result = undefined
    }

    if (result && result['cachePolicy']) {
      delete result['cachePolicy']
    }

    return result
  }

  store.remove = function(key) {
    let result

    createBndlsStorage()

    key = key.replace(/([^A-Za-z0-9-])/g, '')

    const backendlessObj = store.deserialize(storage.getItem('Backendless'))

    if (backendlessObj.hasOwnProperty(key)) {
      result = delete backendlessObj[key]
    }

    storage.setItem('Backendless', store.serialize(backendlessObj))

    return result
  }

  store.clear = function() {
    storage.setItem('Backendless', store.serialize({}))
  }

  store.getAll = function() {
    createBndlsStorage()

    const backendlessObj = store.deserialize(storage.getItem('Backendless'))
    const ret = {}

    for (const prop in backendlessObj) {
      if (backendlessObj.hasOwnProperty(prop)) {
        ret[prop] = backendlessObj[prop]
        if (ret[prop] !== null && ret[prop].hasOwnProperty('cachePolicy')) {
          delete ret[prop]['cachePolicy']
        }
      }
    }

    return ret
  }

  store.flushExpired = function() {
    createBndlsStorage()

    const backendlessObj = store.deserialize(storage.getItem('Backendless'))
    let obj

    for (const prop in backendlessObj) {
      if (backendlessObj.hasOwnProperty(prop)) {
        obj = backendlessObj[prop]
        if (expired(obj)) {
          delete backendlessObj[prop]
          storage.setItem('Backendless', store.serialize(backendlessObj))
        }
      }
    }
  }

  store.getCachePolicy = function(key) {
    createBndlsStorage()

    const backendlessObj = store.deserialize(storage.getItem('Backendless'))
    const obj = backendlessObj[key]

    return obj ? obj['cachePolicy'] : undefined
  }

  return store
}

Backendless.LocalCache = setCache()

if (Backendless.LocalCache.enabled) {
  Backendless.LocalCache.flushExpired()
}

Backendless.setUIState = function(stateName) {
  if (stateName === undefined) {
    throw new Error('UI state name must be defined or explicitly set to null')
  }

  Private.setUIState(stateName)
}

export default Backendless