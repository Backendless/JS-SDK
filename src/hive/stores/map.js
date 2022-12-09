import { HiveTypes } from '../constants'
import { HiveStore } from './base-store'
import Utils from '../../utils'
import { isHiveValueValid } from '../utils'

export class MapStore extends HiveStore {

  static TYPE = HiveTypes.MAP

  get(keys) {
    if (keys !== undefined && !(typeof keys === 'string' || Array.isArray(keys))) {
      throw new Error('Key(s) must be a string or list of strings.')
    }

    return this.app.request
      .post({
        url : this.getBaseURL(),
        data: Utils.castArray(keys)
      })
  }

  getValue(key) {
    if (!key || typeof key !== 'string') {
      throw new Error('Key must be provided and must be a string.')
    }

    return this.app.request
      .get({
        url: `${this.getBaseURL()}/get/${key}`,
      })
  }

  keyExists(key) {
    if (!key || typeof key !== 'string') {
      throw new Error('Key must be provided and must be a string.')
    }

    return this.app.request
      .get({
        url: `${this.getBaseURL()}/exists/${key}`,
      })
  }

  length() {
    return this.app.request
      .get({
        url: `${this.getBaseURL()}/length`,
      })
  }

  keys() {
    return this.app.request
      .get({
        url: `${this.getBaseURL()}/keys`,
      })
  }

  values() {
    return this.app.request
      .get({
        url: `${this.getBaseURL()}/values`,
      })
  }

  set(key, value) {
    if (!key) {
      throw new Error('First argument must be provided and must be a string or an object.')
    }

    if (Utils.isObject(key)) {
      if (!Object.keys(key).length) {
        throw new Error('Provided object must have at least 1 key.')
      }

      return this.app.request
        .put({
          url : this.getBaseURL(),
          data: key,
        })
    }

    if (typeof key !== 'string') {
      throw new Error('Key must be a string.')
    }

    if (!isHiveValueValid(value)) {
      throw new Error('Value must be provided and must be one of types: string, number, boolean, object, array.')
    }

    return this.app.request
      .put({
        url : `${this.getBaseURL()}/set/${key}`,
        data: {
          value,
        },
      })
  }

  setWithOverwrite(key, value, overwrite) {
    if (!key || typeof key !== 'string') {
      throw new Error('Key must be provided and must be a string.')
    }

    if (!isHiveValueValid(value)) {
      throw new Error('Value must be provided and must be one of types: string, number, boolean, object, array.')
    }

    if (overwrite !== undefined && typeof overwrite !== 'boolean') {
      throw new Error('Overwrite must be a boolean.')
    }

    return this.app.request
      .put({
        url : `${this.getBaseURL()}/set-with-overwrite/${key}`,
        data: {
          value,
          overwrite
        },
      })
  }

  increment(key, count) {
    if (!key || typeof key !== 'string') {
      throw new Error('Key must be provided and must be a string.')
    }

    if (count !== undefined && (isNaN(count) || typeof count !== 'number')) {
      throw new Error('Count must be a number.')
    }

    return this.app.request
      .put({
        url  : `${this.getBaseURL()}/increment/${key}`,
        query: { count }
      })
  }

  decrement(key, count) {
    if (!key || typeof key !== 'string') {
      throw new Error('Key must be provided and must be a string.')
    }

    if (count !== undefined && (isNaN(count) || typeof count !== 'number')) {
      throw new Error('Count must be a number.')
    }

    return this.app.request
      .put({
        url  : `${this.getBaseURL()}/decrement/${key}`,
        query: { count }
      })
  }

  deleteKeys(keys) {
    if (!keys || !(typeof keys === 'string' || Array.isArray(keys))) {
      throw new Error('Key(s) must be provided and must be a string or list of strings.')
    }

    return this.app.request
      .delete({
        url : `${this.getBaseURL()}/by-obj-keys`,
        data: Utils.castArray(keys)
      })
  }
}
