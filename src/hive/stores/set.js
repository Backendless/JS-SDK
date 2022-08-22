import { HiveStore } from './base-store'
import { HiveTypes } from '../constants'
import Utils from '../../utils'

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

  set(values) {
    if (!values || (typeof values !== 'string' && !Array.isArray(values))) {
      throw new Error('Value(s) must be provided and must be a string or list of strings.')
    }

    return this.app.request
      .put({
        url : this.getBaseURL(),
        data: Utils.castArray(values)
      })
  }

  add(values) {
    if (!values || !(typeof values === 'string' || Array.isArray(values))) {
      throw new Error('Value(s) must be provided and must be a string or list of strings.')
    }

    return this.app.request
      .put({
        url : `${this.getBaseURL()}/add`,
        data: Utils.castArray(values)
      })
  }

  deleteValues(values) {
    if (!values || !(typeof values === 'string' || Array.isArray(values))) {
      throw new Error('Value(s) must be provided and must be a string or list of strings.')
    }

    return this.app.request
      .delete({
        url : `${this.getBaseURL()}/values`,
        data: Utils.castArray(values)
      })
  }

  isMember(value) {
    if (!value || typeof value !== 'string') {
      throw new Error('Value must be provided and must be a string.')
    }

    return this.app.request
      .get({
        url  : `${this.getBaseURL()}/contains`,
        query: {
          value
        }
      })
  }

  length() {
    return this.app.request.get({
      url: `${this.getBaseURL()}/length`,
    })
  }

}
