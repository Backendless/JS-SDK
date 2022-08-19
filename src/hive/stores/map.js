import { HiveTypes } from '../constants'
import { HiveStore } from './base-store'
import Utils from '../../utils'

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

  set(data) {
    if (!Utils.isObject(data)) {
      throw new Error('Payload must be an object.')
    }

    if (!Object.keys(data).length) {
      throw new Error('Provided object must have at least 1 key.')
    }

    return this.app.request
      .put({
        url: this.getBaseURL(),
        data,
      })
  }

  add(data) {
    if (!Utils.isObject(data)) {
      throw new Error('Payload must be an object.')
    }

    if (!Object.keys(data).length) {
      throw new Error('Provided object must have at least 1 key.')
    }

    return this.app.request
      .put({
        url: `${this.getBaseURL()}/add`,
        data,
      })
  }

  setValue(key, value, ifNotExists) {
    if (!key || typeof key !== 'string') {
      throw new Error('Key must be provided and must be a string.')
    }

    if (!value || typeof value !== 'string') {
      throw new Error('Value must be provided and must be a string.')
    }

    if (ifNotExists !== undefined && typeof ifNotExists !== 'boolean') {
      throw new Error('Argument ifNotExists must be a boolean.')
    }

    return this.app.request
      .put({
        url : `${this.getBaseURL()}/set/${key}`,
        data: {
          value,
          ifNotExists
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
