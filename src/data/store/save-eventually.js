import Utils from '../../utils'
import { ActionTypes, callbackManager } from '../offline/callback-manager'
import { DBManager } from '../offline/database-manager'
import objectRefsMap from '../offline/database-manager/objects-ref-map'
import { isOnline } from '../offline/network'
import Operations from '../offline/operations'
import { save as saveToRemoteDB } from './save'

const storeLocally = async (tableName, object) => {
  const blLocalId = objectRefsMap.get(object)

  const objectToSave = {
    ...object,
    blPendingOperation: object.objectId ? Operations.UPDATE : Operations.CREATE
  }

  objectToSave.blLocalId = object.objectId || blLocalId || Utils.uuid()

  await DBManager.upsertObject(tableName, objectToSave)

  if (!blLocalId) {
    objectRefsMap.put(object, objectToSave.blLocalId)
  }
}

async function tryStoreLocally(object, offlineAwareCallback = {}) {
  try {
    await storeLocally(this.className, object)

    if (offlineAwareCallback.handleLocalResponse) {
      offlineAwareCallback.handleLocalResponse(object)
    }

    return object
  } catch (error) {
    if (offlineAwareCallback.handleLocalFault) {
      offlineAwareCallback.handleLocalFault(error)
    }

    throw new Error(error)
  }
}

async function saveEventually(object, offlineAwareCallback = {}) {
  if (!isOnline()) {
    return tryStoreLocally.apply(this, arguments)
  }

  const [onSave, onError] = callbackManager.getCallbacks(ActionTypes.SAVE, this.className)

  try {
    const savedObject = await saveToRemoteDB.call(this, object)

    await DBManager.upsertObject(this.className, {
      ...savedObject,
      blLocalId         : savedObject.objectId,
      blPendingOperation: null
    })

    if (offlineAwareCallback.handleRemoteResponse) {
      offlineAwareCallback.handleRemoteResponse(savedObject)
    }

    onSave(this.className, savedObject)

    return savedObject
  } catch (error) {
    if (offlineAwareCallback.handleRemoteFault) {
      offlineAwareCallback.handleRemoteFault(error)
    }

    onError(this.className, error)

    throw new Error(error)
  }
}

export {
  saveEventually
}