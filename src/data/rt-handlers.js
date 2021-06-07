import { RTListeners } from '../rt'

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

export default class RTHandlers extends RTListeners {

  constructor(dataStore) {
    super()

    this.dataStore = dataStore
    this.app = dataStore.app
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
    if (!callback || typeof callback !== 'function') {
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
    if (!callback || typeof callback !== 'function') {
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
    if (!callback || typeof callback !== 'function') {
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
    if (!callback || typeof callback !== 'function') {
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
    if (!callback || typeof callback !== 'function') {
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
    if (!callback || typeof callback !== 'function') {
      throw new Error('Listener Function must be passed.')
    }

    this.removeBulkDeleteListeners(undefined, callback)
  }

  addSetRelationListener(relationColumnName, parentObjects, callback, onError) {
    this.addRelationsChangesListener(RelationsChangesTypes.SET, relationColumnName, parentObjects, callback, onError)
  }

  removeSetRelationListener(callback) {
    if (!callback || typeof callback !== 'function') {
      throw new Error('Listener Function must be passed.')
    }

    this.removeRelationsChangesListeners(RelationsChangesTypes.SET, undefined, callback)
  }

  removeSetRelationListeners(relationColumnName, callback) {
    this.removeRelationsChangesListeners(RelationsChangesTypes.SET, relationColumnName, callback)
  }

  addAddRelationListener(relationColumnName, parentObjects, callback, onError) {
    this.addRelationsChangesListener(RelationsChangesTypes.ADD, relationColumnName, parentObjects, callback, onError)
  }

  removeAddRelationListener(callback) {
    if (!callback || typeof callback !== 'function') {
      throw new Error('Listener Function must be passed.')
    }

    this.removeRelationsChangesListeners(RelationsChangesTypes.ADD, undefined, callback)
  }

  removeAddRelationListeners(relationColumnName, callback) {
    this.removeRelationsChangesListeners(RelationsChangesTypes.ADD, relationColumnName, callback)
  }

  addDeleteRelationListener(relationColumnName, parentObjects, callback, onError) {
    this.addRelationsChangesListener(RelationsChangesTypes.DELETE, relationColumnName, parentObjects, callback, onError)
  }

  removeDeleteRelationListener(callback) {
    if (!callback || typeof callback !== 'function') {
      throw new Error('Listener Function must be passed.')
    }

    this.removeRelationsChangesListeners(RelationsChangesTypes.DELETE, undefined, callback)
  }

  removeDeleteRelationListeners(relationColumnName, callback) {
    this.removeRelationsChangesListeners(RelationsChangesTypes.DELETE, relationColumnName, callback)
  }

  addChangesListener(event, whereClause, callback, onError) {
    if (typeof whereClause === 'function') {
      onError = callback
      callback = whereClause
      whereClause = undefined
    }

    if (typeof callback !== 'function') {
      throw new Error('Listener Function must be passed.')
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
    if (!relationColumnName || typeof relationColumnName !== 'string') {
      throw new Error('Relation Column Name must be a string.')
    }

    if (typeof parentObjects === 'function') {
      onError = callback
      callback = parentObjects
      parentObjects = undefined
    }

    if (typeof callback !== 'function') {
      throw new Error('Listener Function must be passed.')
    }

    if (parentObjects) {
      if (!Array.isArray(parentObjects)) {
        throw new Error('Parent Objects must be an array')
      }

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
    if (typeof relationColumnName === 'function') {
      callback = relationColumnName
      relationColumnName = undefined
    }

    const matcher = subscription => {
      const params = subscription.params

      if (relationColumnName) {
        return params.relationColumnName === relationColumnName
      }

      if (callback) {
        return subscription.callback === callback
      }

      return true
    }

    this.stopSubscription(event, { matcher })
  }

  removeAllListeners() {
    super.removeAllListeners()
  }

  /**
   * @private
   * */
  parseObjectToInstance(object) {
    return this.dataStore.parseResponse(object)
  }
}
