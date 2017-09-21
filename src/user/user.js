export default class User {
  static get className() {
    return 'Users'
  }

  constructor(user) {
    user = user || {}

    Object.keys(user).map(userProp => {
      this[userProp] = user[userProp]
    })

    //TODO: must be moved
    this.___class = User.className
  }
}

//TODO: must be removed
User.prototype.___class = User.className



