import Backendless from '../../bundle'
import Urls from '../../urls'

export function sendRequest(permission, type, path, options, async) {
  const { userId, roleName } = options

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
    url         : Urls.filePermission(type, path),
    data        : data,
    isAsync     : !!async,
    asyncHandler: async
  })
}
