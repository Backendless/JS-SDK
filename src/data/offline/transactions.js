import Data from '../../data'
import { ActionTypes, callbackManager } from './callback-manager'
import { DBManager, idbConnection } from './database-manager'
import Operations from './operations'

const sanitizeRecord = record => {
  delete record.blPendingOperation

  return record
}

const saveRecord = async (tableName, record) => {
  const { blLocalId } = record

  const savedObject = await Data.of(tableName).save(sanitizeRecord(record))

  await DBManager.replaceLocalObject(tableName, { ...savedObject, blLocalId: savedObject.objectId }, blLocalId)

  return savedObject
}

const deleteRecord = async (tableName, record) => {
  if (record.objectId) {
    await Data.of(tableName).remove(record)
  }

  await DBManager.deleteLocalObject(tableName, record)

  return sanitizeRecord(record)
}

const performTransaction = async (tableName, record, transaction) => {
  const [onSuccess, onError] = callbackManager.getCallbacks(transaction.type, tableName)

  try {
    const result = await transaction.run(tableName, record)
    onSuccess(tableName, result)
  } catch (error) {
    onError(tableName, error)
  }
}

const transactionsMap = {
  [Operations.CREATE]: {
    type: ActionTypes.SAVE,
    run : saveRecord
  },
  [Operations.UPDATE]: {
    type: ActionTypes.SAVE,
    run : saveRecord
  },
  [Operations.DELETE]: {
    type: ActionTypes.DELETE,
    run : deleteRecord
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

  return Promise.all(unsavedRecords.map(record => (
    performTransaction(tableName, record, transactionsMap[record.blPendingOperation])
  )))
}

export {
  executeTransactions
}