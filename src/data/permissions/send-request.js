import Backendless from '../../bundle'
import Urls from '../../urls'

export function sendRequest(permission, type, object, options, async) {
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

  return Backendless._ajax({
    method      : 'PUT',
    url         : Urls.dataObjectPermission(object.___class, type, object.objectId),
    data        : data,
    isAsync     : !!async,
    asyncHandler: async
  })
}
