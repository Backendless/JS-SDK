import Utils from '../../utils'

export class HiveStore {
  constructor(context, storeType) {
    this.app = context.app
    this.hiveName = context.hiveName

    this.storeType = storeType

    this.storeUrl = this.app.urls.hiveStore(this.hiveName, this.storeType)
  }

  storeKeys(options) {
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
        url  : `${this.storeUrl}/keys`,
        query: options
      })
  }

  delete(keys) {
    if (!keys || !(typeof keys === 'string' || Array.isArray(keys))) {
      throw new Error('Key(s) must be provided and must be a string or list of strings.')
    }

    return this.app.request
      .delete({
        url : this.storeUrl,
        data: Utils.castArray(keys)
      })
  }

  exists(keys) {
    if (!keys || !(typeof keys === 'string' || Array.isArray(keys))) {
      throw new Error('Key(s) must be provided and must be a string or list of strings.')
    }

    return this.app.request
      .post({
        url : `${this.storeUrl}/exists`,
        data: Utils.castArray(keys)
      })
  }

  rename(key, newKey) {
    if (!key || typeof key !== 'string') {
      throw new Error('Old key name must be provided and must be a string.')
    }

    if (!newKey || typeof newKey !== 'string') {
      throw new Error('New key name must be provided and must be a string.')
    }

    return this.app.request
      .put({
        url: `${this.storeUrl}/${key}/rename?newKey=${newKey}`,
      })
  }

  renameIfNotExists(key, newKey) {
    if (!key || typeof key !== 'string') {
      throw new Error('Old key name must be provided and must be a string.')
    }

    if (!newKey || typeof newKey !== 'string') {
      throw new Error('New key name must be provided and must be a string.')
    }

    return this.app.request
      .put({
        url: `${this.storeUrl}/${key}/rename-if-not-exists?newKey=${newKey}`,
      })
  }

  getExpiration(key) {
    if (!key || typeof key !== 'string') {
      throw new Error('Key must be provided and must be a string.')
    }

    return this.app.request
      .get({
        url: `${this.storeUrl}/${key}/get-expiration-ttl`,
      })
  }

  removeExpiration(key) {
    if (!key || typeof key !== 'string') {
      throw new Error('Key must be provided and must be a string.')
    }

    return this.app.request
      .put({
        url: `${this.storeUrl}/${key}/remove-expiration`,
      })
  }

  expireAfter(key, ttl) {
    if (!key || typeof key !== 'string') {
      throw new Error('Key must be provided and must be a string.')
    }

    if (isNaN(ttl) || typeof ttl !== 'number') {
      throw new Error('TTL must be a number.')
    }

    return this.app.request
      .put({
        url: `${this.storeUrl}/${key}/expire?ttl=${ttl}`,
      })
  }

  expireAt(key, unixTime) {
    if (!key || typeof key !== 'string') {
      throw new Error('Key must be provided and must be a string.')
    }

    if (isNaN(unixTime) || typeof unixTime !== 'number') {
      throw new Error('Expiration time must be a number.')
    }

    return this.app.request
      .put({
        url: `${this.storeUrl}/${key}/expire-at?unixTime=${unixTime}`,
      })
  }

  touch(keys) {
    if (!keys || !(typeof keys === 'string' || Array.isArray(keys))) {
      throw new Error('Key(s) must be provided and must be a string or list of strings.')
    }

    return this.app.request
      .put({
        url : `${this.storeUrl}/touch`,
        data: Utils.castArray(keys)
      })
  }
}
