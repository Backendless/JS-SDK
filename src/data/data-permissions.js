import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

const Permissions = {
  FIND  : 'FIND',
  REMOVE: 'REMOVE',
  UPDATE: 'UPDATE',
}

const PermissionTypes = {
  GRANT: 'GRANT',
  DENY : 'DENY',
}

export default class DataPermissions {
  constructor() {
    this.FIND = new DataPermission(Permissions.FIND)
    this.REMOVE = new DataPermission(Permissions.REMOVE)
    this.UPDATE = new DataPermission(Permissions.UPDATE)
  }
}

class DataPermission {

  constructor(permission) {
    this.permission = permission
    // this.restUrl = Urls.data()
  }

  grantUser = Utils.promisified('_grantUser')
  grantUserSync = Utils.synchronized('_grantUser')

  _grantUser(userId, dataObject, async) {
    return this._sendRequest({
      userId        : userId,
      dataObject    : dataObject,
      responder     : async,
      permissionType: PermissionTypes.GRANT
    })
  }

  grantRole = Utils.promisified('_grantRole')
  grantRoleSync = Utils.synchronized('_grantRole')

  _grantRole(roleName, dataObject, async) {
    return this._sendRequest({
      roleName      : roleName,
      dataObject    : dataObject,
      responder     : async,
      permissionType: PermissionTypes.GRANT
    })
  }

  grant = Utils.promisified('_grant')
  grantSync = Utils.synchronized('_grant')

  _grant(dataObject, async) {
    return this._sendRequest({
      userId        : '*',
      dataObject    : dataObject,
      responder     : async,
      permissionType: PermissionTypes.GRANT
    })
  }

  denyUser = Utils.promisified('_denyUser')
  denyUserSync = Utils.synchronized('_denyUser')

  _denyUser(userId, dataObject, async) {
    return this._sendRequest({
      userId        : userId,
      dataObject    : dataObject,
      responder     : async,
      permissionType: PermissionTypes.DENY
    })
  }

  denyRole = Utils.promisified('_denyRole')
  denyRoleSync = Utils.synchronized('_denyRole')

  _denyRole(roleName, dataObject, async) {
    return this._sendRequest({
      roleName      : roleName,
      dataObject    : dataObject,
      responder     : async,
      permissionType: PermissionTypes.DENY
    })
  }

  deny = Utils.promisified('_deny')

  denySync = Utils.synchronized('_deny')

  _deny(dataObject, async) {
    return this._sendRequest({
      userId        : '*',
      dataObject    : dataObject,
      responder     : async,
      permissionType: PermissionTypes.DENY
    })
  }

  _sendRequest(options) {
    const dataObject = options.dataObject
    const userId = options.userId
    const roleName = options.roleName
    const responder = options.responder

    const isAsync = !!responder
    const data = {
      'permission': this.permission
    }

    if (!dataObject.___class || !dataObject.objectId) {
      throw new Error('"dataObject.___class" and "dataObject.objectId" need to be specified')
    }

    if (userId) {
      data.user = userId
    } else if (roleName) {
      data.role = roleName
    }

    return Backendless._ajax({
      method      : 'PUT',
      url         : Urls.dataObjectPermission(dataObject.___class, options.permissionType, dataObject.objectId),
      data        : data,
      isAsync     : isAsync,
      asyncHandler: responder
    })
  }
}
