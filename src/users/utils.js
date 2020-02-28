import Utils from '../utils'
import Async from '../request/async'

import User from './user'

export function parseResponse(data, stayLoggedIn) {
  const user = new User()

  Utils.deepExtend(user, data)

  if (stayLoggedIn) {
    this.app.LocalCache.set('stayLoggedIn', stayLoggedIn)
  }

  return user
}

export function getUserFromResponse(user) {
  this.app.LocalCache.set('current-user-id', user.objectId)

  const userToken = user['user-token']

  if (userToken && this.app.LocalCache.get('stayLoggedIn')) {
    this.app.LocalCache.set('user-token', userToken)
  }

  return new User(user)
}

export function wrapAsync(asyncHandler, stayLoggedIn) {
  const context = this

  const success = data => {
    context.setLocalCurrentUser(parseResponse.call(context, Utils.tryParseJSON(data), stayLoggedIn))

    asyncHandler.success(getUserFromResponse.call(context, context.getLocalCurrentUser()))
  }

  const error = data => {
    asyncHandler.fault(data)
  }

  return new Async(success, error)
}