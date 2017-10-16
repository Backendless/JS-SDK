import Utils from '../utils'
import Async from '../request/async'
import LocalCache from '../local-cache'

import User from './user'
import { getLocalCurrentUser, setLocalCurrentUser } from './current-user'

export const parseResponse = (data, stayLoggedIn) => {
  const user = new User()
  Utils.deepExtend(user, data)

  if (stayLoggedIn) {
    LocalCache.set('stayLoggedIn', stayLoggedIn)
  }

  return user
}

export const getUserFromResponse = user => {
  LocalCache.set('current-user-id', user.objectId)

  const userToken = user['user-token']

  if (userToken && LocalCache.get('stayLoggedIn')) {
    LocalCache.set('user-token', userToken)
  }

  return new User(user)
}

export const wrapAsync = (asyncHandler, stayLoggedIn) => {
  const success = data => {
    setLocalCurrentUser(parseResponse(Utils.tryParseJSON(data), stayLoggedIn))

    asyncHandler.success(getUserFromResponse(getLocalCurrentUser()))
  }

  const error = data => {
    asyncHandler.fault(data)
  }

  return new Async(success, error)
}
