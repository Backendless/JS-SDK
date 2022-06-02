import { HiveStore } from './base-store'
import { HiveTypes } from '../constants'
import Utils from '../../utils'

export class SetStore extends HiveStore {
  constructor(dataStore, storeKey) {
    super(dataStore, HiveTypes.SET)

    this.storeKey = storeKey
  }

  get() {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    return this.app.request
      .get({
        url: `${this.storeUrl}/${this.storeKey}`,
      })
  }

  getRandom(count) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (count !== undefined && (isNaN(count) || typeof count !== 'number')) {
      throw new Error('Count must be a number.')
    }

    return this.app.request
      .get({
        url  : `${this.storeUrl}/${this.storeKey}/random`,
        query: { count }
      })
  }

  getRandomAndDelete(count) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (count !== undefined && (isNaN(count) || typeof count !== 'number')) {
      throw new Error('Count must be a number.')
    }

    return this.app.request
      .put({
        url  : `${this.storeUrl}/${this.storeKey}/random`,
        query: { count }
      })
  }

  set(values) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (!values || !(typeof values === 'string' || Array.isArray(values))) {
      throw new Error('Value(s) must be provided and must be a string or list of strings.')
    }

    return this.app.request
      .put({
        url : `${this.storeUrl}/${this.storeKey}`,
        data: Utils.castArray(values)
      })
  }

  add(values) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (!values || !(typeof values === 'string' || Array.isArray(values))) {
      throw new Error('Value(s) must be provided and must be a string or list of strings.')
    }

    return this.app.request
      .put({
        url : `${this.storeUrl}/${this.storeKey}/add`,
        data: Utils.castArray(values)
      })
  }

  removeValues(values) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (!values || !(typeof values === 'string' || Array.isArray(values))) {
      throw new Error('Value(s) must be provided and must be a string or list of strings.')
    }

    return this.app.request
      .delete({
        url : `${this.storeUrl}/${this.storeKey}/values`,
        data: Utils.castArray(values)
      })
  }

  isMember(value) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (!value || typeof value !== 'string') {
      throw new Error('Value must be provided and must be a string.')
    }

    return this.app.request
      .get({
        url    : `${this.storeUrl}/${this.storeKey}/contains`,
        headers: { 'Content-Type': 'text/plain' },
        data   : value
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

  difference(storeKeys) {
    if (!storeKeys || !Array.isArray(storeKeys)) {
      throw new Error('Store keys must be provided and must be an array.')
    }

    return this.app.request
      .post({
        url : `${this.storeUrl}/action/difference`,
        data: storeKeys
      })
  }

  intersection(storeKeys) {
    if (!storeKeys || !Array.isArray(storeKeys)) {
      throw new Error('Store keys must be provided and must be an array.')
    }

    return this.app.request
      .post({
        url : `${this.storeUrl}/action/intersection`,
        data: storeKeys
      })
  }

  union(storeKeys) {
    if (!storeKeys || !Array.isArray(storeKeys)) {
      throw new Error('Store keys must be provided and must be an array.')
    }

    return this.app.request
      .post({
        url : `${this.storeUrl}/action/union`,
        data: storeKeys
      })
  }
}
