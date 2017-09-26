import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

import { parseResponse } from './utils'

function roleHelper(identity, rolename, async, operation) {
  if (!identity) {
    throw new Error('User identity can not be empty')
  }

  if (!rolename) {
    throw new Error('Rolename can not be empty')
  }

  const responder = Utils.extractResponder(arguments)

  return Backendless._ajax({
    method      : 'POST',
    url         : Urls.userRoleOperation(operation),
    isAsync     : !!responder,
    asyncHandler: responder,
    data        : JSON.stringify({ user: identity, roleName: rolename })
  })
}

export function getUserRoles(/** async */) {
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  const result = Backendless._ajax({
    method      : 'GET',
    url         : Urls.userRoles(),
    isAsync     : isAsync,
    asyncHandler: responder
  })

  return isAsync ? result : parseResponse(result)
}

export const assignRole = (identity, rolename, async) => roleHelper(identity, rolename, async, 'assignRole')
export const unassignRole = (identity, rolename, async) => roleHelper(identity, rolename, async, 'unassignRole')
