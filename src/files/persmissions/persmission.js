import Utils from '../../utils'
import { deprecated } from '../../decorators'

import { sendRequest } from './send-request'

const PermissionTypes = {
  GRANT: 'GRANT',
  DENY : 'DENY',
}

function grantUser(userId, url, async) {
  return sendRequest(this.permission, PermissionTypes.GRANT, url, { userId }, async)
}

function grantRole(roleName, url, async) {
  return sendRequest(this.permission, PermissionTypes.GRANT, url, { roleName }, async)
}

function grant(url, async) {
  return sendRequest(this.permission, PermissionTypes.GRANT, url, { userId: '*' }, async)
}

function denyUser(userId, url, async) {
  return sendRequest(this.permission, PermissionTypes.DENY, url, { userId }, async)
}

function denyRole(roleName, url, async) {
  return sendRequest(this.permission, PermissionTypes.DENY, url, { roleName }, async)
}

function deny(url, async) {
  return sendRequest(this.permission, PermissionTypes.DENY, url, { userId: '*' }, async)
}


//TODO: will be removed when remove sync methods
const namespaceLabel = 'Backendless.Files.Permissions.{READ|DELETE|WRITE}'

export default class FilePermission {

  constructor(permission) {
    this.permission = permission
  }

  @deprecated(namespaceLabel, `${namespaceLabel}.grantUser`)
  grantUserSync = Utils.synchronized(grantUser)
  grantUser = Utils.promisified(grantUser)

  @deprecated(namespaceLabel, `${namespaceLabel}.grantRole`)
  grantRoleSync = Utils.synchronized(grantRole)
  grantRole = Utils.promisified(grantRole)

  @deprecated(namespaceLabel, `${namespaceLabel}.grant`)
  grantSync = Utils.synchronized(grant)
  grant = Utils.promisified(grant)

  @deprecated(namespaceLabel, `${namespaceLabel}.denyUser`)
  denyUserSync = Utils.synchronized(denyUser)
  denyUser = Utils.promisified(denyUser)

  @deprecated(namespaceLabel, `${namespaceLabel}.denyRole`)
  denyRoleSync = Utils.synchronized(denyRole)
  denyRole = Utils.promisified(denyRole)

  @deprecated(namespaceLabel, `${namespaceLabel}.deny`)
  denySync = Utils.synchronized(deny)
  deny = Utils.promisified(deny)

}
