
let currentUser = null

const Private = {

  setCurrentUser: user => {
    //TODO: move it to ./user/current-user.js
    currentUser = user || null
  },

  getCurrentUser() {
    //TODO: move it to ./user/current-user.js
    return currentUser
  }
}

export default Private
