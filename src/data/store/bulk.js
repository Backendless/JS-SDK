import Utils from '../../utils'
import Urls from '../../urls'
import Request from '../../request'
import Async from '../../request/async'

export function bulkCreate(objects, asyncHandler) {
  const MSG_ERROR = (
    'Invalid bulkCreate argument. ' +
    'The first argument must contain only array of objects.'
  )

  if (!Utils.isArray(objects)) {
    throw new Error(MSG_ERROR)
  }

  objects.forEach(obj => {
    if (!Utils.isObject(obj) || Array.isArray(obj)) {
      throw new Error(MSG_ERROR)
    }
  })

  return Request.post({
    url         : Urls.dataBulkTable(this.className),
    data        : objects,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}

export function bulkUpdate(where, changes, asyncHandler) {
  if (!where || !Utils.isString(where)) {
    throw new Error('Invalid bulkUpdate argument. The first argument must be "whereClause" string.')
  }

  if (!Utils.isObject(changes) || Array.isArray(changes) || (changes instanceof Async)) {
    throw new Error('Invalid bulkUpdate argument. The second argument must be object.')
  }

  return Request.put({
    url         : Urls.dataBulkTable(this.className),
    query       : { where },
    data        : changes,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}

export function bulkDelete(where, asyncHandler) {
  if (!Utils.isArray(where) && !Utils.isString(where)) {
    throw new Error(
      'Invalid bulkDelete argument. ' +
      'The first argument must contain array of objects or array of id or "whereClause" string.'
    )
  }

  const queryData = {
    where: Utils.isString(where) ? where : objectsToWhereClause(where)
  }

  return Request.post({
    url         : Urls.dataBulkTableDelete(this.className),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler,
    data        : queryData
  })
}

function objectsToWhereClause(objects) {
  const objectIds = objects.map(obj => {
    if (!obj || (!Utils.isString(obj) && !obj.objectId)) {
      throw new Error(
        'Can not transform "objects" to "whereClause". ' +
        'Item must be a string or an object with property "objectId" as string.'
      )
    }

    return `'${Utils.isString(obj) ? obj : obj.objectId}'`
  })

  return `objectId in (${objectIds.join(',')})`
}