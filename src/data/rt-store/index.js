import { RTListeners } from '../../rt'

import { parseFindResponse } from '../store/parse'

const ChangesTypes = {
  CREATED: 'created',
  UPDATED: 'updated',
  DELETED: 'deleted',

  BULK_CREATED: 'bulk-created',
  BULK_UPDATED: 'bulk-updated',
  BULK_DELETED: 'bulk-deleted',
}

const RelationsChangesTypes = {
  ADD   : 'add',
  SET   : 'set',
  DELETE: 'delete',
}

const SingleChangesTypes = [
  ChangesTypes.CREATED,
  ChangesTypes.UPDATED,
  ChangesTypes.DELETED,
]

export default class EventHandler extends RTListeners {

  constructor(dataStore, app) {
    super()

    this.app = app
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
    if (!callback) {
      throw new Error('Listener Function must be passed.')
    }

    this.removeCreateListeners(undefined, callback)
  }

  addUpdateListener(whereClause, callback, onError) {
    this.addChangesListener(ChangesTypes.UPDATED, whereClause, callback, onError)
  }

  removeUpdateListeners(whereClause, callback) {
    this.removeChangesListeners(ChangesTypes.UPDATED, whereClause, callback)
  }

  removeUpdateListener(callback) {
    if (!callback) {
      throw new Error('Listener Function must be passed.')
    }

    this.removeUpdateListeners(undefined, callback)
  }

  addDeleteListener(whereClause, callback, onError) {
    this.addChangesListener(ChangesTypes.DELETED, whereClause, callback, onError)
  }

  removeDeleteListeners(whereClause, callback) {
    this.removeChangesListeners(ChangesTypes.DELETED, whereClause, callback)
  }

  removeDeleteListener(callback) {
    if (!callback) {
      throw new Error('Listener Function must be passed.')
    }

    this.removeDeleteListeners(undefined, callback)
  }

  addBulkCreateListener(whereClause, callback, onError) {
    this.addChangesListener(ChangesTypes.BULK_CREATED, whereClause, callback, onError)
  }

  removeBulkCreateListeners() {
    this.removeChangesListeners(ChangesTypes.BULK_CREATED)
  }

  removeBulkCreateListener(callback) {
    if (!callback) {
      throw new Error('Listener Function must be passed.')
    }

    this.removeChangesListeners(ChangesTypes.BULK_CREATED, undefined, callback)
  }

  addBulkUpdateListener(whereClause, callback, onError) {
    this.addChangesListener(ChangesTypes.BULK_UPDATED, whereClause, callback, onError)
  }

  removeBulkUpdateListeners(whereClause, callback) {
    this.removeChangesListeners(ChangesTypes.BULK_UPDATED, whereClause, callback)
  }

  removeBulkUpdateListener(callback) {
    if (!callback) {
      throw new Error('Listener Function must be passed.')
    }

    this.removeBulkUpdateListeners(undefined, callback)
  }

  addBulkDeleteListener(whereClause, callback, onError) {
    this.addChangesListener(ChangesTypes.BULK_DELETED, whereClause, callback, onError)
  }

  removeBulkDeleteListeners(whereClause, callback) {
    this.removeChangesListeners(ChangesTypes.BULK_DELETED, whereClause, callback)
  }

  removeBulkDeleteListener(callback) {
    if (!callback) {
      throw new Error('Listener Function must be passed.')
    }

    this.removeBulkDeleteListeners(undefined, callback)
  }

  addSetRelationListener(relationColumnName, parentObjects, callback, onError) {
    this.addRelationsChangesListener(RelationsChangesTypes.SET, relationColumnName, parentObjects, callback, onError)
  }

  removeSetRelationListener(relationColumnName, parentObjects, callback) {
    this.removeRelationsChangesListeners(RelationsChangesTypes.SET, relationColumnName, parentObjects, callback)
  }

  addAddRelationListener(relationColumnName, parentObjects, callback, onError) {
    this.addRelationsChangesListener(RelationsChangesTypes.ADD, relationColumnName, parentObjects, callback, onError)
  }

  removeAddRelationListener(relationColumnName, parentObjects, callback) {
    this.removeRelationsChangesListeners(RelationsChangesTypes.ADD, relationColumnName, parentObjects, callback)
  }

  addDeleteRelationListener(relationColumnName, parentObjects, callback, onError) {
    this.addRelationsChangesListener(RelationsChangesTypes.DELETE, relationColumnName, parentObjects, callback, onError)
  }

  removeDeleteRelationListener(relationColumnName, parentObjects, callback) {
    this.removeRelationsChangesListeners(RelationsChangesTypes.DELETE, relationColumnName, parentObjects, callback)
  }

  addChangesListener(event, whereClause, callback, onError) {
    if (typeof whereClause === 'function') {
      onError = callback
      callback = whereClause
      whereClause = undefined
    }

    if (typeof callback !== 'function') {
      throw new Error('"callback" must be function.')
    }

    this.addSubscription(event, this.app.RT.subscriptions.onObjectsChanges, {
      callback,
      onError,
      parser: SingleChangesTypes.includes(event) ? this.parseObjectToInstance.bind(this) : undefined,
      params: {
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

    const matcher = subscription => {
      const params = subscription.params

      if (params.event !== event) {
        return false
      }

      if (whereClause) {
        return params.whereClause === whereClause
      }

      if (callback) {
        return subscription.callback === callback
      }

      return true
    }

    this.stopSubscription(event, { matcher })
  }

  addRelationsChangesListener(event, relationColumnName, parentObjects, callback, onError) {
    if (typeof parentObjects === 'function') {
      onError = callback
      callback = parentObjects
      parentObjects = undefined
    }

    if (typeof callback !== 'function') {
      throw new Error('"callback" must be function.')
    }

    if (parentObjects) {
      parentObjects = parentObjects.map(o => o.objectId || o)
    }

    this.addSubscription(event, this.app.RT.subscriptions.onRelationsChanges, {
      callback,
      onError,
      params: {
        event,
        relationColumnName,
        parentObjects
      }
    })
  }

  removeRelationsChangesListeners(event, relationColumnName, callback) {
    const matcher = subscription => {
      const params = subscription.params

      if (params.event !== event) {
        return false
      }

      if (params.relationColumnName !== relationColumnName) {
        return false
      }

      if (callback) {
        return subscription.callback === callback
      }

      return true
    }

    this.stopSubscription(event, { matcher })
  }

  parseObjectToInstance(object) {
    //TODO: "parseFindResponse" method must be moved to dataStore
    return parseFindResponse(object, this.dataStore.model)
  }
}
