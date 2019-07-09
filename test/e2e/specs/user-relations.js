import '../helpers/global'
import sandbox from '../helpers/sandbox'

const Backendless = sandbox.Backendless

describe('User - Relations', function() {
  let consoleApi
  let appId

  sandbox.forTest()

  const createRelationColumn = (tableName, columnName, toTableName, relationshipType) => {
    return consoleApi.tables.createColumn(appId, { name: tableName }, {
      dataType: 'DATA_REF',
      name    : columnName,
      toTableName,
      relationshipType
    })
  }

  beforeEach(function() {
    consoleApi = this.consoleApi
    appId = this.app.id
  })

  it('Circular Users relations', function() {
    const usersStore = Backendless.Data.of(Backendless.User)

    let user1 = { email: 'user1@com', password: '123456' }
    let user2 = { email: 'user2@com', password: '123456' }
    let user3 = { email: 'user3@com', password: '123456' }
    let user4 = { email: 'user4@com', password: '123456' }
    let user5 = { email: 'user5@com', password: '123456' }
    let user6 = { email: 'user6@com', password: '123456' }

    return Promise.resolve()
      .then(() => {
        return Promise.resolve()
          .then(() => usersStore.save(user1))
          .then(() => usersStore.save(user2))
          .then(() => usersStore.save(user3))
          .then(() => usersStore.save(user4))
          .then(() => usersStore.save(user5))
          .then(() => usersStore.save(user6))
          .then(() => usersStore.find(Backendless.DataQueryBuilder.create().setSortBy('created')))
      })
      .then(users => {
        user1 = users[0]
        user2 = users[1]
        user3 = users[2]
        user4 = users[3]
        user5 = users[4]
        user6 = users[5]
      })
      .then(() => {
        return Promise.all([
          createRelationColumn('Users', 'friends', 'Users', 'ONE_TO_MANY'),
          createRelationColumn('Users', 'blocked', 'Users', 'ONE_TO_MANY'),
        ])
      })
      .then(() => {
        return Promise.all([
          usersStore.addRelation(user1.objectId, 'friends', [user2, user3, user6]),
          usersStore.addRelation(user1.objectId, 'blocked', [user2, user3, user4, user5]),
        ])
      })
      .then(() => {
        const query = Backendless.DataQueryBuilder
          .create()
          .setWhereClause(`objectId = '${user1.objectId}'`)
          .setRelated(['friends', 'blocked'])
          .setSortBy('created')

        return Backendless.Data.of('Users').find(query)
      })
      .then(users => {
        expect(users[0].objectId).to.be.equal(user1.objectId)

        expect(users[0].friends.length).to.be.equal(3)
        expect(users[0].blocked.length).to.be.equal(4)

        const friendsUser2 = users[0].friends.find(o => o.objectId === user2.objectId)
        const friendsUser3 = users[0].friends.find(o => o.objectId === user3.objectId)
        const friendsUser6 = users[0].friends.find(o => o.objectId === user6.objectId)

        const blockedUser2 = users[0].blocked.find(o => o.objectId === user2.objectId)
        const blockedUser3 = users[0].blocked.find(o => o.objectId === user3.objectId)
        const blockedUser4 = users[0].blocked.find(o => o.objectId === user4.objectId)
        const blockedUser5 = users[0].blocked.find(o => o.objectId === user5.objectId)

        expect(friendsUser2.objectId).to.be.equal(user2.objectId)
        expect(friendsUser3.objectId).to.be.equal(user3.objectId)
        expect(friendsUser6.objectId).to.be.equal(user6.objectId)

        expect(blockedUser2.objectId).to.be.equal(user2.objectId)
        expect(blockedUser3.objectId).to.be.equal(user3.objectId)
        expect(blockedUser4.objectId).to.be.equal(user4.objectId)
        expect(blockedUser5.objectId).to.be.equal(user5.objectId)

        expect(friendsUser2).to.deep.equal(blockedUser2)
        expect(friendsUser3).to.deep.equal(blockedUser3)
      })
  })
})