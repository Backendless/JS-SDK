import '../../helpers/global'
import sandbox from '../../helpers/sandbox'
import * as Utils from '../../helpers/utils'

const Backendless = sandbox.Backendless

const PERSONS_TABLE_NAME = 'Person'

class Person {
  constructor(data) {
    data = data || {}

    this.objectId = data.objectId
    this.name = data.name
  }
}

describe('Transactions - Create Operation', function() {

  let tablesAPI

  let personsStore

  let uow

  sandbox.forSuite()

  before(async function() {
    tablesAPI = this.tablesAPI

    await tablesAPI.createTable(PERSONS_TABLE_NAME)
    await tablesAPI.createColumn(PERSONS_TABLE_NAME, 'name', tablesAPI.DataTypes.STRING)

    personsStore = Backendless.Data.of(PERSONS_TABLE_NAME)
  })

  beforeEach(function() {
    uow = new Backendless.UnitOfWork()
  })

  it('creates one map-object', async function() {
    const obj = { name: `p-${Utils.uid()}` }

    uow.create(PERSONS_TABLE_NAME, obj)

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(uowResult.results.createPerson1.type).to.equal('CREATE')
    expect(uowResult.results.createPerson1.result.objectId).to.be.a('string')
    expect(uowResult.results.createPerson1.result.created).to.be.a('number')
    expect(uowResult.results.createPerson1.result.updated).to.equal(null)
    expect(uowResult.results.createPerson1.result.ownerId).to.equal(null)
    expect(uowResult.results.createPerson1.result.___class).to.equal(PERSONS_TABLE_NAME)
    expect(uowResult.results.createPerson1.result.name).to.equal(obj.name)

    const query = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause(`name='${obj.name}'`)

    const persons = await personsStore.find(query)

    expect(persons).to.have.length(1)
    expect(persons[0].name).to.equal(obj.name)
  })

  it('creates one instance-object', async function() {
    const obj = new Person({ name: `p-${Utils.uid()}` })

    uow.create(obj)

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(uowResult.results.createPerson1.type).to.equal('CREATE')
    expect(uowResult.results.createPerson1.result.objectId).to.be.a('string')
    expect(uowResult.results.createPerson1.result.created).to.be.a('number')
    expect(uowResult.results.createPerson1.result.updated).to.equal(null)
    expect(uowResult.results.createPerson1.result.ownerId).to.equal(null)
    expect(uowResult.results.createPerson1.result.___class).to.equal(PERSONS_TABLE_NAME)
    expect(uowResult.results.createPerson1.result.name).to.equal(obj.name)

    const query = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause(`name='${obj.name}'`)

    const persons = await personsStore.find(query)

    expect(persons).to.have.length(1)
    expect(persons[0].name).to.equal(obj.name)
  })

  it('creates several objects', async function() {
    const obj1 = { name: `p-${Utils.uid()}` }
    const obj2 = { name: `p-${Utils.uid()}` }
    const obj3 = { name: `p-${Utils.uid()}` }

    uow.create(PERSONS_TABLE_NAME, obj1)
    uow.create(PERSONS_TABLE_NAME, obj2)
    uow.create(PERSONS_TABLE_NAME, obj3)

    await uow.execute()

    const checkObject = async obj => {
      const query = Backendless.Data.QueryBuilder
        .create()
        .setWhereClause(`name='${obj.name}'`)

      const persons = await personsStore.find(query)

      expect(persons).to.have.length(1)
      expect(persons[0].name).to.equal(obj.name)
    }

    await Promise.all([
      checkObject(obj1),
      checkObject(obj2),
      checkObject(obj3),
    ])
  })

  it('creates 20 of objects', async function() {
    const limit = 20

    for (let i = 0; i < limit; i++) {
      uow.create(PERSONS_TABLE_NAME, { name: `p-many-${Utils.uid()}` })
    }

    await uow.execute()

    const query = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause('name like \'p-many-%\'')

    const personsCount = await personsStore.getObjectCount(query)

    expect(personsCount).to.be.equal(20)
  })

  describe('Fails', function() {

    it('has missed column', async function() {
      const obj = {
        name        : `p-${Utils.uid()}`,
        missedColumn: 'missedColumn'
      }

      uow.create(PERSONS_TABLE_NAME, obj)

      const uowResult = await uow.execute()

      expect(uowResult.results).to.equal(null)
      expect(uowResult.success).to.equal(false)
      expect(uowResult.error.operation.operationType).to.eql('CREATE')
      expect(uowResult.error.operation.table).to.eql('Person')
      expect(uowResult.error.operation.opResultId).to.eql('createPerson1')
      expect(uowResult.error.operation.payload).to.eql(obj)

      expect(uowResult.error.message).to.equal(
        'Column \'missedColumn\' in table \'Person\' not exists. ' +
        'Transaction accepts only DML operations (Data Manipulation Language)'
      )

      const query = Backendless.Data.QueryBuilder
        .create()
        .setWhereClause(`name='${obj.name}'`)

      const persons = await personsStore.find(query)

      expect(persons).to.have.length(0)
    })

    it('has 20 create operations and one with missed column', async function() {
      const limit = 20

      for (let i = 0; i < (limit - 1); i++) {
        uow.create(PERSONS_TABLE_NAME, { name: `p-many-one-missed-${Utils.uid()}` })
      }

      uow.create(PERSONS_TABLE_NAME, {
        name        : `p-many-one-missed-${Utils.uid()}`,
        missedColumn: 'missedColumn'
      })

      const uowResult = await uow.execute()

      const query = Backendless.Data.QueryBuilder
        .create()
        .setWhereClause('name like \'p-many-one-missed-%\'')

      const personsCount = await personsStore.getObjectCount(query)

      expect(personsCount).to.be.equal(0)

      expect(uowResult.results).to.equal(null)
      expect(uowResult.success).to.equal(false)
      expect(uowResult.error.operation.opResultId).to.equal(`createPerson${limit}`)
      expect(uowResult.error.message).to.equal(
        'Column \'missedColumn\' in table \'Person\' not exists. ' +
        'Transaction accepts only DML operations (Data Manipulation Language)'
      )
    })

  })

})
