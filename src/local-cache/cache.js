export default class Cache {
  constructor(app) {
    this.app = app
    this.__storage = {}
  }

  get storage() {
    return this.__storage
  }

  set storage(storage) {
    return this.__storage = storage
  }

  exists(key) {
    return this.get(key) !== undefined
  }

  set(key, value) {
    return this.storage[key] = this.serialize(value)
  }

  get(key) {
    const result = this.storage[key]

    return result && this.deserialize(result)
  }

  remove(key) {
    return delete this.storage[key]
  }

  clear() {
    this.storage = {}
  }

  flushExpired() {
  }

  getCachePolicy(/** key */) {
  }

  getAll() {
    const result = {}

    for (const key in this.storage) {
      if (this.storage.hasOwnProperty(key)) {
        result[key] = this.get(key)
      }
    }

    return result
  }

  serialize(value) {
    return JSON.stringify(value)
  }

  deserialize(value) {
    if (typeof value !== 'string') {
      return undefined
    }

    try {
      return JSON.parse(value)
    } catch (e) {
      return value || undefined
    }
  }
}