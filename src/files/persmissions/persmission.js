import Utils from '../../utils'
import { deprecated } from '../../decorators'

import { sendRequest } from './send-request'

const PermissionTypes = {
  GRANT: 'GRANT',
  DENY : 'DENY',
}

function grantUser(userId, url, asyncHandler) {
  return sendRequest(this.permission, PermissionTypes.GRANT, url, { userId }, asyncHandler)
}

function grantRole(roleName, url, asyncHandler) {
  return sendRequest(this.permission, PermissionTypes.GRANT, url, { roleName }, asyncHandler)
}

function grant(url, asyncHandler) {
  return sendRequest(this.permission, PermissionTypes.GRANT, url, { userId: '*' }, asyncHandler)
}

function denyUser(userId, url, asyncHandler) {
  return sendRequest(this.permission, PermissionTypes.DENY, url, { userId }, asyncHandler)
}

function denyRole(roleName, url, asyncHandler) {
  return sendRequest(this.permission, PermissionTypes.DENY, url, { roleName }, asyncHandler)
}

function deny(url, asyncHandler) {
  return sendRequest(this.permission, PermissionTypes.DENY, url, { userId: '*' }, asyncHandler)
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
