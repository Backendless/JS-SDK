import { RTProvider, RTListeners } from '../../rt'

const RTDataStores = new WeakMap()

const ChangesTypes = {
  CREATED: 'created',
  UPDATED: 'updated',
  DELETED: 'deleted',

  BULK_CREATED: 'bulkCreated',
  BULK_UPDATED: 'bulkUpdated',
  BULK_DELETED: 'bulkDeleted',
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

  addBulkCreateListener(callback) {
    this.addChangesListener(ChangesTypes.BULK_CREATED, callback)
  }

  removeBulkCreateListener(callback) {
    this.removeChangesListener(ChangesTypes.BULK_CREATED, callback)
  }

  addBulkUpdateListener(callback) {
    this.addChangesListener(ChangesTypes.BULK_UPDATED, callback)
  }

  removeBulkUpdateListener(callback) {
    this.removeChangesListener(ChangesTypes.BULK_UPDATED, callback)
  }

  addBulkDeleteListener(callback) {
    this.addChangesListener(ChangesTypes.BULK_DELETED, callback)
  }

  removeBulkDeleteListener(callback) {
    this.removeChangesListener(ChangesTypes.BULK_DELETED, callback)
  }

  addChangesListener(event, whereClause, callback) {
    if (typeof whereClause === 'function') {
      callback = whereClause
      whereClause = undefined
    }

    this.addSubscription(event, RTProvider.subscriptions.onObjectsChanges, callback, {
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

    this.stopSubscription(event, { argumentsMatcher })
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