import { RTProvider, RTListeners } from '../../rt'

const ChangesTypes = {
  CREATED: 'created',
  UPDATED: 'updated',
  DELETED: 'deleted',

  BULK_CREATED: 'bulk-created',
  BULK_UPDATED: 'bulk-updated',
  BULK_DELETED: 'bulk-deleted',
}

export default class RTDataStore extends RTListeners {

  constructor(dataStore) {
    super()

    this.dataStore = dataStore
  }

  getSubscriptionOptions() {
    return {
      tableName: this.dataStore.className
    }
  }

  addCreateListener(whereClause, callback) {
    this.addChangesListener(ChangesTypes.CREATED, whereClause, callback)
  }

  removeCreateListeners(whereClause, callback) {
    this.removeChangesListeners(ChangesTypes.CREATED, whereClause, callback)
  }

  addUpdateListener(whereClause, callback) {
    this.addChangesListener(ChangesTypes.UPDATED, whereClause, callback)
  }

  removeUpdateListeners(whereClause, callback) {
    this.removeChangesListeners(ChangesTypes.UPDATED, whereClause, callback)
  }

  addDeleteListener(whereClause, callback) {
    this.addChangesListener(ChangesTypes.DELETED, whereClause, callback)
  }

  removeDeleteListeners(whereClause, callback) {
    this.removeChangesListeners(ChangesTypes.DELETED, whereClause, callback)
  }

  addBulkCreateListener(callback) {
    this.addChangesListener(ChangesTypes.BULK_CREATED, callback)
  }

  removeBulkCreateListeners(callback) {
    this.removeChangesListeners(ChangesTypes.BULK_CREATED, callback)
  }

  addBulkUpdateListener(callback) {
    this.addChangesListener(ChangesTypes.BULK_UPDATED, callback)
  }

  removeBulkUpdateListeners(callback) {
    this.removeChangesListeners(ChangesTypes.BULK_UPDATED, callback)
  }

  addBulkDeleteListener(callback) {
    this.addChangesListener(ChangesTypes.BULK_DELETED, callback)
  }

  removeBulkDeleteListeners(callback) {
    this.removeChangesListeners(ChangesTypes.BULK_DELETED, callback)
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

  removeChangesListeners(event, whereClause, callback) {
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
