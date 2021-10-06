import Utils from '../utils'

import VirtualStorage from './virtual-storage'
import LocalStorage from './local-storage'

const STORAGE_KEY_NAMESPACE = 'Backendless'

export default class LocalCache {
  constructor(app) {
    this.app = app

    this.storageName = `${STORAGE_KEY_NAMESPACE}_${this.app.appId}`

    const Storage = Utils.isLocalStorageSupported
      ? LocalStorage
      : VirtualStorage

    this.setStorage(Storage)

    this.Keys = {
      USER_TOKEN     : 'user-token',
      CURRENT_USER_ID: 'current-user-id',
      STAY_LOGGED_IN : 'stayLoggedIn',
    }
  }

  setStorage(Storage) {
    this.storage = new Storage(this.storageName, STORAGE_KEY_NAMESPACE)
  }

  set(key, value) {
    this.storage.set(key, value)
  }

  get(key) {
    return this.storage.get(key)
  }

  remove(key) {
    this.storage.remove(key)
  }

}

