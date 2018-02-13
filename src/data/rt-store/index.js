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

  addCreateListener(whereClause, callback, onError) {
    this.addChangesListener(ChangesTypes.CREATED, whereClause, callback, onError)
  }

  removeCreateListeners(whereClause, callback, onError) {
    this.removeChangesListeners(ChangesTypes.CREATED, whereClause, callback, onError)
  }

  addUpdateListener(whereClause, callback, onError) {
    this.addChangesListener(ChangesTypes.UPDATED, whereClause, callback, onError)
  }

  removeUpdateListeners(whereClause, callback, onError) {
    this.removeChangesListeners(ChangesTypes.UPDATED, whereClause, callback, onError)
  }

  addDeleteListener(whereClause, callback, onError) {
    this.addChangesListener(ChangesTypes.DELETED, whereClause, callback, onError)
  }

  removeDeleteListeners(whereClause, callback, onError) {
    this.removeChangesListeners(ChangesTypes.DELETED, whereClause, callback, onError)
  }

  addBulkCreateListener(callback, onError) {
    this.addChangesListener(ChangesTypes.BULK_CREATED, callback, onError)
  }

  removeBulkCreateListeners(callback, onError) {
    this.removeChangesListeners(ChangesTypes.BULK_CREATED, callback, onError)
  }

  addBulkUpdateListener(callback, onError) {
    this.addChangesListener(ChangesTypes.BULK_UPDATED, callback, onError)
  }

  removeBulkUpdateListeners(callback, onError) {
    this.removeChangesListeners(ChangesTypes.BULK_UPDATED, callback, onError)
  }

  addBulkDeleteListener(callback, onError) {
    this.addChangesListener(ChangesTypes.BULK_DELETED, callback, onError)
  }

  removeBulkDeleteListeners(callback, onError) {
    this.removeChangesListeners(ChangesTypes.BULK_DELETED, callback, onError)
  }

  addChangesListener(event, whereClause, callback, onError) {
    if (typeof whereClause === 'function') {
      onError = callback
      callback = whereClause
      whereClause = undefined
    }

    this.addSubscription(event, RTProvider.subscriptions.onObjectsChanges, callback, onError, {
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
