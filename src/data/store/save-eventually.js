import Utils from '../../utils'
import { ActionTypes, callbackManager } from '../offline/callback-manager'
import { convertObject } from '../offline/database-manager/utils'
import { isOnline } from '../offline/network'
import { DBOperations } from '../offline/constants'
import { save as saveToRemoteDB } from './save'

async function storeLocally(object) {
  const objectToSave = convertObject({
    ...object,
    blPendingOperation: object.objectId ? DBOperations.UPDATE : DBOperations.CREATE,
    blLocalId         : object.objectId || object.blLocalId || Utils.uuid()
  })

  await this.app.OfflineDBManager.upsertObject(this.className, objectToSave)
}

async function tryStoreLocally(object, offlineAwareCallback = {}) {
  try {
    await storeLocally.call(this, object)

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

    await this.app.OfflineDBManager.upsertObject(this.className, {
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
