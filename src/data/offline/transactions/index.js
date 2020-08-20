import { DBOperations } from '../constants'
import { saveObject } from './save'
import { deleteObject } from './delete'
import { getSyncStatus } from './get-sync-status'

const transactionsMap = {
  [DBOperations.CREATE]: {
    run: saveObject
  },
  [DBOperations.UPDATE]: {
    run: saveObject
  },
  [DBOperations.DELETE]: {
    run: deleteObject
  },
}

function getUnsavedObjects(tableName) {
  return this.app.OfflineDBManager.connection.select({
    from : tableName,
    where: {
      blPendingOperation: {
        '!=': ''
      }
    }
  })
}

export async function executeTransactions(tableName) {
  const unsavedObjects = await getUnsavedObjects.call(this, tableName)

  const result = await Promise.all(unsavedObjects.map(object => {
    const transaction = transactionsMap[object.blPendingOperation]

    return transaction.run.call(this, tableName, object)
  }))

  return getSyncStatus(result)
}
