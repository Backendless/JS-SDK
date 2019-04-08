import Utils from '../utils'
import { parseResponse, getUserFromResponse, wrapAsync } from './utils'

export function login(login, password, stayLoggedIn, /** async */) {
  if (!login) {
    throw new Error('Login can not be empty')
  }

  if (!password) {
    throw new Error('Password can not be empty')
  }

  stayLoggedIn = stayLoggedIn === true

  this.backendless.LocalCache.remove('user-token')
  this.backendless.LocalCache.remove('current-user-id')
  this.backendless.LocalCache.set('stayLoggedIn', false)

  let responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  if (responder) {
    responder = wrapAsync.call(this, responder, stayLoggedIn)
  }

  const data = {
    login   : login,
    password: password
  }

  let result = this.backendless.request.post({
    url         : this.backendless.urls.userLogin(),
    isAsync     : isAsync,
    asyncHandler: responder,
    data        : data
  })

  if (!isAsync && result) {
    this.setLocalCurrentUser(parseResponse.call(this, result, stayLoggedIn))

    result = getUserFromResponse.call(this, this.getLocalCurrentUser())
  }

  return result
}
