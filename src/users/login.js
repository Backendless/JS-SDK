import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'
import LocalCache from '../local-cache'
import { getLocalCurrentUser, setLocalCurrentUser } from './current-user'

import { parseResponse, getUserFromResponse, wrapAsync } from './utils'

export function login(login, password, stayLoggedIn, /** async */) {
  if (!login) {
    throw new Error('Login can not be empty')
  }

  if (!password) {
    throw new Error('Password can not be empty')
  }

  stayLoggedIn = stayLoggedIn === true

  LocalCache.remove('user-token')
  LocalCache.remove('current-user-id')
  LocalCache.set('stayLoggedIn', false)

  let responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  if (responder) {
    responder = wrapAsync(responder, stayLoggedIn)
  }

  const data = {
    login   : login,
    password: password
  }

  let result = Request.post({
    url         : Urls.userLogin(),
    isAsync     : isAsync,
    asyncHandler: responder,
    data        : data
  })

  if (!isAsync && result) {
    setLocalCurrentUser(parseResponse(result, stayLoggedIn))

    result = getUserFromResponse(getLocalCurrentUser())
  }

  return result
}
