export default class UsersRoles {
  constructor(users) {
    this.users = users
    this.app = users.app
  }

  async getUserRoles() {
    return this.app.request.get({
      url: this.app.urls.userRoles(),
    })
  }

  async assignRole(identity, rolename) {
    return this.changeRole(identity, rolename, 'assignRole')
  }

  async unassignRole(identity, rolename) {
    return this.changeRole(identity, rolename, 'unassignRole')
  }

  async changeRole(identity, roleName, operation) {
    if (!identity || !(typeof identity === 'string' || typeof identity === 'number')) {
      throw new Error('User identity must be a string or number and can not be empty.')
    }

    if (!roleName || typeof roleName !== 'string') {
      throw new Error('Role Name must be a string and can not be empty.')
    }

    return this.app.request.post({
      url : this.app.urls.userRoleOperation(operation),
      data: {
        user: identity,
        roleName
      },
    })
  }

}
