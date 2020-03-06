import { ActionTypes, callbackManager } from '../callback-manager'
import { parseObject } from '../database-manager/utils'

export async function deleteObject(tableName, object) {
  const [onSuccess, onError] = callbackManager.getCallbacks(ActionTypes.DELETE, tableName)
  const { blPendingOperation } = object

  try {
    if (object.objectId) {
      await this.app.Data.of(tableName).remove(object)
    }

    await this.app.OfflineDBManager.deleteLocalObject(tableName, object)

    const parsedObject = parseObject(object)

    onSuccess(parsedObject)

    return { blPendingOperation, object: parsedObject, status: 'success' }
  } catch (error) {
    const errorMessage = error.message || error

    onError(tableName, error)

    return { blPendingOperation, object, status: 'error', errorMessage }
  }
}
