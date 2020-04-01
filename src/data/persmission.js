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

  grantForUser(userId, object) {
    return this.sendRequest(PermissionTypes.GRANT, object, { userId })
  }

  denyForUser(userId, object) {
    return this.sendRequest(PermissionTypes.DENY, object, { userId })
  }

  grantForRole(roleName, object) {
    return this.sendRequest(PermissionTypes.GRANT, object, { roleName })
  }

  denyForRole(roleName, object) {
    return this.sendRequest(PermissionTypes.DENY, object, { roleName })
  }

  grantForAllUsers(object) {
    return this.sendRequest(PermissionTypes.GRANT, object, { userId: '*' })
  }

  denyForAllUsers(object) {
    return this.sendRequest(PermissionTypes.DENY, object, { userId: '*' })
  }

  grantForAllRoles(object) {
    return this.sendRequest(PermissionTypes.GRANT, object, { roleName: '*' })
  }

  denyForAllRoles(object) {
    return this.sendRequest(PermissionTypes.DENY, object, { roleName: '*' })
  }

  sendRequest(type, object, { userId, roleName }) {
    if (!object.___class || !object.objectId) {
      throw new Error('"dataObject.___class" and "dataObject.objectId" need to be specified')
    }

    const data = {
      permission: this.permission
    }

    if (userId) {
      data.user = userId
    } else if (roleName) {
      data.role = roleName
    }

    return this.app.request.put({
      url: this.app.urls.dataObjectPermission(object.___class, type, object.objectId),
      data,
    })
  }
}
