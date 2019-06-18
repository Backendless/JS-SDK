import Utils from '../../utils'
import { deprecated } from '../../decorators'

import { sendRequest } from './send-request'

const PermissionTypes = {
  GRANT: 'GRANT',
  DENY : 'DENY',
}

function grantForUser(userId, url, asyncHandler) {
  return sendRequest(this.permission, PermissionTypes.GRANT, url, { userId }, asyncHandler)
}

function denyForUser(userId, url, asyncHandler) {
  return sendRequest(this.permission, PermissionTypes.DENY, url, { userId }, asyncHandler)
}

function grantForRole(roleName, url, asyncHandler) {
  return sendRequest(this.permission, PermissionTypes.GRANT, url, { roleName }, asyncHandler)
}

function denyForRole(roleName, url, asyncHandler) {
  return sendRequest(this.permission, PermissionTypes.DENY, url, { roleName }, asyncHandler)
}

function grantForAllUsers(url, asyncHandler) {
  return sendRequest(this.permission, PermissionTypes.GRANT, url, { userId: '*' }, asyncHandler)
}

function denyForAllUsers(url, asyncHandler) {
  return sendRequest(this.permission, PermissionTypes.DENY, url, { userId: '*' }, asyncHandler)
}

function grantForAllRoles(url, asyncHandler) {
  return sendRequest(this.permission, PermissionTypes.GRANT, url, { roleName: '*' }, asyncHandler)
}

function denyForAllRoles(url, asyncHandler) {
  return sendRequest(this.permission, PermissionTypes.DENY, url, { roleName: '*' }, asyncHandler)
}

//TODO: will be removed when remove sync methods
const namespaceLabel = 'Backendless.Files.Permissions.{READ|DELETE|WRITE}'

export default class FilePermission {

  constructor(permission) {
    this.permission = permission
  }

  @deprecated(namespaceLabel, `${namespaceLabel}.grantForUser`)
  grantUserSync = Utils.synchronized(grantForUser)

  @deprecated(namespaceLabel, `${namespaceLabel}.grantForUser`)
  grantUser = Utils.promisified(grantForUser)

  @deprecated(namespaceLabel, `${namespaceLabel}.denyForUser`)
  denyUserSync = Utils.synchronized(denyForUser)

  @deprecated(namespaceLabel, `${namespaceLabel}.denyForUser`)
  denyUser = Utils.promisified(denyForUser)

  @deprecated(namespaceLabel, `${namespaceLabel}.grantForRole`)
  grantRoleSync = Utils.synchronized(grantForRole)

  @deprecated(namespaceLabel, `${namespaceLabel}.grantForRole`)
  grantRole = Utils.promisified(grantForRole)

  @deprecated(namespaceLabel, `${namespaceLabel}.denyForRole`)
  denyRoleSync = Utils.synchronized(denyForRole)

  @deprecated(namespaceLabel, `${namespaceLabel}.denyForRole`)
  denyRole = Utils.promisified(denyForRole)

  @deprecated(namespaceLabel, `${namespaceLabel}.grantForAllUsers`)
  grantSync = Utils.synchronized(grantForAllUsers)

  @deprecated(namespaceLabel, `${namespaceLabel}.grantForAllUsers`)
  grant = Utils.promisified(grantForAllUsers)

  @deprecated(namespaceLabel, `${namespaceLabel}.denyForAllUsers`)
  denySync = Utils.synchronized(denyForAllUsers)

  @deprecated(namespaceLabel, `${namespaceLabel}.denyForAllUsers`)
  deny = Utils.promisified(denyForAllUsers)

  grantForUser = Utils.promisified(grantForUser)
  denyForUser = Utils.promisified(denyForUser)

  grantForRole = Utils.promisified(grantForRole)
  denyForRole = Utils.promisified(denyForRole)

  grantForAllUsers = Utils.promisified(grantForAllUsers)
  denyForAllUsers = Utils.promisified(denyForAllUsers)

  grantForAllRoles = Utils.promisified(grantForAllRoles)
  denyForAllRoles = Utils.promisified(denyForAllRoles)

}
