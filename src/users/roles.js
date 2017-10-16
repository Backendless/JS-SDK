import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

import { parseResponse } from './utils'

function roleHelper(identity, rolename, asyncHandler, operation) {
  if (!identity) {
    throw new Error('User identity can not be empty')
  }

  if (!rolename) {
    throw new Error('Rolename can not be empty')
  }

  const responder = Utils.extractResponder(arguments)

  return Request.post({
    url         : Urls.userRoleOperation(operation),
    isAsync     : !!responder,
    asyncHandler: responder,
    data        : { user: identity, roleName: rolename }
  })
}

export function getUserRoles(/** async */) {
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  const result = Request.get({
    url         : Urls.userRoles(),
    isAsync     : isAsync,
    asyncHandler: responder
  })

  return isAsync ? result : parseResponse(result)
}

export const assignRole = (identity, rolename, asyncHandler) => {
  return roleHelper(identity, rolename, asyncHandler, 'assignRole')
}

export const unassignRole = (identity, rolename, asyncHandler) => {
  return roleHelper(identity, rolename, asyncHandler, 'unassignRole')
}
