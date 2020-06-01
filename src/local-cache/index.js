import Utils from '../utils'
import Cache from './cache'
import LocalStorageCache from './local-storage-cache'

export default class LocalCache {
  constructor(...args) {
    const cache = Utils.isLocalStorageSupported
      ? new LocalStorageCache(...args)
      : new Cache(...args)

    cache.flushExpired()

    cache.Keys = {
      USER_TOKEN     : 'user-token',
      CURRENT_USER_ID: 'current-user-id',
      STAY_LOGGED_IN : 'stayLoggedIn',
    }

    return cache
  }
}
