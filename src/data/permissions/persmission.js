import Utils from '../../utils'
import { deprecated } from '../../decorators'

import { sendRequest } from './send-request'

const PermissionTypes = {
  GRANT: 'GRANT',
  DENY : 'DENY',
}

function grantForUser(userId, object, asyncHandler) {
  return sendRequest(this.permission, PermissionTypes.GRANT, object, { userId }, asyncHandler)
}

function denyForUser(userId, object, asyncHandler) {
  return sendRequest(this.permission, PermissionTypes.DENY, object, { userId }, asyncHandler)
}

function grantForRole(roleName, object, asyncHandler) {
  return sendRequest(this.permission, PermissionTypes.GRANT, object, { roleName }, asyncHandler)
}

function denyForRole(roleName, object, asyncHandler) {
  return sendRequest(this.permission, PermissionTypes.DENY, object, { roleName }, asyncHandler)
}

function grantForAllUsers(object, asyncHandler) {
  return sendRequest(this.permission, PermissionTypes.GRANT, object, { userId: '*' }, asyncHandler)
}

function denyForAllUsers(object, asyncHandler) {
  return sendRequest(this.permission, PermissionTypes.DENY, object, { userId: '*' }, asyncHandler)
}

function grantForAllRoles(object, asyncHandler) {
  return sendRequest(this.permission, PermissionTypes.GRANT, object, { roleName: '*' }, asyncHandler)
}

function denyForAllRoles(object, asyncHandler) {
  return sendRequest(this.permission, PermissionTypes.DENY, object, { roleName: '*' }, asyncHandler)
}

class DataPermission {

  constructor(permission) {
    this.permission = permission
  }

}

//TODO: will be removed when remove sync methods
const namespaceLabel = 'Backendless.Data.Permissions.{FIND|REMOVE|UPDATE}'

Object.assign(DataPermission.prototype, {

  @deprecated(namespaceLabel, `${namespaceLabel}.grantForUser`)
  grantUserSync: Utils.synchronized(grantForUser),

  @deprecated(namespaceLabel, `${namespaceLabel}.grantForUser`)
  grantUser: Utils.promisified(grantForUser),

  @deprecated(namespaceLabel, `${namespaceLabel}.denyForUser`)
  denyUserSync: Utils.synchronized(denyForUser),

  @deprecated(namespaceLabel, `${namespaceLabel}.denyForUser`)
  denyUser: Utils.promisified(denyForUser),

  @deprecated(namespaceLabel, `${namespaceLabel}.grantForRole`)
  grantRoleSync: Utils.synchronized(grantForRole),

  @deprecated(namespaceLabel, `${namespaceLabel}.grantForRole`)
  grantRole: Utils.promisified(grantForRole),

  @deprecated(namespaceLabel, `${namespaceLabel}.denyForRole`)
  denyRoleSync: Utils.synchronized(denyForRole),

  @deprecated(namespaceLabel, `${namespaceLabel}.denyForRole`)
  denyRole: Utils.promisified(denyForRole),

  @deprecated(namespaceLabel, `${namespaceLabel}.grantForAllUsers`)
  grantSync: Utils.synchronized(grantForAllUsers),

  @deprecated(namespaceLabel, `${namespaceLabel}.grantForAllUsers`)
  grant: Utils.promisified(grantForAllUsers),

  @deprecated(namespaceLabel, `${namespaceLabel}.denyForAllUsers`)
  denySync: Utils.synchronized(denyForAllUsers),

  @deprecated(namespaceLabel, `${namespaceLabel}.denyForAllUsers`)
  deny: Utils.promisified(denyForAllUsers),

  grantForUser: Utils.promisified(grantForUser),
  denyForUser : Utils.promisified(denyForUser),

  grantForRole: Utils.promisified(grantForRole),
  denyForRole : Utils.promisified(denyForRole),

  grantForAllUsers: Utils.promisified(grantForAllUsers),
  denyForAllUsers : Utils.promisified(denyForAllUsers),

  grantForAllRoles: Utils.promisified(grantForAllRoles),
  denyForAllRoles : Utils.promisified(denyForAllRoles),

})

export default DataPermission
