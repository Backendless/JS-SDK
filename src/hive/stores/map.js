import { HiveTypes } from '../constants'
import { HiveStore } from './base-store'
import Utils from '../../utils'

export class MapStore extends HiveStore {
  constructor(dataStore, storeKey) {
    super(dataStore, HiveTypes.MAP)

    this.storeKey = storeKey
  }

  get(keys) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (keys !== undefined && !(typeof keys === 'string' || Array.isArray(keys))) {
      throw new Error('Key(s) must be a string or list of strings.')
    }

    return this.app.request
      .post({
        url : `${this.storeUrl}/${this.storeKey}`,
        data: Utils.castArray(keys)
      })
  }

  getValue(key) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (!key || typeof key !== 'string') {
      throw new Error('Key must be provided and must be a string.')
    }

    return this.app.request
      .get({
        url: `${this.storeUrl}/${this.storeKey}/get/${key}`,
      })
  }

  keyExists(key) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (!key || typeof key !== 'string') {
      throw new Error('Key must be provided and must be a string.')
    }

    return this.app.request
      .get({
        url: `${this.storeUrl}/${this.storeKey}/exists/${key}`,
      })
  }

  length() {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    return this.app.request
      .get({
        url: `${this.storeUrl}/${this.storeKey}/length`,
      })
  }

  keys() {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    return this.app.request
      .get({
        url: `${this.storeUrl}/${this.storeKey}/keys`,
      })
  }

  values() {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    return this.app.request
      .get({
        url: `${this.storeUrl}/${this.storeKey}/values`,
      })
  }

  set(data) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (!Utils.isObject(data)) {
      throw new Error('Payload must be an object.')
    }

    if (!Object.keys(data).length) {
      throw new Error('Provided object must have at least 1 key.')
    }

    return this.app.request
      .put({
        url: `${this.storeUrl}/${this.storeKey}`,
        data,
      })
  }

  add(data) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (!Utils.isObject(data)) {
      throw new Error('Payload must be an object.')
    }

    if (!Object.keys(data).length) {
      throw new Error('Provided object must have at least 1 key.')
    }

    return this.app.request
      .put({
        url: `${this.storeUrl}/${this.storeKey}/add`,
        data,
      })
  }

  setValue(key, value, ifNotExists) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

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
        url    : `${this.storeUrl}/${this.storeKey}/set/${key}`,
        data   : value,
        headers: { 'Content-Type': 'text/plain' },
        query  : { ifNotExists }
      })
  }

  increment(key, count) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (!key || typeof key !== 'string') {
      throw new Error('Key must be provided and must be a string.')
    }

    if (count !== undefined && (isNaN(count) || typeof count !== 'number')) {
      throw new Error('Count must be a number.')
    }

    return this.app.request
      .put({
        url  : `${this.storeUrl}/${this.storeKey}/increment/${key}`,
        query: { count }
      })
  }

  deleteKeys(keys) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (!keys || !(typeof keys === 'string' || Array.isArray(keys))) {
      throw new Error('Key(s) must be provided and must be a string or list of strings.')
    }

    return this.app.request
      .delete({
        url : `${this.storeUrl}/${this.storeKey}/by-obj-keys`,
        data: Utils.castArray(keys)
      })
  }
}
