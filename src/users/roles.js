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
    if (!identity) {
      throw new Error('User identity can not be empty')
    }

    if (!roleName) {
      throw new Error('Role Name can not be empty')
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
