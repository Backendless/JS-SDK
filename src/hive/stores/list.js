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
        url : `${this.getBaseURL()}/${index}`,
        data: {
          value
        }
      })
  }

  length() {
    return this.app.request
      .get({
        url: `${this.getBaseURL()}/length`,
      })
  }

  insertBefore(valueToInsert, anchorValue) {
    return this.insert(valueToInsert, anchorValue, true)
  }

  insertAfter(valueToInsert, anchorValue) {
    return this.insert(valueToInsert, anchorValue, false)
  }

  insert(valueToInsert, anchorValue, before) {
    if (!valueToInsert || typeof valueToInsert !== 'string') {
      throw new Error('ValueToInsert must be provided and must be a string.')
    }

    if (!anchorValue || typeof anchorValue !== 'string') {
      throw new Error('AnchorValue must be provided and must be a string.')
    }

    return this.app.request
      .put({
        url : `${this.getBaseURL()}/insert/${before ? 'before' : 'after'}`,
        data: {
          valueToInsert,
          anchorValue,
        }
      })
  }

  deleteValue(value, count) {
    if (!value || typeof value !== 'string') {
      throw new Error('Value must be provided and must be a string.')
    }

    if (count !== undefined && (isNaN(count) || typeof count !== 'number')) {
      throw new Error('Count must be a number.')
    }

    return this.app.request
      .put({
        url : `${this.getBaseURL()}/delete-value`,
        data: {
          value,
          count
        },
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

  deleteFirst(count) {
    if (count !== undefined && (isNaN(count) || typeof count !== 'number')) {
      throw new Error('Count must be a number.')
    }

    return this.app.request
      .put({
        url  : `${this.getBaseURL()}/get-first-and-delete`,
        query: { count },
      })
  }

  deleteLast(count) {
    if (count !== undefined && (isNaN(count) || typeof count !== 'number')) {
      throw new Error('Count must be a number.')
    }

    return this.app.request
      .put({
        url  : `${this.getBaseURL()}/get-last-and-delete`,
        query: { count },
      })
  }
}
