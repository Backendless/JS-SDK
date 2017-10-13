import Backendless from '../bundle'
import Utils from '../utils'
import Private from '../private'
import Urls from '../urls'

import { parseResponse, getUserFromResponse, wrapAsync } from './utils'

export function login(login, password, stayLoggedIn, /** async */) {
  if (!login) {
    throw new Error('Login can not be empty')
  }

  if (!password) {
    throw new Error('Password can not be empty')
  }

  stayLoggedIn = stayLoggedIn === true

  Backendless.LocalCache.remove('user-token')
  Backendless.LocalCache.remove('current-user-id')
  Backendless.LocalCache.set('stayLoggedIn', false)

  let responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  if (responder) {
    responder = wrapAsync(responder, stayLoggedIn)
  }

  const data = {
    login   : login,
    password: password
  }

  let result = Backendless._ajax({
    method      : 'POST',
    url         : Urls.userLogin(),
    isAsync     : isAsync,
    asyncHandler: responder,
    data        : data
  })

  if (!isAsync && result) {
    Private.setCurrentUser(parseResponse(result, stayLoggedIn))
    result = getUserFromResponse(Private.getCurrentUser())
  }

  return result
}
