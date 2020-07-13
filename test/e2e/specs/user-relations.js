import sandbox, { Utils } from '../helpers/sandbox'

const Backendless = sandbox.Backendless

describe('User - Relations', function() {
  let testCaseMarker

  const USERS_TABLE = 'Users'

  let usersStore

  sandbox.forSuite()

  before(async function() {
    usersStore = Backendless.Data.of(Backendless.User)

    await this.tablesAPI.createRelationColumn(USERS_TABLE, 'friends', USERS_TABLE, this.tablesAPI.RelationTypes.ONE_TO_MANY)
    await this.tablesAPI.createRelationColumn(USERS_TABLE, 'blocked', USERS_TABLE, this.tablesAPI.RelationTypes.ONE_TO_MANY)
  })

  beforeEach(async function() {
    testCaseMarker = Utils.uidShort()
  })

  it('Circular Users relations', async () => {
    const [user1Id, user2Id, user3Id, user4Id, user5Id, user6Id] = await usersStore.bulkCreate([
      { email: `user-${testCaseMarker}-1@bar.com`, password: '123456' },
      { email: `user-${testCaseMarker}-2@bar.com`, password: '123456' },
      { email: `user-${testCaseMarker}-3@bar.com`, password: '123456' },
      { email: `user-${testCaseMarker}-4@bar.com`, password: '123456' },
      { email: `user-${testCaseMarker}-5@bar.com`, password: '123456' },
      { email: `user-${testCaseMarker}-6@bar.com`, password: '123456' },
    ])

    await Promise.all([
      usersStore.addRelation(user1Id, 'friends', [user2Id, user3Id, user6Id]),
      usersStore.addRelation(user1Id, 'blocked', [user2Id, user3Id, user4Id, user5Id]),
    ])

    const query = Backendless.DataQueryBuilder
      .create()
      .setWhereClause(`objectId = '${user1Id}'`)
      .setRelated(['friends', 'blocked'])
      .setSortBy('created')

    const users = await usersStore.find(query)

    expect(users[0].objectId).to.be.equal(user1Id)

    expect(users[0].friends.length).to.be.equal(3)
    expect(users[0].blocked.length).to.be.equal(4)

    const friendsUser2 = users[0].friends.find(o => o.objectId === user2Id)
    const friendsUser3 = users[0].friends.find(o => o.objectId === user3Id)
    const friendsUser6 = users[0].friends.find(o => o.objectId === user6Id)

    const blockedUser2 = users[0].blocked.find(o => o.objectId === user2Id)
    const blockedUser3 = users[0].blocked.find(o => o.objectId === user3Id)
    const blockedUser4 = users[0].blocked.find(o => o.objectId === user4Id)
    const blockedUser5 = users[0].blocked.find(o => o.objectId === user5Id)

    expect(friendsUser2.objectId).to.be.equal(user2Id)
    expect(friendsUser3.objectId).to.be.equal(user3Id)
    expect(friendsUser6.objectId).to.be.equal(user6Id)

    expect(blockedUser2.objectId).to.be.equal(user2Id)
    expect(blockedUser3.objectId).to.be.equal(user3Id)
    expect(blockedUser4.objectId).to.be.equal(user4Id)
    expect(blockedUser5.objectId).to.be.equal(user5Id)

    expect(friendsUser2).to.deep.equal(blockedUser2)
    expect(friendsUser3).to.deep.equal(blockedUser3)
  })
})
