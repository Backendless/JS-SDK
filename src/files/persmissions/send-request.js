export function sendRequest(permission, type, path, options, asyncHandler) {
  const { userId, roleName } = options

  const data = {
    permission
  }

  if (userId) {
    data.user = userId
  } else if (roleName) {
    data.role = roleName
  }

  return this.backendless.request.put({
    url         : this.backendless.urls.filePermission(type, path),
    data        : data,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
