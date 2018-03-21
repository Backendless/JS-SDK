import { RTClient, RTListeners, checkUsesInBusinessLogic } from '../../rt'

import { parseFindResponse } from '../store/parse'

const ChangesTypes = {
  CREATED: 'created',
  UPDATED: 'updated',
  DELETED: 'deleted',

  BULK_CREATED: 'bulk-created',
  BULK_UPDATED: 'bulk-updated',
  BULK_DELETED: 'bulk-deleted',
}

const SingleChangesTypes = [
  ChangesTypes.CREATED,
  ChangesTypes.UPDATED,
  ChangesTypes.DELETED,
]

export default class EventHandler extends RTListeners {

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

  removeCreateListeners(whereClause, callback) {
    this.removeChangesListeners(ChangesTypes.CREATED, whereClause, callback)
  }

  removeCreateListener(callback) {
    this.removeCreateListeners(undefined, callback)
  }

  addUpdateListener(whereClause, callback, onError) {
    this.addChangesListener(ChangesTypes.UPDATED, whereClause, callback, onError)
  }

  removeUpdateListeners(whereClause, callback) {
    this.removeChangesListeners(ChangesTypes.UPDATED, whereClause, callback)
  }

  removeUpdateListener(callback) {
    this.removeUpdateListeners(undefined, callback)
  }

  addDeleteListener(whereClause, callback, onError) {
    this.addChangesListener(ChangesTypes.DELETED, whereClause, callback, onError)
  }

  removeDeleteListeners(whereClause, callback) {
    this.removeChangesListeners(ChangesTypes.DELETED, whereClause, callback)
  }

  removeDeleteListener(callback) {
    this.removeDeleteListeners(undefined, callback)
  }

  // addBulkCreateListener(whereClause, callback, onError) {
  //   this.addChangesListener(ChangesTypes.BULK_CREATED, whereClause, callback, onError)
  // }
  //
  // removeBulkCreateListeners(whereClause, callback) {
  //   this.removeChangesListeners(ChangesTypes.BULK_CREATED, whereClause, callback)
  // }
  //
  // removeBulkCreateListener(callback) {
  //   this.removeBulkCreateListeners(undefined callback)
  // }

  addBulkUpdateListener(whereClause, callback, onError) {
    this.addChangesListener(ChangesTypes.BULK_UPDATED, whereClause, callback, onError)
  }

  removeBulkUpdateListeners(whereClause, callback) {
    this.removeChangesListeners(ChangesTypes.BULK_UPDATED, whereClause, callback)
  }

  removeBulkUpdateListener(callback) {
    this.removeBulkUpdateListeners(undefined, callback)
  }

  addBulkDeleteListener(whereClause, callback, onError) {
    this.addChangesListener(ChangesTypes.BULK_DELETED, whereClause, callback, onError)
  }

  removeBulkDeleteListeners(whereClause, callback) {
    this.removeChangesListeners(ChangesTypes.BULK_DELETED, whereClause, callback)
  }

  removeBulkDeleteListener(callback) {
    this.removeBulkDeleteListeners(undefined, callback)
  }

  addChangesListener(event, whereClause, callback, onError) {
    checkUsesInBusinessLogic('Subscribe on Data changes')

    if (typeof whereClause === 'function') {
      onError = callback
      callback = whereClause
      whereClause = undefined
    }

    if (typeof callback !== 'function') {
      throw new Error('"callback" must be function.')
    }

    this.addSubscription(event, RTClient.subscriptions.onObjectsChanges, {
      callback,
      onError,
      parser      : SingleChangesTypes.includes(event) ? this.parseObjectToInstance : undefined,
      extraOptions: {
        event,
        whereClause
      }
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

      if (whereClause) {
        return extraOptions.whereClause === whereClause
      }

      if (callback) {
        return subscription.callback === callback
      }

      return true
    }

    this.stopSubscription(event, { argumentsMatcher })
  }

  parseObjectToInstance = object => {
    //TODO: "parseFindResponse" method must be moved to dataStore
    return parseFindResponse(object, this.dataStore.model)
  }
}
