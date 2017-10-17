import Urls from '../../urls'
import Request from '../../request'

export function sendRequest(permission, type, object, options, asyncHandler) {
  const { userId, roleName } = options

  if (!object.___class || !object.objectId) {
    throw new Error('"dataObject.___class" and "dataObject.objectId" need to be specified')
  }

  const data = {
    permission
  }

  if (userId) {
    data.user = userId
  } else if (roleName) {
    data.role = roleName
  }

  return Request.put({
    url         : Urls.dataObjectPermission(object.___class, type, object.objectId),
    data        : data,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
