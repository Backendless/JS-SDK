import Data from '../../data'
import Utils from '../../utils'
import { ActionTypes, callbackManager } from './callback-manager'
import { DBManager, idbConnection } from './database-manager'
import { sanitizeRecord } from './database-manager/utils'
import Operations from './operations'

const saveObject = async (tableName, object) => {
  const { blLocalId, blPendingOperation } = object
  const [onSuccess, onError] = callbackManager.getCallbacks(ActionTypes.SAVE, tableName)

  try {
    const objectToSave = Utils.omit(sanitizeRecord(object), ['blPendingOperation', 'blLocalId'])
    const savedObject = await Data.of(tableName).save(objectToSave)

    await DBManager.replaceLocalObject(tableName, {
      ...savedObject,
      blPendingOperation: null,
      blLocalId         : savedObject.objectId
    }, blLocalId)

    onSuccess(tableName, savedObject)

    return { blPendingOperation, object: savedObject, status: 'success' }
  } catch (error) {
    const errorMessage = error.message || error

    onError(tableName, error)

    return { blPendingOperation, object, status: 'error', errorMessage }
  }
}

const deleteObject = async (tableName, object) => {
  const [onSuccess, onError] = callbackManager.getCallbacks(ActionTypes.DELETE, tableName)
  const { blPendingOperation } = object

  try {
    if (object.objectId) {
      await Data.of(tableName).remove(object)
    }

    await DBManager.deleteLocalObject(tableName, object)

    const sanitizedObject = sanitizeRecord(object)

    onSuccess(sanitizedObject)

    return { blPendingOperation, object: sanitizedObject, status: 'success' }
  } catch (error) {
    const errorMessage = error.message || error

    onError(tableName, error)

    return { blPendingOperation, object, status: 'error', errorMessage }
  }
}

const transactionsMap = {
  [Operations.CREATE]: {
    run: saveObject
  },
  [Operations.UPDATE]: {
    run: saveObject
  },
  [Operations.DELETE]: {
    run: deleteObject
  },
}

const getUnsavedObjects = tableName => {
  return idbConnection.select({
    from : tableName,
    where: {
      blPendingOperation: {
        '!=': ''
      }
    }
  })
}

const getSyncStatus = result => {
  const syncStatus = {
    successfulCompletion: {
      created: [],
      updated: [],
      deleted: [],
    },
    failedCompletion    : {
      createErrors: [],
      updateErrors: [],
      deleteErrors: [],
    }
  }

  result.forEach(({ object, status, blPendingOperation, errorMessage }) => {
    if (status === 'success') {
      const prop = blPendingOperation === Operations.CREATE
        ? 'created'
        : blPendingOperation === Operations.UPDATE
          ? 'updated'
          : 'deleted'

      syncStatus.successfulCompletion[prop].push(object)
    }

    if (status === 'error') {
      const prop = blPendingOperation === Operations.CREATE
        ? 'createErrors'
        : blPendingOperation === Operations.UPDATE
          ? 'updateErrors'
          : 'deleteErrors'

      syncStatus.failedCompletion[prop].push({ object, error: errorMessage })
    }
  })

  return syncStatus
}

export async function executeTransactions(tableName) {
  const unsavedObjects = await getUnsavedObjects(tableName)

  const result = await Promise.all(unsavedObjects.map(object => {
    const transaction = transactionsMap[object.blPendingOperation]

    return transaction.run(tableName, object)
  }))

  return getSyncStatus(result)
}