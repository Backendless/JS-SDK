import { ActionTypes, callbackManager } from '../callback-manager'
import Utils from '../../../utils'
import { parseObject } from '../database-manager/utils'

export async function saveObject(tableName, object) {
  const { blLocalId, blPendingOperation } = object
  const [onSuccess, onError] = callbackManager.getCallbacks(ActionTypes.SAVE, tableName)

  try {
    const objectToSave = Utils.omit(parseObject(object), ['blPendingOperation', 'blLocalId'])
    const savedObject = await this.app.Data.of(tableName).save(objectToSave)

    await this.app.OfflineDBManager.replaceLocalObject(tableName, {
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
