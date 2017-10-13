import Utils from '../../utils'

import { sendRequest } from './send-request'

const PermissionTypes = {
  GRANT: 'GRANT',
  DENY : 'DENY',
}

function grantUser(userId, object, async) {
  return sendRequest(this.permission, PermissionTypes.GRANT, object, { userId }, async)
}

function grantRole(roleName, object, async) {
  return sendRequest(this.permission, PermissionTypes.GRANT, object, { roleName }, async)
}

function grant(object, async) {
  return sendRequest(this.permission, PermissionTypes.GRANT, object, { userId: '*' }, async)
}

function denyUser(userId, object, async) {
  return sendRequest(this.permission, PermissionTypes.DENY, object, { userId }, async)
}

function denyRole(roleName, object, async) {
  return sendRequest(this.permission, PermissionTypes.DENY, object, { roleName }, async)
}

function deny(object, async) {
  return sendRequest(this.permission, PermissionTypes.DENY, object, { userId: '*' }, async)
}

class DataPermission {

  constructor(permission) {
    this.permission = permission
  }

}

Object.setPrototypeOf(DataPermission.prototype, {

  grantUser    : Utils.promisified(grantUser),
  grantUserSync: Utils.synchronized(grantUser),

  grantRole    : Utils.promisified(grantRole),
  grantRoleSync: Utils.synchronized(grantRole),

  grant    : Utils.promisified(grant),
  grantSync: Utils.synchronized(grant),

  denyUser    : Utils.promisified(denyUser),
  denyUserSync: Utils.synchronized(denyUser),

  denyRole    : Utils.promisified(denyRole),
  denyRoleSync: Utils.synchronized(denyRole),

  deny    : Utils.promisified(deny),
  denySync: Utils.synchronized(deny),

})

export default DataPermission
