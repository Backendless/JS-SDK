import Utils from '../../utils'
import { RTProvider, RTListeners } from '../../rt'

const RTDataStores = new WeakMap()

const ListenerTypes = Utils.mirrorKeys({
  CHANGES: null,
  ERROR  : null,
})

const ChangesTypes = {
  CREATED: 'created',
  UPDATED: 'updated',
  DELETED: 'deleted',
}

export default class RTDataStore extends RTListeners {

  static proxyRTDataStore = proxyRTDataStore

  constructor(className) {
    super()

    this.className = className
  }

  getSubscriptionOptions() {
    return {
      tableName: this.className
    }
  }

  addCreateListener(whereClause, callback) {
    this.addChangesListener(ChangesTypes.CREATED, whereClause, callback)
  }

  removeCreateListener(whereClause, callback) {
    this.removeChangesListener(ChangesTypes.CREATED, whereClause, callback)
  }

  addUpdateListener(whereClause, callback) {
    this.addChangesListener(ChangesTypes.UPDATED, whereClause, callback)
  }

  removeUpdateListener(whereClause, callback) {
    this.removeChangesListener(ChangesTypes.UPDATED, whereClause, callback)
  }

  addDeleteListener(whereClause, callback) {
    this.addChangesListener(ChangesTypes.DELETED, whereClause, callback)
  }

  removeDeleteListener(whereClause, callback) {
    this.removeChangesListener(ChangesTypes.DELETED, whereClause, callback)
  }

  addChangesListener(event, whereClause, callback) {
    if (typeof whereClause === 'function') {
      callback = whereClause
      whereClause = undefined
    }

    this.addSubscription(ListenerTypes.CHANGES, RTProvider.subscriptions.onObjectsChanges, callback, {
      event,
      whereClause
    })
  }

  removeChangesListener(event, whereClause, callback) {
    if (typeof whereClause === 'function') {
      callback = whereClause
      whereClause = undefined
    }

    const argumentsMatcher = subscription => {
      const extraOptions = subscription.extraOptions

      if (extraOptions.event !== event) {
        return false
      }

      const isWhereClauseEqual = extraOptions.whereClause === whereClause
      const isCallbackEqual = subscription.callback === callback

      if (whereClause && callback) {
        return isWhereClauseEqual && isCallbackEqual
      }

      if (whereClause) {
        return isWhereClauseEqual
      }

      if (callback) {
        return !extraOptions.whereClause && isCallbackEqual
      }

      return true
    }

    this.stopSubscription(ListenerTypes.CHANGES, { argumentsMatcher })
  }
}

function proxyRTDataStore(method) {
  return function() {
    const dataStore = this

    if (!RTDataStores.has(dataStore)) {
      RTDataStores.set(dataStore, new RTDataStore(dataStore.className))
    }

    const rtDataStore = RTDataStores.get(dataStore)

    rtDataStore[method](...arguments)

    return dataStore
  }
}