import Utils from '../utils'
import LocalCache from '../local-cache'
import { getLocalCurrentUser, setLocalCurrentUser } from './current-user'

import { parseResponse, getUserFromResponse, wrapAsync } from './utils'

export function loginAsGuest(stayLoggedIn, /** async */) {
  stayLoggedIn = stayLoggedIn === true

  LocalCache.remove('user-token')
  LocalCache.remove('current-user-id')
  LocalCache.set('stayLoggedIn', false)

  let responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  if (responder) {
    responder = wrapAsync(responder, stayLoggedIn)
  }

  let result = this.app.request.post({
    url         : this.app.urls.guestLogin(),
    isAsync     : isAsync,
    asyncHandler: responder,
  })

  if (!isAsync && result) {
    setLocalCurrentUser(parseResponse(result, stayLoggedIn))

    result = getUserFromResponse(getLocalCurrentUser())
  }

  return result
}
