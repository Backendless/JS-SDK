import Utils from '../utils'

import { parseResponse, getUserFromResponse, wrapAsync } from './utils'

export function loginAsGuest(stayLoggedIn, /** async */) {
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
    url         : this.app.urls.guestLogin(),
    isAsync     : isAsync,
    asyncHandler: responder,
  })

  if (!isAsync && result) {
    this.setLocalCurrentUser(parseResponse(result, stayLoggedIn))

    result = getUserFromResponse.call(this, this.getLocalCurrentUser())
  }

  return result
}
