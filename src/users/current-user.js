import Backendless from '../bundle'
import Utils from '../utils'
import User from './user'
import persistence from '../data'
import Private from '../private'
import Urls from '../urls'
import Request from '../request'

import { getUserFromResponse } from './utils'

export const getCurrentUser = async => {
  const currentUser = Private.getCurrentUser()

  if (currentUser) {
    const userFromResponse = getUserFromResponse(currentUser)

    return async ? async.success(userFromResponse) : userFromResponse
  }

  const stayLoggedIn = Backendless.LocalCache.get('stayLoggedIn')
  const currentUserId = stayLoggedIn && Backendless.LocalCache.get('current-user-id')

  if (currentUserId) {
    return persistence.of(User).findById(currentUserId, async)
  }

  return async ? async.success(null) : null
}

export function isValidLogin(/** async */) {
  const userToken = Backendless.LocalCache.get('user-token')
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  if (userToken) {
    if (!isAsync) {
      try {
        const result = Request.get({
          url: Urls.userTokenCheck(userToken)
        })
        return !!result
      } catch (e) {
        return false
      }
    }

    return Request.get({
      url         : Urls.userTokenCheck(userToken),
      isAsync     : isAsync,
      asyncHandler: responder
    })
  }

  if (!isAsync) {
    return !!getCurrentUser()
  }

  getCurrentUser(new Backendless.Async(user => responder.success(!!user), () => responder.success(false)))
}

export const loggedInUser = () => {
  return Backendless.LocalCache.get('current-user-id')
}