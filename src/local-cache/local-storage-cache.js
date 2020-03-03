import Utils from '../utils'
import Cache from './cache'

const STORAGE_KEY_NAMESPACE = 'Backendless'

const composeStorageKey = app => {
  const { applicationId, standalone } = app

  let key = STORAGE_KEY_NAMESPACE

  if (standalone) {
    key += `-${applicationId}`
  }

  return key
}

const expired = obj => {
  if (Utils.isObject(obj)) {
    const withTTL = (
      'cachePolicy' in obj &&
      'timeToLive' in obj.cachePolicy &&
      'created' in obj.cachePolicy &&
      obj.cachePolicy.timeToLive !== -1
    )

    if (withTTL) {
      const ttl = obj['cachePolicy']['timeToLive']
      const age = new Date().getTime() - obj['cachePolicy']['created']

      return age > ttl
    }
  }

  return false
}

const addTimestamp = obj => {
  if (Utils.isObject(obj)) {
    if ('cachePolicy' in obj && 'timeToLive' in obj['cachePolicy']) {
      obj['cachePolicy']['created'] = new Date().getTime()
    }
  }
}

export default class LocalStorageCache extends Cache {
  constructor(...args) {
    super(...args)

    this.__storageKey = composeStorageKey(this.app)
    this.__storage = window.localStorage

    this.initStorage()
  }

  initStorage() {
    if (!this.storage) {
      this.storage = {}
    }
  }

  get storage() {
    return this.deserialize(this.__storage.getItem(this.__storageKey)) || {}
  }

  set storage(storage) {
    this.__storage.setItem(this.__storageKey, this.serialize(storage))
  }

  exists(key) {
    return this.get(key) !== undefined
  }

  set(key, value) {
    if (value === undefined) {
      return this.remove(key)
    }

    const storage = this.storage

    addTimestamp(value)

    storage[key] = value

    this.storage = storage

    return value
  }

  get(key) {
    const storage = this.storage
    const value = storage[key]

    if (expired(value)) {
      delete storage[key]

      this.storage = storage

      return
    }

    if (value && value['cachePolicy']) {
      delete value['cachePolicy']
    }

    return value
  }

  remove(key) {
    key = key.replace(/([^A-Za-z0-9-])/g, '') //TODO maybe we have to check always

    const storage = this.storage

    if (storage.hasOwnProperty(key)) {
      delete storage[key]

      this.storage = storage
    }
  }

  getAll() {
    const storage = this.storage
    const result = {}

    for (const key in storage) {
      if (storage.hasOwnProperty(key)) {
        const value = storage[key]

        //TODO maybe we have to filter expired

        if (value !== null && value.hasOwnProperty('cachePolicy')) {
          delete value['cachePolicy']
        }

        result[key] = value
      }
    }

    return result
  }

  flushExpired() {
    const storage = this.storage

    for (const key in storage) {
      if (storage.hasOwnProperty(key)) {
        const value = storage[key]

        if (expired(value)) {
          delete storage[key]
        }
      }
    }

    this.storage = storage
  }

  getCachePolicy(key) {
    const storage = this.storage
    const value = storage[key]

    return value ? value['cachePolicy'] : undefined
  }
}
