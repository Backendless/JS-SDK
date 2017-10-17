import Utils from '../../utils'
import Urls from '../../urls'
import Request from '../../request'

export function bulkCreate(objectsArray, asyncHandler) {
  const MSG_ERROR = (
    'Invalid value for the "objectsArray" argument. ' +
    'The argument must contain only array of objects.'
  )

  if (!Utils.isArray(objectsArray)) {
    throw new Error(MSG_ERROR)
  }

  objectsArray.forEach(obj => {
    if (!Utils.isObject(obj)) {
      throw new Error(MSG_ERROR)
    }
  })

  return Request.post({
    url         : Urls.dataBulkTable(this.className),
    data        : objectsArray,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}

export function bulkUpdate(templateObject, where, asyncHandler) {
  if (!templateObject || !Utils.isObject(templateObject)) {
    throw new Error('Invalid templateObject argument. The first argument must contain object')
  }

  if (!where || !Utils.isString(where)) {
    throw new Error('Invalid whereClause argument. The first argument must contain "whereClause" string.')
  }

  return Request.put({
    url         : Urls.dataBulkTable(this.className),
    query       : { where },
    data        : templateObject,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}

export function bulkDelete(objectsArray, asyncHandler) {
  const MSG_ERROR = (
    'Invalid bulkDelete argument. ' +
    'The first argument must contain array of objects or array of id or "whereClause" string'
  )

  if (!Utils.isArray(objectsArray) && !Utils.isString(objectsArray)) {
    throw new Error(MSG_ERROR)
  }

  let where

  if (Utils.isString(objectsArray)) {
    where = objectsArray

  } else if (Utils.isArray(objectsArray)) {

    const objects = objectsArray.map(obj => {
      if (!Utils.isObject(obj) && !Utils.isString(obj)) {
        throw new Error(MSG_ERROR)
      }

      return `'${Utils.isString(obj) ? obj : obj.objectId}'`
    })

    where = `objectId in (${objects.join(',')})`
  }

  return Request.delete({
    url         : Urls.dataBulkTable(this.className),
    query       : { where },
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
