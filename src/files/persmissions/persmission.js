import Utils from '../../utils'

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

export default class FilePermission {

  constructor(permission) {
    this.permission = permission
  }

  grantUser = Utils.promisified(grantUser)
  grantUserSync = Utils.synchronized(grantUser)

  grantRole = Utils.promisified(grantRole)
  grantRoleSync = Utils.synchronized(grantRole)

  grant = Utils.promisified(grant)
  grantSync = Utils.synchronized(grant)

  denyUser = Utils.promisified(denyUser)
  denyUserSync = Utils.synchronized(denyUser)

  denyRole = Utils.promisified(denyRole)
  denyRoleSync = Utils.synchronized(denyRole)

  deny = Utils.promisified(deny)
  denySync = Utils.synchronized(deny)

}
