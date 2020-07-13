function migrateLegacyStorageData(storage, legacyStorageName) {
  //TODO: this will be removed in the nearest release

  if (!localStorage.getItem(storage.storageName)) {
    const legacyStorageData = localStorage.getItem(legacyStorageName)

    if (legacyStorageData) {
      localStorage.setItem(storage.storageName, legacyStorageData)
      localStorage.removeItem(legacyStorageName)
    }
  }
}

export default class LocalStorage {

  constructor(storageName, legacyStorageName) {
    this.storageName = storageName

    migrateLegacyStorageData(this, legacyStorageName)
  }

  getStore() {
    try {
      return JSON.parse(localStorage.getItem(this.storageName)) || {}
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Could not parse data from LocalStorage', e)
    }

    return {}
  }

  setStore(data) {
    localStorage.setItem(this.storageName, JSON.stringify(data))
  }

  get(key) {
    return this.getStore()[key]
  }

  set(key, value) {
    const store = this.getStore()

    store[key] = value

    this.setStore(store)
  }

  remove(key) {
    const store = this.getStore()

    delete store[key]

    this.setStore(store)
  }
}
