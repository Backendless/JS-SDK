import Urls from '../../urls'
import Request from '../../request'

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

  return Request.put({
    url         : Urls.filePermission(type, path),
    data        : data,
    isAsync     : !!async,
    asyncHandler: async
  })
}
