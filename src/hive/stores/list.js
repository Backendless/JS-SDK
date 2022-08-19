import { HiveTypes } from '../constants'
import { HiveStore } from './base-store'
import Utils from '../../utils'

export class ListStore extends HiveStore {

  static TYPE = HiveTypes.LIST

  get(from, to) {
    if (to !== undefined) {
      if (isNaN(to) || typeof to !== 'number') {
        throw new Error('Index To must be a number.')
      }

      if (isNaN(from) || typeof from !== 'number') {
        throw new Error('Index From must be a number.')
      }

      return this.app.request
        .get({
          url  : this.getBaseURL(),
          query: { from, to }
        })
    }

    if (from !== undefined) {
      if (isNaN(from) || typeof from !== 'number') {
        throw new Error('Index must be a number.')
      }

      return this.app.request
        .get({
          url: `${this.getBaseURL()}/${from}`,
        })
    }

    return this.app.request
      .get({
        url: this.getBaseURL(),
      })
  }

  set(value, index) {
    if (Array.isArray(value)) {
      return this.app.request
        .put({
          url : this.getBaseURL(),
          data: value
        })
    }

    if (isNaN(index) || typeof index !== 'number') {
      throw new Error('Index must be a number.')
    }

    return this.app.request
      .put({
        url    : `${this.getBaseURL()}/${index}`,
        headers: { 'Content-Type': 'text/plain' },
        data   : value
      })
  }

  length() {
    return this.app.request
      .get({
        url: `${this.getBaseURL()}/length`,
      })
  }

  insert(targetValue, value, before) {
    if (!targetValue || typeof targetValue !== 'string') {
      throw new Error('Target Value must be provided and must be a string.')
    }

    if (!value || typeof value !== 'string') {
      throw new Error('Value must be provided and must be a string.')
    }

    if (before !== undefined && typeof before !== 'boolean') {
      throw new Error('Argument Before must be a boolean.')
    }

    return this.app.request
      .put({
        url : `${this.getBaseURL()}/insert`,
        data: {
          targetValue,
          value,
          before
        }
      })
  }

  removeValue(value, count) {
    if (!value || typeof value !== 'string') {
      throw new Error('Value must be provided and must be a string.')
    }

    if (count !== undefined && (isNaN(count) || typeof count !== 'number')) {
      throw new Error('Count must be a number.')
    }

    return this.app.request
      .put({
        url    : `${this.getBaseURL()}/remove-value`,
        headers: { 'Content-Type': 'text/plain' },
        data   : value,
        query  : { count }
      })
  }

  addFirst(value) {
    if (!value || !(typeof value === 'string' || Array.isArray(value))) {
      throw new Error('Value(s) must be provided and must be a string or list of strings.')
    }

    return this.app.request
      .put({
        url : `${this.getBaseURL()}/add-first`,
        data: Utils.castArray(value)
      })
  }

  addLast(value) {
    if (!value || !(typeof value === 'string' || Array.isArray(value))) {
      throw new Error('Value(s) must be provided and must be a string or list of strings.')
    }

    return this.app.request
      .put({
        url : `${this.getBaseURL()}/add-last`,
        data: Utils.castArray(value)
      })
  }

  removeFirst(count) {
    if (count !== undefined && (isNaN(count) || typeof count !== 'number')) {
      throw new Error('Count must be a number.')
    }

    return this.app.request
      .put({
        url  : `${this.getBaseURL()}/get-first-and-remove`,
        query: { count },
      })
  }

  removeLast(count) {
    if (count !== undefined && (isNaN(count) || typeof count !== 'number')) {
      throw new Error('Count must be a number.')
    }

    return this.app.request
      .put({
        url  : `${this.getBaseURL()}/get-last-and-remove`,
        query: { count },
      })
  }
}
