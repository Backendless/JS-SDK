import { HiveTypes } from '../constants'
import { HiveStore } from './base-store'
import { isHiveValueValid } from '../utils'

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
    if (!isHiveValueValid(valueToInsert)) {
      throw new Error(
        'ValueToInsert must be provided and must be one of types: string, number, boolean, object, array.'
      )
    }

    if (!isHiveValueValid(anchorValue)) {
      throw new Error('AnchorValue must be provided and must be one of types: string, number, boolean, object, array.')
    }

    return this.app.request
      .put({
        url : `${this.getBaseURL()}/insert-${before ? 'before' : 'after'}`,
        data: {
          valueToInsert,
          anchorValue,
        }
      })
  }

  deleteValue(value, count) {
    if (!isHiveValueValid(value)) {
      throw new Error('Value must be provided and must be one of types: string, number, boolean, object, array.')
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

  addFirstValue(value) {
    if (!isHiveValueValid(value)) {
      throw new Error('Value must be provided and must be one of types: string, number, boolean, object, array.')
    }

    return this.app.request
      .put({
        url : `${this.getBaseURL()}/add-first`,
        data: [value]
      })
  }

  addFirstValues(values) {
    if (!values || !Array.isArray(values) || !values.length || !isHiveValueValid(values)) {
      throw new Error('Value must be provided and must be a list of valid JSON items.')
    }

    return this.app.request
      .put({
        url : `${this.getBaseURL()}/add-first`,
        data: values
      })
  }

  addLastValue(value) {
    if (!isHiveValueValid(value)) {
      throw new Error('Value must be provided and must be one of types: string, number, boolean, object, array.')
    }

    return this.app.request
      .put({
        url : `${this.getBaseURL()}/add-last`,
        data: [value]
      })
  }

  addLastValues(values) {
    if (!values || !Array.isArray(values) || !values.length || !isHiveValueValid(values)) {
      throw new Error('Value must be provided and must be a list of valid JSON items.')
    }

    return this.app.request
      .put({
        url : `${this.getBaseURL()}/add-last`,
        data: values
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
