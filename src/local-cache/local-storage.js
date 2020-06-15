export default class LocalStorage {

  constructor(storageName) {
    this.storageName = storageName
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
