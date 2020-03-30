import Utils from '../utils'

const PermissionTypes = {
  GRANT: 'GRANT',
  DENY : 'DENY',
}

const namespaceLabel = 'Backendless.Files.Permissions.{READ|DELETE|WRITE}'

function backwardCompatibility(context, methodName, oldMethodName) {
  return () => {
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

    Utils.enableAsyncHandlers(this, [
      'grantForUser',
      'denyForUser',
      'grantForRole',
      'denyForRole',
      'grantForAllUsers',
      'denyForAllUsers',
      'grantUser',
      'denyUser',
      'grantRole',
      'denyRole',
      'grant',
      'deny',
    ])
  }

  grantForUser(userId, url) {
    return this.sendRequest(PermissionTypes.GRANT, url, { userId })
  }

  denyForUser(userId, url) {
    return this.sendRequest(PermissionTypes.DENY, url, { userId })
  }

  grantForRole(roleName, url) {
    return this.sendRequest(PermissionTypes.GRANT, url, { roleName })
  }

  denyForRole(roleName, url) {
    return this.sendRequest(PermissionTypes.DENY, url, { roleName })
  }

  grantForAllUsers(url) {
    return this.sendRequest(PermissionTypes.GRANT, url, { userId: '*' })
  }

  denyForAllUsers(url) {
    return this.sendRequest(PermissionTypes.DENY, url, { userId: '*' })
  }

  grantForAllRoles(url) {
    return this.sendRequest(PermissionTypes.GRANT, url, { roleName: '*' })
  }

  denyForAllRoles(url) {
    return this.sendRequest(PermissionTypes.DENY, url, { roleName: '*' })
  }

  sendRequest(type, path, { userId, roleName }) {

    const data = {
      permission: this.permission
    }

    if (userId) {
      data.user = userId
    } else if (roleName) {
      data.role = roleName
    }

    return this.app.request.put({
      url : this.app.urls.filePermission(type, path),
      data: data,
    })
  }
}
