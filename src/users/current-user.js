import Utils from '../utils'
import Async from '../request/async'

import { getUserFromResponse } from './utils'

export function setLocalCurrentUser(user) {
  this.currentUser = user || null

  this.backendless.RT.updateUserTokenIfNeeded()
}

export function getLocalCurrentUser() {
  return this.currentUser
}

export function getCurrentUserToken() {
  if (this.currentUser && this.currentUser['user-token']) {
    return this.currentUser['user-token'] || null
  }

  return this.backendless.LocalCache.get('user-token') || null
}

export function getCurrentUser(asyncHandler) {
  if (this.currentUser) {
    const userFromResponse = getUserFromResponse.call(this, this.currentUser)

    return asyncHandler ? asyncHandler.success(userFromResponse) : userFromResponse
  }

  if (this.currentUserRequest && asyncHandler) {
    this.currentUserRequest
      .then(result => asyncHandler.success(result))
      .catch(error => asyncHandler.fault(error))

    return this.currentUserRequest
  }

  const stayLoggedIn = this.backendless.LocalCache.get('stayLoggedIn')
  const currentUserId = stayLoggedIn && this.backendless.LocalCache.get('current-user-id')

  if (currentUserId) {
    const Data = this.backendless.Data
    const User = this.backendless.User

    return this.currentUserRequest = Data.of(User).findById(currentUserId)
      .then(result => {
        this.currentUserRequest = null

        this.currentUser = getUserFromResponse(result)

        return asyncHandler.success(currentUser)
      })
      .catch(error => {
        this.currentUserRequest = null

        asyncHandler.fault(error)

        throw error
      })
  }

  return asyncHandler
    ? asyncHandler.success(null)
    : null
}

export function isValidLogin(/** async */) {
  const userToken = this.getCurrentUserToken()
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  if (userToken) {
    if (!isAsync) {
      try {
        const result = this.backendless.request.get({
          url: this.backendless.urls.userTokenCheck(userToken)
        })
        return !!result
      } catch (e) {
        return false
      }
    }

    return this.backendless.request.get({
      url         : this.backendless.urls.userTokenCheck(userToken),
      isAsync     : isAsync,
      asyncHandler: responder
    })
  }

  if (!isAsync) {
    return !!this.getCurrentUser()
  }

  this.getCurrentUser(new Async(user => responder.success(!!user), () => responder.success(false)))
}

export function loggedInUser() {
  return this.backendless.LocalCache.get('current-user-id')
}