import Utils from '../../utils'

export class HiveStore {

  static STATIC_METHODS = ['keys', 'delete', 'exist', 'touch']

  static registerType(hive) {
    const context = { ...this, app: hive.app, hiveName: hive.hiveName }
    const factory = storeKey => new this(context, storeKey)

    this.STATIC_METHODS.forEach(methodName => {
      factory[methodName] = (...args) => this[methodName].apply(context, args)
    })

    return factory
  }

  constructor(context, storeKey) {
    this.TYPE = this.constructor.TYPE

    if (!storeKey || typeof storeKey !== 'string') {
      throw new Error('Store key must be a string.')
    }

    this.app = context.app
    this.hiveName = context.hiveName

    this.storeKey = storeKey
  }

  static keys(options) {
    if (options !== undefined) {
      if (!Utils.isObject(options)) {
        throw new Error('Options must be an object.')
      }

      const { cursor, pageSize, filterPattern } = options

      if (cursor !== undefined && (typeof cursor !== 'number' || isNaN(cursor))) {
        throw new Error('Cursor must be a number.')
      }

      if (pageSize !== undefined && (typeof pageSize !== 'number' || isNaN(pageSize))) {
        throw new Error('Page size must be a number.')
      }

      if (filterPattern !== undefined && (typeof filterPattern !== 'string' || !filterPattern)) {
        throw new Error('Filter pattern must be a string.')
      }
    }

    return this.app.request
      .get({
        url  : `${this.app.urls.hiveStore(this.hiveName, this.TYPE)}/keys`,
        query: options
      })
  }

  static delete(keys) {
    if (!Array.isArray(keys)) {
      throw new Error('Keys must be provided and must be a list of strings.')
    }

    return this.app.request
      .delete({
        url : this.app.urls.hiveStore(this.hiveName, this.TYPE),
        data: keys
      })
  }

  static exist(keys) {
    if (!Array.isArray(keys)) {
      throw new Error('Keys must be provided and must be a list of strings.')
    }

    return this.app.request
      .post({
        url : `${this.app.urls.hiveStore(this.hiveName, this.TYPE)}/action/exist`,
        data: keys
      })
  }

  static touch(keys) {
    if (!Array.isArray(keys)) {
      throw new Error('Keys must be provided and must be a list of strings.')
    }

    return this.app.request
      .put({
        url : `${this.app.urls.hiveStore(this.hiveName, this.TYPE)}/action/touch`,
        data: keys
      })
  }

  getBaseURL() {
    return `${this.app.urls.hiveStore(this.hiveName, this.TYPE)}/${this.storeKey}`
  }

  delete() {
    return this.constructor.delete.call({ ...this, ...this.constructor }, [this.storeKey])
  }

  async exist() {
    const result = await this.constructor.exist.call({ ...this, ...this.constructor }, [this.storeKey])

    return !!result
  }

  rename(newKey, overwrite) {
    if (!newKey || typeof newKey !== 'string') {
      throw new Error('New key name must be provided and must be a string.')
    }

    if (overwrite !== undefined && typeof overwrite !== 'boolean') {
      throw new Error('Overwrite must be a boolean.')
    }

    return this.app.request
      .put({
        url  : `${this.getBaseURL()}/rename`,
        query: { newKey, overwrite }
      })
  }

  getExpiration() {
    return this.app.request
      .get({
        url: `${this.getBaseURL()}/get-expiration-ttl`,
      })
  }

  clearExpiration() {
    return this.app.request
      .put({
        url: `${this.getBaseURL()}/clear-expiration`,
      })
  }

  expireAfter(ttl) {
    if (isNaN(ttl) || typeof ttl !== 'number') {
      throw new Error('TTL must be a number.')
    }

    return this.app.request
      .put({
        url  : `${this.getBaseURL()}/expire`,
        query: { ttl }
      })
  }

  expireAt(unixTime) {
    if (isNaN(unixTime) || typeof unixTime !== 'number') {
      throw new Error('Expiration time must be a number.')
    }

    return this.app.request
      .put({
        url  : `${this.getBaseURL()}/expire-at`,
        query: { unixTime }
      })
  }

  touch() {
    return this.constructor.touch.call({ ...this, ...this.constructor }, [this.storeKey])
  }

  secondsSinceLastOperation() {
    return this.app.request
      .get({
        url: `${this.getBaseURL()}/seconds-since-last-operation`,
      })
  }
}
