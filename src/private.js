import Backendless from './bundle'

let dataStoreCache = {}

let currentUser = null

const Private = {

  setDataToStore: function(key, value) {
    dataStoreCache[key] = value
  },

  getDataFromStore: function(key) {
    return dataStoreCache[key]
  },

  resetDataStore: function() {
    dataStoreCache = {}
  },

  setCurrentUser: function(user) {
    //TODO: move it to ./user/current-user.js
    currentUser = user || null
  },

  getCurrentUser: function() {
    //TODO: move it to ./user/current-user.js
    return currentUser
  }
}

export default Private
