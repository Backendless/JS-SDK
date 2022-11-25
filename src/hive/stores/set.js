import { HiveStore } from './base-store'
import { HiveTypes } from '../constants'
import { isHiveValueValid } from '../utils'

export class SetStore extends HiveStore {

  static TYPE = HiveTypes.SET

  static STATIC_METHODS = [...HiveStore.STATIC_METHODS, 'difference', 'intersection', 'union']

  static difference(keyNames) {
    if (!Array.isArray(keyNames)) {
      throw new Error('Store keys must be provided and must be an array.')
    }

    return this.app.request
      .post({
        url : `${this.app.urls.hiveStore(this.hiveName, this.TYPE)}/action/difference`,
        data: keyNames
      })
  }

  static intersection(keyNames) {
    if (!Array.isArray(keyNames)) {
      throw new Error('Store keys must be provided and must be an array.')
    }

    return this.app.request
      .post({
        url : `${this.app.urls.hiveStore(this.hiveName, this.TYPE)}/action/intersection`,
        data: keyNames
      })
  }

  static union(keyNames) {
    if (!Array.isArray(keyNames)) {
      throw new Error('Store keys must be provided and must be an array.')
    }

    return this.app.request
      .post({
        url : `${this.app.urls.hiveStore(this.hiveName, this.TYPE)}/action/union`,
        data: keyNames
      })
  }

  get() {
    return this.app.request
      .get({
        url: this.getBaseURL(),
      })
  }

  getRandom(count) {
    if (count !== undefined && (isNaN(count) || typeof count !== 'number')) {
      throw new Error('Count must be a number.')
    }

    return this.app.request
      .get({
        url  : `${this.getBaseURL()}/random`,
        query: { count }
      })
  }

  getRandomAndDelete(count) {
    if (count !== undefined && (isNaN(count) || typeof count !== 'number')) {
      throw new Error('Count must be a number.')
    }

    return this.app.request
      .put({
        url  : `${this.getBaseURL()}/random`,
        query: { count }
      })
  }

  addValue(value) {
    if (!isHiveValueValid(value)) {
      throw new Error('Value must be provided and must be one of types: string, number, boolean, object, array.')
    }

    return this.app.request
      .put({
        url : `${this.getBaseURL()}/add`,
        data: [value]
      })
  }

  addValues(values) {
    if (!values || !Array.isArray(values) || !values.length || !isHiveValueValid(values)) {
      throw new Error('Value must be provided and must be a list of valid JSON items.')
    }

    return this.app.request
      .put({
        url : `${this.getBaseURL()}/add`,
        data: values
      })
  }

  deleteValue(value) {
    if (!isHiveValueValid(value)) {
      throw new Error('Value must be provided and must be one of types: string, number, boolean, object, array.')
    }

    return this.app.request
      .delete({
        url : `${this.getBaseURL()}/values`,
        data: [value]
      })
  }

  deleteValues(values) {
    if (!values || !Array.isArray(values) || !values.length || !isHiveValueValid(values)) {
      throw new Error('Value must be provided and must be a list of valid JSON items.')
    }

    return this.app.request
      .delete({
        url : `${this.getBaseURL()}/values`,
        data: values
      })
  }

  isValueMember(value) {
    if (!isHiveValueValid(value)) {
      throw new Error('Value must be provided and must be one of types: string, number, boolean, object, array.')
    }

    return this.app.request
      .post({
        url : `${this.getBaseURL()}/contains`,
        data: [value]
      })
  }

  isValuesMembers(values) {
    if (!values || !Array.isArray(values) || !values.length || !isHiveValueValid(values)) {
      throw new Error('Value must be provided and must be a list of valid JSON items.')
    }

    return this.app.request
      .post({
        url : `${this.getBaseURL()}/contains`,
        data: values
      })
  }

  length() {
    return this.app.request.get({
      url: `${this.getBaseURL()}/length`,
    })
  }

}
