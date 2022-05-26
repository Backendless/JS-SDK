import { HiveTypes } from '../constants'
import { HiveStore } from './base-store'
import Utils from '../../utils'

export class ListStore extends HiveStore {
  constructor(dataStore, storeKey) {
    super(dataStore, HiveTypes.LIST)

    this.storeKey = storeKey
  }

  get(from, to) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (to !== undefined) {
      if (isNaN(to) || typeof to !== 'number') {
        throw new Error('Index To must be a number.')
      }

      if (isNaN(from) || typeof from !== 'number') {
        throw new Error('Index From must be a number.')
      }

      return this.app.request
        .get({
          url  : `${this.storeUrl}/${this.storeKey}`,
          query: { from, to }
        })
    }

    if (from !== undefined) {
      if (isNaN(from) || typeof from !== 'number') {
        throw new Error('Index must be a number.')
      }

      return this.app.request
        .get({
          url: `${this.storeUrl}/${this.storeKey}/${from}`,
        })
    }

    return this.app.request
      .get({
        url: `${this.storeUrl}/${this.storeKey}`,
      })
  }

  set(value, index) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (Array.isArray(value)) {
      return this.app.request
        .put({
          url : `${this.storeUrl}/${this.storeKey}`,
          data: value
        })
    }

    if (isNaN(index) || typeof index !== 'number') {
      throw new Error('Index must be a number.')
    }

    return this.app.request
      .put({
        url    : `${this.storeUrl}/${this.storeKey}/${index}`,
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

  insert(targetValue, value, before) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (!targetValue || typeof targetValue !== 'string') {
      throw new Error('Target Value must be provided and must be a string.')
    }

    if (!value || typeof value !== 'string') {
      throw new Error('Value must be provided and must be a string.')
    }

    if (before !== undefined && !!before !== before) {
      throw new Error('Argument Before must be a boolean.')
    }

    return this.app.request
      .put({
        url : `${this.storeUrl}/${this.storeKey}/insert`,
        data: {
          targetValue,
          value,
          before
        }
      })
  }

  removeValue(value, count) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (!value || typeof value !== 'string') {
      throw new Error('Value must be provided and must be a string.')
    }

    if (count !== undefined && (isNaN(count) || typeof count !== 'number')) {
      throw new Error('Count must be a number.')
    }

    return this.app.request
      .put({
        url    : `${this.storeUrl}/${this.storeKey}/remove-value`,
        headers: { 'Content-Type': 'text/plain' },
        data   : value,
        query  : { count }
      })
  }

  addFirst(value) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (!value || !(typeof value === 'string' || Array.isArray(value))) {
      throw new Error('Value(s) must be provided and must be a string or list of strings.')
    }

    return this.app.request
      .put({
        url : `${this.storeUrl}/${this.storeKey}/add-first`,
        data: Utils.castArray(value)
      })
  }

  addLast(value) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (!value || !(typeof value === 'string' || Array.isArray(value))) {
      throw new Error('Value(s) must be provided and must be a string or list of strings.')
    }

    return this.app.request
      .put({
        url : `${this.storeUrl}/${this.storeKey}/add-last`,
        data: Utils.castArray(value)
      })
  }

  removeFirst(count) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (count !== undefined && (isNaN(count) || typeof count !== 'number')) {
      throw new Error('Count must be a number.')
    }

    return this.app.request
      .put({
        url  : `${this.storeUrl}/${this.storeKey}/get-first-and-remove`,
        query: { count },
      })
  }

  removeLast(count) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (count !== undefined && (isNaN(count) || typeof count !== 'number')) {
      throw new Error('Count must be a number.')
    }
    return this.app.request
      .put({
        url  : `${this.storeUrl}/${this.storeKey}/get-last-and-remove`,
        query: { count },
      })
  }
}
