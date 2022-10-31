import { HiveTypes } from '../constants'
import { HiveStore } from './base-store'
import Utils from '../../utils'
import { isHiveValueValid } from '../utils'

export class KeyValueStore extends HiveStore {

  static TYPE = HiveTypes.KEY_VALUE

  static STATIC_METHODS = [...HiveStore.STATIC_METHODS, 'get', 'set']

  static get(keys) {
    if (!Array.isArray(keys)) {
      throw new Error('Keys must be provided and must be a list of strings.')
    }

    return this.app.request
      .post({
        url : this.app.urls.hiveStore(this.hiveName, this.TYPE),
        data: keys
      })
  }

  static set(key, value, options) {
    if (Utils.isObject(key)) {
      if (!Object.keys(key).length) {
        throw new Error('Provided object must have at least 1 key.')
      }

      return this.app.request
        .put({
          url : this.app.urls.hiveStore(this.hiveName, this.TYPE),
          data: key
        })
    }

    if (!key || typeof key !== 'string') {
      throw new Error('Key must be provided and must be a string.')
    }

    if (options !== undefined) {
      if (!Utils.isObject(options)) {
        throw new Error('Options must be an object.')
      }

      const { ttl, expireAt, condition } = options

      if (ttl !== undefined && (isNaN(ttl) || typeof ttl !== 'number')) {
        throw new Error('TTL in seconds must be a number.')
      }

      if (expireAt !== undefined && (isNaN(expireAt) || typeof expireAt !== 'number')) {
        throw new Error('ExpireAt timestamp must be a number.')
      }

      if (condition !== undefined && !['IfExists', 'IfNotExists', 'Always'].includes(condition)) {
        throw new Error('Condition must be one of this values: [IfExists, IfNotExists, Always].')
      }
    }

    if (!isHiveValueValid(value)) {
      throw new Error('Value must be provided and must be one of types: string, number, boolean, object, array.')
    }

    return this.app.request
      .put({
        url : `${this.app.urls.hiveStore(this.hiveName, this.TYPE)}/${key}`,
        data: {
          value,
          ...options
        }
      })
  }

  get() {
    return this.app.request
      .get({
        url: this.getBaseURL(),
      })
  }

  set(value, options) {
    return this.constructor.set.apply({ ...this, ...this.constructor }, [this.storeKey, value, options])
  }

  increment(value) {
    if (isNaN(value) || typeof value !== 'number') {
      throw new Error('Value must be provided and must be a number.')
    }

    return this.app.request
      .put({
        url  : `${this.getBaseURL()}/increment`,
        query: {
          value
        }
      })
  }

  decrement(value) {
    if (isNaN(value) || typeof value !== 'number') {
      throw new Error('Value must be provided and must be a number.')
    }

    return this.app.request
      .put({
        url  : `${this.getBaseURL()}/decrement`,
        query: {
          value
        }
      })
  }
}
