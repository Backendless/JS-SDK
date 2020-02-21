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
    if (offlineAwareCallback.handleLocalFault) {
      offlineAwareCallback.handleLocalFault(error.message || error)
    }

    throw new Error(error.message || error)
  }
}

async function removeEventually(object, offlineAwareCallback = {}) {
  if (!isOnline()) {
    return tryRemoveFromLocal.apply(this, arguments)
  }

  const [onSuccess, onError] = callbackManager.getCallbacks(ActionTypes.DELETE, this.className)

  try {
    await Promise.all([
      DBManager.deleteLocalObject(this.className, object),
      deleteFromRemoteDB(object)
    ])

    if (offlineAwareCallback.handleRemoteResponse) {
      offlineAwareCallback.handleRemoteResponse(object)
    }

    onSuccess(this.className, object)

    return object
  } catch (error) {
    if (offlineAwareCallback.handleRemoteFault) {
      offlineAwareCallback.handleRemoteFault(error.message || error)
    }

    onError(error.message || error)

    throw new Error(error.message || error)
  }
}

export {
  removeEventually
}