import { HiveTypes } from '../constants'
import { HiveStore } from './base-store'
import Utils from '../../utils'

export class KeyValueStore extends HiveStore {
  constructor(dataStore, storeKey) {
    super(dataStore, HiveTypes.KEY_VALUE)

    this.storeKey = storeKey
  }

  get(keys) {
    if (!keys || !(typeof keys === 'string' || Array.isArray(keys))) {
      throw new Error('Key(s) must be provided and must be a string or list of strings.')
    }

    if (Array.isArray(keys)) {
      return this.app.request
        .post({
          url : this.storeUrl,
          data: keys
        })
    }

    return this.app.request
      .get({
        url: `${this.storeUrl}/${keys}`,
      })
  }

  set(key, value, options) {
    if (Utils.isObject(key)) {
      if (!Object.keys(key).length) {
        throw new Error('Provided object must have at least 1 key.')
      }

      return this.app.request
        .put({
          url : this.storeUrl,
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

      const { expirationSeconds, expiration, condition } = options

      if (expirationSeconds !== undefined && (isNaN(expirationSeconds) || typeof expirationSeconds !== 'number')) {
        throw new Error('Expiration seconds must be a number.')
      }

      if (expiration !== undefined && !['TTL', 'UnixTimestamp', 'None'].includes(expiration)) {
        throw new Error('Expiration must be one of this values: TTL, UnixTimestamp, None.')
      }

      if (condition !== undefined && !['IfExists', 'IfNotExists', 'Always'].includes(condition)) {
        throw new Error('Condition must be one of this values: IfExists, IfNotExists, Always.')
      }
    }

    return this.app.request
      .put({
        url : `${this.storeUrl}/${key}`,
        data: {
          value,
          ...options
        }
      })
  }

  increment(value) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (isNaN(value) || typeof value !== 'number') {
      throw new Error('Value must be provided and must be a number.')
    }

    return this.app.request
      .put({
        url: `${this.storeUrl}/${this.storeKey}/increment?value=${value}`
      })
  }

  decrement(value) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (isNaN(value) || typeof value !== 'number') {
      throw new Error('Value must be provided and must be a number.')
    }

    return this.app.request
      .put({
        url: `${this.storeUrl}/${this.storeKey}/decrement?value=${value}`,
      })
  }
}
