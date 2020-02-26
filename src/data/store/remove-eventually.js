import { ActionTypes, callbackManager } from '../offline/callback-manager'
import { DBManager, idbConnection } from '../offline/database-manager'
import { isOnline } from '../offline/network'
import Operations from '../offline/operations'
import { remove as deleteFromRemoteDB } from './remove'

const updateObjectPendingOperation = (tableName, object) => {
  return idbConnection.update({
    in   : tableName,
    set  : {
      ...object,
      blLocalId         : object.objectId,
      blPendingOperation: Operations.DELETE
    },
    where: { blLocalId: object.objectId }
  })
}

async function tryRemoveFromLocal(object, offlineAwareCallback = {}) {
  try {
    if (object.objectId) {
      await updateObjectPendingOperation(this.className, object)
    } else {
      await DBManager.deleteLocalObject(this.className, object)
    }

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

export async function removeEventually(object, offlineAwareCallback = {}) {
  if (!isOnline()) {
    return tryRemoveFromLocal.apply(this, arguments)
  }

  const [onSuccess, onError] = callbackManager.getCallbacks(ActionTypes.DELETE, this.className)

  try {
    await deleteFromRemoteDB(object)
    await DBManager.deleteLocalObject(this.className, object)

    if (offlineAwareCallback.handleRemoteResponse) {
      offlineAwareCallback.handleRemoteResponse(object)
    } else {
      onSuccess(this.className, object)
    }

    return object
  } catch (error) {
    const errorMessage = error.message || error

    if (offlineAwareCallback.handleRemoteFault) {
      offlineAwareCallback.handleRemoteFault(errorMessage)
    } else {
      onError(errorMessage)
    }

    throw new Error(errorMessage)
  }
}