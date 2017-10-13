let UIState = null

let currentUser = null

const Private = {

  setUIState: uiState => {
    UIState = uiState
  },

  getUIState: () => {
    return UIState
  },

  setCurrentUser: user => {
    //TODO: move it to ./user/current-user.js
    currentUser = user || null
  },

  getCurrentUser: () => {
    //TODO: move it to ./user/current-user.js
    return currentUser
  },
}

export default Private
