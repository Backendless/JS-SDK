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

  for (let i = 0; i < objectsArray.length; i++) {
    if (!Utils.isObject(objectsArray[i])) {
      throw new Error(MSG_ERROR)
    }
  }

  return Request.post({
    url         : Urls.dataBulkTable(this.className),
    data        : objectsArray,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}

export function bulkUpdate(templateObject, whereClause, asyncHandler) {
  if (!templateObject || !Utils.isObject(templateObject)) {
    throw new Error('Invalid templateObject argument. The first argument must contain object')
  }

  if (!whereClause || !Utils.isString(whereClause)) {
    throw new Error('Invalid whereClause argument. The first argument must contain "whereClause" string.')
  }

  return Request.put({
    url         : Urls.dataBulkTable(this.className) + '?' + Utils.toQueryParams({ where: whereClause }),
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

  if (!objectsArray || (!Utils.isArray(objectsArray) && !Utils.isString(objectsArray))) {
    throw new Error(MSG_ERROR)
  }

  for (let i = 0; i < objectsArray.length; i++) {
    if (!Utils.isObject(objectsArray[i]) && !Utils.isString(objectsArray[i])) {
      throw new Error(MSG_ERROR)
    }
  }

  let whereClause

  if (Utils.isString(objectsArray)) {
    whereClause = objectsArray
  } else if (Utils.isArray(objectsArray)) {
    const objects = objectsArray.map(obj => Utils.isString(obj) ? obj : obj.objectId)

    whereClause = 'objectId in (\'' + objects.join('\', \'') + '\')'
  }

  return Request.delete({
    url         : Urls.dataBulkTable(this.className) + '?' + Utils.toQueryParams({ where: whereClause }),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
