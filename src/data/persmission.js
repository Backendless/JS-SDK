const PermissionTypes = {
  GRANT: 'GRANT',
  DENY : 'DENY',
}

const namespaceLabel = 'Backendless.Data.Permissions.{FIND|REMOVE|UPDATE}'

function backwardCompatibility(context, methodName, oldMethodName) {
  return function() {
    const mainMessage = `"${namespaceLabel}.${oldMethodName}" is deprecated and will be removed in the nearest release.`
    const helpMessage = `Please use "${namespaceLabel}.${methodName}" instead of.`

    // eslint-disable-next-line no-console
    console.warn(`${mainMessage}\n${helpMessage}`)

    return context[methodName].apply(context, arguments)
  }
}

export default class DataPermission {

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

  grantForUser(userId, object, asyncHandler) {
    return this.sendRequest(PermissionTypes.GRANT, object, { userId }, asyncHandler)
  }

  denyForUser(userId, object, asyncHandler) {
    return this.sendRequest(PermissionTypes.DENY, object, { userId }, asyncHandler)
  }

  grantForRole(roleName, object, asyncHandler) {
    return this.sendRequest(PermissionTypes.GRANT, object, { roleName }, asyncHandler)
  }

  denyForRole(roleName, object, asyncHandler) {
    return this.sendRequest(PermissionTypes.DENY, object, { roleName }, asyncHandler)
  }

  grantForAllUsers(object, asyncHandler) {
    return this.sendRequest(PermissionTypes.GRANT, object, { userId: '*' }, asyncHandler)
  }

  denyForAllUsers(object, asyncHandler) {
    return this.sendRequest(PermissionTypes.DENY, object, { userId: '*' }, asyncHandler)
  }

  grantForAllRoles(object, asyncHandler) {
    return this.sendRequest(PermissionTypes.GRANT, object, { roleName: '*' }, asyncHandler)
  }

  denyForAllRoles(object, asyncHandler) {
    return this.sendRequest(PermissionTypes.DENY, object, { roleName: '*' }, asyncHandler)
  }

  sendRequest(type, object, options, asyncHandler) {
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
    })
  }
}
