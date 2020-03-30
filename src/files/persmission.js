const PermissionTypes = {
  GRANT: 'GRANT',
  DENY : 'DENY',
}

const namespaceLabel = 'Backendless.Files.Permissions.{READ|DELETE|WRITE}'

function backwardCompatibility(context, methodName, oldMethodName) {
  return function() {
    const mainMessage = `"${namespaceLabel}.${oldMethodName}" is deprecated and will be removed in the nearest release.`
    const helpMessage = `Please use "${namespaceLabel}.${methodName}" instead of.`

    // eslint-disable-next-line no-console
    console.warn(`${mainMessage}\n${helpMessage}`)

    return context[methodName].apply(context, arguments)
  }
}

export default class FilePermission {

  constructor(permission, app) {
    this.permission = permission
    this.app = app

    this.grantUser = backwardCompatibility(this, 'grantForUser', 'grantUser')
    this.denyUser = backwardCompatibility(this, 'denyForUser', 'denyUser')
    this.grantRole = backwardCompatibility(this, 'grantForRole', 'grantRole')
    this.denyRole = backwardCompatibility(this, 'denyForRole', 'denyRole')
    this.grant = backwardCompatibility(this, 'grantForAllUsers', 'grant')
    this.deny = backwardCompatibility(this, 'denyForAllUsers', 'deny')
  }

  grantForUser(userId, url, asyncHandler) {
    return this.sendRequest(PermissionTypes.GRANT, url, { userId }, asyncHandler)
  }

  denyForUser(userId, url, asyncHandler) {
    return this.sendRequest(PermissionTypes.DENY, url, { userId }, asyncHandler)
  }

  grantForRole(roleName, url, asyncHandler) {
    return this.sendRequest(PermissionTypes.GRANT, url, { roleName }, asyncHandler)
  }

  denyForRole(roleName, url, asyncHandler) {
    return this.sendRequest(PermissionTypes.DENY, url, { roleName }, asyncHandler)
  }

  grantForAllUsers(url, asyncHandler) {
    return this.sendRequest(PermissionTypes.GRANT, url, { userId: '*' }, asyncHandler)
  }

  denyForAllUsers(url, asyncHandler) {
    return this.sendRequest(PermissionTypes.DENY, url, { userId: '*' }, asyncHandler)
  }

  grantForAllRoles(url, asyncHandler) {
    return this.sendRequest(PermissionTypes.GRANT, url, { roleName: '*' }, asyncHandler)
  }

  denyForAllRoles(url, asyncHandler) {
    return this.sendRequest(PermissionTypes.DENY, url, { roleName: '*' }, asyncHandler)
  }

  sendRequest(type, path, options, asyncHandler) {
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
      asyncHandler: asyncHandler
    })
  }
}
