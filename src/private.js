let UIState = null

let dataStoreCache = {}

let currentUser = null

const Private = {

  setUIState: uiState => {
    UIState = uiState
  },

  getUIState: () => {
    return UIState
  },

  setDataToStore: (key, value) => {
    dataStoreCache[key] = value
  },

  getDataFromStore: key => {
    return dataStoreCache[key]
  },

  resetDataStore: () => {
    dataStoreCache = {}
  },

  setCurrentUser: user => {
    currentUser = user
  },

  getCurrentUser: () => {
    return currentUser
  },
}

export default Private
