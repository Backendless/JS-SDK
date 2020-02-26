import Utils from '../../utils'
import { ActionTypes, callbackManager } from '../offline/callback-manager'
import { DBManager } from '../offline/database-manager'
import { convertBooleansToStrings } from '../offline/database-manager/utils'
import { isOnline } from '../offline/network'
import Operations from '../offline/operations'
import { save as saveToRemoteDB } from './save'

const storeLocally = async (tableName, object) => {
  const objectToSave = convertBooleansToStrings({
    ...object,
    blPendingOperation: object.objectId ? Operations.UPDATE : Operations.CREATE,
    blLocalId         : object.objectId || object.blLocalId || Utils.uuid()
  })

  await DBManager.upsertObject(tableName, objectToSave)
}

async function tryStoreLocally(object, offlineAwareCallback = {}) {
  try {
    await storeLocally(this.className, object)

    if (offlineAwareCallback.handleLocalResponse) {
      offlineAwareCallback.handleLocalResponse(object)
    }

    return object
  } catch (error) {
    const errorMessage = error.message || error

    if (offlineAwareCallback.handleLocalFault) {
      offlineAwareCallback.handleLocalFault(errorMessage)
    }

    throw new Error(errorMessage)
  }
}

export async function saveEventually(object, offlineAwareCallback = {}) {
  if (!isOnline()) {
    return tryStoreLocally.apply(this, arguments)
  }

  const [onSuccess, onError] = callbackManager.getCallbacks(ActionTypes.SAVE, this.className)

  try {
    const savedObject = await saveToRemoteDB.call(this, object)

    await DBManager.upsertObject(this.className, {
      ...savedObject,
      blLocalId         : savedObject.objectId,
      blPendingOperation: null
    })

    if (offlineAwareCallback.handleRemoteResponse) {
      offlineAwareCallback.handleRemoteResponse(savedObject)
    } else {
      onSuccess(this.className, savedObject)
    }

    return savedObject
  } catch (error) {
    const errorMessage = error.message || error

    if (offlineAwareCallback.handleRemoteFault) {
      offlineAwareCallback.handleRemoteFault(errorMessage)
    } else {
      onError(this.className, errorMessage)
    }

    throw new Error(errorMessage)
  }
}