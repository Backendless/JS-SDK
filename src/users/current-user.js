import Utils from '../utils'
import User from './user'
import Data from '../data'
import Urls from '../urls'
import Request from '../request'
import Async from '../request/async'
import LocalCache from '../local-cache'

import { getUserFromResponse } from './utils'

let currentUser = null

export function setLocalCurrentUser(user){
  currentUser = user || null
}

export function getLocalCurrentUser(){
  return currentUser
}

export function getCurrentUserToken() {
  if (currentUser && currentUser['user-token']) {
    return currentUser['user-token'] || null
  }

  return LocalCache.get('user-token') || null
}

export const getCurrentUser = asyncHandler => {
  if (currentUser) {
    const userFromResponse = getUserFromResponse(currentUser)

    return asyncHandler ? asyncHandler.success(userFromResponse) : userFromResponse
  }

  const stayLoggedIn = LocalCache.get('stayLoggedIn')
  const currentUserId = stayLoggedIn && LocalCache.get('current-user-id')

  if (currentUserId) {
    return Data.of(User).findById(currentUserId, asyncHandler)
  }

  return asyncHandler ? asyncHandler.success(null) : null
}

export function isValidLogin(/** async */) {
  const userToken = LocalCache.get('user-token')
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

  getCurrentUser(new Async(user => responder.success(!!user), () => responder.success(false)))
}

export const loggedInUser = () => {
  return LocalCache.get('current-user-id')
}