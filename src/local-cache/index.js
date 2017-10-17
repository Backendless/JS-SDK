import Utils from '../utils'

//TODO: refactor me

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
      if (Utils.isBrowser && window.localStorage) {
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
  const storage = window.localStorage

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

const LocalCache = setCache()

if (LocalCache.enabled) {
  LocalCache.flushExpired()
}


export default LocalCache