export function sendRequest(type, object, options, asyncHandler) {
  const permission = this.permission
  const url = this.app.urls.dataObjectPermission(object.___class, type, object.objectId)

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

  return this.app.request.put({
    url,
    data,
    asyncHandler,
    isAsync: !!asyncHandler
  })
}
