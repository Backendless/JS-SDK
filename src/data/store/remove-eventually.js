import { ActionTypes, callbackManager } from '../offline/callback-manager'
import { convertObject } from '../offline/database-manager/utils'
import { isOnline } from '../offline/network'
import { DBOperations } from '../offline/constants'
import { remove as deleteFromRemoteDB } from './remove'

function updateObjectPendingOperation(object) {
  return this.app.OfflineDBManager.connection.update({
    in   : this.className,
    set  : {
      ...convertObject(object),
      blLocalId         : object.objectId,
      blPendingOperation: DBOperations.DELETE
    },
    where: { blLocalId: object.objectId }
  })
}

async function tryRemoveFromLocal(object, offlineAwareCallback = {}) {
  try {
    if (object.objectId) {
      await updateObjectPendingOperation.call(this, object)
    } else {
      await this.app.OfflineDBManager.deleteLocalObject(this.className, object)
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
    await deleteFromRemoteDB.call(this, object)
    await this.app.OfflineDBManager.deleteLocalObject(this.className, object)

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
