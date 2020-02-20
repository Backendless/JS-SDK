import Data from '../../data'
import { ActionTypes, callbackManager } from './callback-manager'
import { DBManager, idbConnection } from './database-manager'
import Operations from './operations'

const sanitizeRecord = record => {
  delete record.blPendingOperation
  delete record.blLocalId

  return record
}

const saveRecord = async (tableName, record) => {
  const { blLocalId } = record
  const [onSave, onError] = callbackManager.getCallbacks(ActionTypes.SAVE, tableName)

  try {
    const savedObject = await Data.of(tableName).save(sanitizeRecord(record))

    await DBManager.replaceLocalObject(tableName, { ...savedObject, blLocalId: savedObject.objectId }, blLocalId)

    onSave(tableName, savedObject)
  } catch (error) {
    onError(tableName, error)
  }
}

const deleteRecord = async (tableName, record) => {
  const [onSuccess, onError] = callbackManager.getCallbacks(ActionTypes.DELETE, tableName)

  try {
    if (record.objectId) {
      await Data.of(tableName).remove(record)
    }

    await DBManager.deleteLocalObject(tableName, record)

    onSuccess(sanitizeRecord(record))
  } catch (error) {
    onError(tableName, error)
  }
}

const transactionsMap = {
  [Operations.CREATE]: {
    run: saveRecord
  },
  [Operations.UPDATE]: {
    run: saveRecord
  },
  [Operations.DELETE]: {
    run: deleteRecord
  },
}

const getUnsavedRecords = tableName => {
  return idbConnection.select({
    from : tableName,
    where: {
      blPendingOperation: {
        '!=': ''
      }
    }
  })
}

async function executeTransactions(tableName) {
  const unsavedRecords = await getUnsavedRecords(tableName)

  return Promise.all(unsavedRecords.map(record => {
    const transaction = transactionsMap[record.blPendingOperation]

    return transaction.run(tableName, record)
  }))
}

export {
  executeTransactions
}