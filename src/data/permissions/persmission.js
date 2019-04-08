import Utils from '../../utils'
import { deprecated } from '../../decorators'

import { sendRequest } from './send-request'

const PermissionTypes = {
  GRANT: 'GRANT',
  DENY : 'DENY',
}

function grantUser(userId, object, asyncHandler) {
  return this.sendRequest(PermissionTypes.GRANT, object, { userId }, asyncHandler)
}

function grantRole(roleName, object, asyncHandler) {
  return this.sendRequest(PermissionTypes.GRANT, object, { roleName }, asyncHandler)
}

function grant(object, asyncHandler) {
  return this.sendRequest(PermissionTypes.GRANT, object, { userId: '*' }, asyncHandler)
}

function denyUser(userId, object, asyncHandler) {
  return this.sendRequest(PermissionTypes.DENY, object, { userId }, asyncHandler)
}

function denyRole(roleName, object, asyncHandler) {
  return this.sendRequest(PermissionTypes.DENY, object, { roleName }, asyncHandler)
}

function deny(object, asyncHandler) {
  return this.sendRequest(PermissionTypes.DENY, object, { userId: '*' }, asyncHandler)
}

class DataPermission {

  constructor(permission, backendless) {
    this.permission = permission
    this.backendless = backendless
  }

}

//TODO: will be removed when remove sync methods
const namespaceLabel = 'Backendless.Data.Permissions.{FIND|REMOVE|UPDATE}'

Object.assign(DataPermission.prototype, {

  @deprecated(namespaceLabel, `${namespaceLabel}.grantUser`)
  grantUserSync: Utils.synchronized(grantUser),
  grantUser    : Utils.promisified(grantUser),

  @deprecated(namespaceLabel, `${namespaceLabel}.grantRole`)
  grantRoleSync: Utils.synchronized(grantRole),
  grantRole    : Utils.promisified(grantRole),

  @deprecated(namespaceLabel, `${namespaceLabel}.grant`)
  grantSync: Utils.synchronized(grant),
  grant    : Utils.promisified(grant),

  @deprecated(namespaceLabel, `${namespaceLabel}.denyUser`)
  denyUserSync: Utils.synchronized(denyUser),
  denyUser    : Utils.promisified(denyUser),

  @deprecated(namespaceLabel, `${namespaceLabel}.denyRole`)
  denyRoleSync: Utils.synchronized(denyRole),
  denyRole    : Utils.promisified(denyRole),

  @deprecated(namespaceLabel, `${namespaceLabel}.deny`)
  denySync: Utils.synchronized(deny),
  deny    : Utils.promisified(deny),

  sendRequest: sendRequest
})

export default DataPermission
