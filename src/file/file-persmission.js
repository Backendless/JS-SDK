import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

export default class FilePermissions {
  constructor() {
    this.READ = new FilePermission('READ')
    this.DELETE = new FilePermission('DELETE')
    this.WRITE = new FilePermission('WRITE')
  }
}

class FilePermission {
  constructor(permission) {
    this.permission = permission
    // this.restUrl = Urls.filePermissions()
  }

  grantUser = Utils.promisified('_grantUser')

  grantUserSync = Utils.synchronized('_grantUser')

  _grantUser(userId, url, async) {
    return this._sendRequest({
      varType  : 'user',
      id       : userId,
      url      : url,
      state    : 'GRANT',
      responder: async
    })
  }

  grantRole = Utils.promisified('_grantRole')
  grantRoleSync = Utils.synchronized('_grantRole')

  _grantRole(roleName, url, async) {
    return this._sendRequest({
      varType  : 'role',
      id       : roleName,
      url      : url,
      state    : 'GRANT',
      responder: async
    })
  }

  grant = Utils.promisified('_grant')

  grantSync = Utils.synchronized('_grant')

  _grant(url, async) {
    return this._sendRequest({
      varType  : 'user',
      url      : url,
      state    : 'GRANT',
      responder: async
    })
  }

  denyUser = Utils.promisified('_denyUser')

  denyUserSync = Utils.synchronized('_denyUser')

  _denyUser(userId, url, async) {
    return this._sendRequest({
      varType  : 'user',
      id       : userId,
      url      : url,
      state    : 'DENY',
      responder: async
    })
  }

  denyRole = Utils.promisified('_denyRole')
  denyRoleSync = Utils.synchronized('_denyRole')

  _denyRole(roleName, url, async) {
    return this._sendRequest({
      varType  : 'role',
      id       : roleName,
      url      : url,
      state    : 'DENY',
      responder: async
    })
  }

  deny = Utils.promisified('_deny')

  denySync = Utils.synchronized('_deny')

  _deny(url, async) {
    return this._sendRequest({
      varType  : 'user',
      url      : url,
      state    : 'DENY',
      responder: async
    })
  }

  _sendRequest(options) {
    const type = options.state
    const url = options.url
    const responder = options.responder
    const isAsync = !!responder
    const data = {
      'permission': this.permission
    }

    if (options.varType) {
      data[options.varType] = options.id || '*'
    }

    return Backendless._ajax({
      method      : 'PUT',
      url         : Urls.filePermission(type, url),
      data        : JSON.stringify(data),
      isAsync     : isAsync,
      asyncHandler: responder
    })
  }
}
