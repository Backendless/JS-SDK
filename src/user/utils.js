import Backendless from '../bundle'
import Utils from '../utils'
import Async from '../request/async'
import Private from '../private'

export const parseResponse = (data, stayLoggedIn) => {
  const user = new Backendless.User()
  Utils.deepExtend(user, data)

  if (stayLoggedIn) {
    Backendless.LocalCache.set('stayLoggedIn', stayLoggedIn)
  }

  return user
}

export const getUserFromResponse = user => {
  Backendless.LocalCache.set('current-user-id', user.objectId)

  const userToken = user['user-token']

  if (userToken && Backendless.LocalCache.get('stayLoggedIn')) {
    Backendless.LocalCache.set('user-token', userToken)
  }

  return new Backendless.User(user)
}

export const wrapAsync = (async, stayLoggedIn) => {
  const success = data => {
    Private.setCurrentUser(parseResponse(Utils.tryParseJSON(data), stayLoggedIn))

    async.success(getUserFromResponse(Private.getCurrentUser()))
  }

  const error = data => {
    async.fault(data)
  }

  return new Async(success, error)
}
