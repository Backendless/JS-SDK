import Utils from '../utils'

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
