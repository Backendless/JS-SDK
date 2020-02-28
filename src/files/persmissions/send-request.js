export function sendRequest(type, path, options, asyncHandler) {
  const { userId, roleName } = options
  const permission = this.permission

  const data = {
    permission
  }

  if (userId) {
    data.user = userId
  } else if (roleName) {
    data.role = roleName
  }

  return this.app.request.put({
    url         : this.app.urls.filePermission(type, path),
    data        : data,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
