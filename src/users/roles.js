import DataQueryBuilder from '../data/data-query-builder'

export default class UsersRoles {
  constructor(users) {
    this.users = users
    this.app = users.app
  }

  async findByRole(roleName, loadRoles, query) {
    if (!roleName || typeof roleName !== 'string') {
      throw new Error('Role Name must be a string and can not be empty')
    }

    if (loadRoles !== null && loadRoles !== undefined && typeof loadRoles !== 'boolean') {
      throw new Error('The second argument "loadRoles" can be a boolean only')
    }

    if (query !== null && query !== undefined && (Array.isArray(query) || typeof query !== 'object')) {
      throw new Error('The third argument "query" can be an instance of DataQueryBuilder or a plain object only')
    }

    const queryStringTokens = []

    if (typeof loadRoles === 'boolean') {
      queryStringTokens.push(`loadRoles=${loadRoles}`)
    }

    if (query) {
      queryStringTokens.push(DataQueryBuilder.toQueryString(query))
    }

    return this.app.request
      .get({
        url        : this.app.urls.usersRole(roleName),
        queryString: queryStringTokens.join('&')
      })
      .then(result => this.users.dataStore.parseResponse(result))
  }

  async getUserRoles(userId) {
    return this.app.request.get({
      url: this.app.urls.userRoles(userId),
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
