import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'
import Async from '../request/async'
import LocalCache from '../local-cache'
import { updateRTUserTokenIfNeeded } from '../rt'

import { getUserFromResponse } from './utils'

let currentUser = null
let currentUserRequest = null

export function setLocalCurrentUser(user) {
  currentUser = user || null

  updateRTUserTokenIfNeeded()
}

export function getLocalCurrentUser() {
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

  if (currentUserRequest && asyncHandler) {
    currentUserRequest
      .then(result => asyncHandler.success(result))
      .catch(error => asyncHandler.fault(error))

    return currentUserRequest
  }

  const stayLoggedIn = LocalCache.get('stayLoggedIn')
  const currentUserId = stayLoggedIn && LocalCache.get('current-user-id')

  if (currentUserId) {
    const { default: Data } = require('../data')
    const { default: User } = require('./user')

    return currentUserRequest = Data.of(User).findById(currentUserId)
      .then(result => {
        currentUserRequest = null

        currentUser = getUserFromResponse(result)

        return asyncHandler.success(currentUser)
      })
      .catch(error => {
        currentUserRequest = null

        asyncHandler.fault(error)

        throw error
      })
  }

  return asyncHandler ? asyncHandler.success(null) : null
}

export function isValidLogin(/** async */) {
  const userToken = getCurrentUserToken()
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
