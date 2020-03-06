import Utils from '../utils'
import Async from '../request/async'

import { parseResponse, getUserFromResponse, wrapAsync } from './utils'

export function login(login, password, stayLoggedIn, /** async */) {
  const data = {}

  if (typeof login === 'string' && arguments.length === 2 && password instanceof Async) {
    data.objectId = login

  } else {
    if (!login) {
      throw new Error('Login can not be empty')
    }

    if (!password) {
      throw new Error('Password can not be empty')
    }

    data.login = login
    data.password = password
  }

  stayLoggedIn = stayLoggedIn === true

  this.app.LocalCache.remove('user-token')
  this.app.LocalCache.remove('current-user-id')
  this.app.LocalCache.set('stayLoggedIn', false)

  let responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  if (responder) {
    responder = wrapAsync.call(this, responder, stayLoggedIn)
  }

  let result = this.app.request.post({
    url         : this.app.urls.userLogin(),
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
