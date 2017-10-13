import Backendless from './bundle'

let dataStoreCache = {}

let currentUser = null

const Private = {

  setDataToStore(key, value) {
    dataStoreCache[key] = value
  },

  getDataFromStore(key) {
    return dataStoreCache[key]
  },

  resetDataStore() {
    dataStoreCache = {}
  },

  setCurrentUser(user) {
    //TODO: move it to ./user/current-user.js
    currentUser = user || null
  },

  getCurrentUser() {
    //TODO: move it to ./user/current-user.js
    return currentUser
  }
}

export default Private
