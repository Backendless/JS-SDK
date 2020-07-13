const PermissionTypes = {
  GRANT: 'GRANT',
  DENY : 'DENY',
}

export default class Permission {

  static BACKWARD_COMPATIBILITY_LABEL = null

  constructor(permission, app) {
    this.permission = permission
    this.app = app

    this.grantUser = this.backwardCompatibility('grantForUser', 'grantUser')
    this.denyUser = this.backwardCompatibility('denyForUser', 'denyUser')
    this.grantRole = this.backwardCompatibility('grantForRole', 'grantRole')
    this.denyRole = this.backwardCompatibility('denyForRole', 'denyRole')
    this.grant = this.backwardCompatibility('grantForAllUsers', 'grant')
    this.deny = this.backwardCompatibility('denyForAllUsers', 'deny')
  }

  backwardCompatibility(methodName, oldMethodName) {
    //TODO: this method will be removed

    const context = this
    const bcLabel = this.constructor.BACKWARD_COMPATIBILITY_LABEL

    return function () {
      const mainMessage = `"${bcLabel}.${oldMethodName}" is deprecated and will be removed in the nearest release.`
      const helpMessage = `Please use "${bcLabel}.${methodName}" instead of.`

      // eslint-disable-next-line no-console
      console.warn(`${mainMessage}\n${helpMessage}`)

      return context[methodName].apply(context, arguments)
    }
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

  sendRequest(type, entity, { userId, roleName }) {
    const data = {
      permission: this.permission
    }

    if (userId) {
      data.user = userId
    } else if (roleName) {
      data.role = roleName
    }

    return this.app.request.put({
      url: this.getRequestURL(type, entity),
      data,
    })
  }

  /**
   * @abstract
   **/
  getRequestURL(/** type, entity **/) {
  }
}
