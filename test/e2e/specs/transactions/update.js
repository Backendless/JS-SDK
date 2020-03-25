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
    this.age = data.age
  }
}

describe('Transactions - Update Operation', function() {

  let tablesAPI

  let personsStore

  let savedObject1
  let savedObject2
  let savedObject3

  let uow

  sandbox.forSuite()

  before(async function() {
    tablesAPI = this.tablesAPI

    await tablesAPI.createTable(PERSONS_TABLE_NAME)
    await tablesAPI.createColumn(PERSONS_TABLE_NAME, 'name', tablesAPI.DataTypes.STRING)
    await tablesAPI.createColumn(PERSONS_TABLE_NAME, 'age', tablesAPI.DataTypes.INT)

    personsStore = Backendless.Data.of(PERSONS_TABLE_NAME)

    savedObject1 = await personsStore.save({ name: `p-${Utils.uid()}` })
    savedObject2 = await personsStore.save({ name: `p-${Utils.uid()}` })
    savedObject3 = await personsStore.save({ name: `p-${Utils.uid()}` })
  })

  beforeEach(function() {
    uow = new Backendless.UnitOfWork()
  })

  it('updates one map-object', async function() {
    const obj = { objectId: savedObject1.objectId, name: `p-${Utils.uid()}` }

    uow.update(PERSONS_TABLE_NAME, obj)

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(uowResult.results.updatePerson1.type).to.equal('UPDATE')
    expect(uowResult.results.updatePerson1.result.___class).to.equal(PERSONS_TABLE_NAME)
    expect(uowResult.results.updatePerson1.result.objectId).to.equal(savedObject1.objectId)
    expect(uowResult.results.updatePerson1.result.created).to.be.a('number')
    expect(uowResult.results.updatePerson1.result.updated).to.be.a('number')
    expect(uowResult.results.updatePerson1.result.name).to.equal(obj.name)
    expect(uowResult.results.updatePerson1.result.ownerId).to.equal(null)

    const query = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause(`name='${obj.name}'`)

    const persons = await personsStore.find(query)

    expect(persons).to.have.length(1)
    expect(persons[0].name).to.equal(obj.name)
  })

  it('updates one instance-object', async function() {
    const obj = new Person({ objectId: savedObject1.objectId, name: `p-${Utils.uid()}` })

    uow.update(obj)

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(uowResult.results.updatePerson1.type).to.equal('UPDATE')
    expect(uowResult.results.updatePerson1.result.___class).to.equal(PERSONS_TABLE_NAME)
    expect(uowResult.results.updatePerson1.result.objectId).to.equal(savedObject1.objectId)
    expect(uowResult.results.updatePerson1.result.created).to.be.a('number')
    expect(uowResult.results.updatePerson1.result.updated).to.be.a('number')
    expect(uowResult.results.updatePerson1.result.name).to.equal(obj.name)
    expect(uowResult.results.updatePerson1.result.ownerId).to.equal(null)

    const query = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause(`name='${obj.name}'`)

    const persons = await personsStore.find(query)

    expect(persons).to.have.length(1)
    expect(persons[0].name).to.equal(obj.name)
  })

  it('updates several objects', async function() {
    const obj1 = { objectId: savedObject1.objectId, name: `p-${Utils.uid()}` }
    const obj2 = { objectId: savedObject2.objectId, name: `p-${Utils.uid()}` }
    const obj3 = { objectId: savedObject3.objectId, name: `p-${Utils.uid()}` }

    uow.update(PERSONS_TABLE_NAME, obj1)
    uow.update(PERSONS_TABLE_NAME, obj2)
    uow.update(PERSONS_TABLE_NAME, obj3)

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

  it('updates 20 objects', async function() {
    const limit = 20

    for (let i = 0; i < limit; i++) {
      uow.create(PERSONS_TABLE_NAME, { name: `p-many-${Utils.uid()}` })
    }

    await uow.execute()

    const query = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause('name like \'p-many-%\'')
      .setPageSize(limit)

    const savedPerson = await personsStore.find(query)

    expect(savedPerson.length).to.be.equal(limit)

    uow = new Backendless.UnitOfWork()

    savedPerson.forEach(savedPerson => {
      uow.update(PERSONS_TABLE_NAME, { objectId: savedPerson.objectId, name: `p-many-new-${Utils.uid()}` })
    })

    const uowResult = await uow.execute()

    const query2 = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause('name like \'p-many-new-%\'')

    const personsCount = await personsStore.getObjectCount(query2)

    expect(personsCount).to.be.equal(limit)

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(Object.keys(uowResult.results).length).to.equal(limit)
  })

  it('creates object and updates using OpResult', async function() {
    const newPerson = new Person({ name: `p-${Utils.uid()}`, age: 777 })

    const createOperation = uow.create(newPerson)

    uow.update(createOperation, 'age', 123)

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(uowResult.results.createPerson1.type).to.equal('CREATE')
    expect(uowResult.results.createPerson1.result.___class).to.equal(PERSONS_TABLE_NAME)
    expect(uowResult.results.createPerson1.result.objectId).to.be.a('string')
    expect(uowResult.results.createPerson1.result.created).to.be.a('number')
    expect(uowResult.results.createPerson1.result.updated).to.equal(null)
    expect(uowResult.results.createPerson1.result.name).to.equal(newPerson.name)
    expect(uowResult.results.createPerson1.result.ownerId).to.equal(null)
    expect(uowResult.results.createPerson1.result.age).to.equal(777)

    expect(uowResult.results.updatePerson1.type).to.equal('UPDATE')
    expect(uowResult.results.updatePerson1.result.___class).to.equal(PERSONS_TABLE_NAME)
    expect(uowResult.results.updatePerson1.result.objectId).to.be.a('string')
    expect(uowResult.results.updatePerson1.result.created).to.be.a('number')
    expect(uowResult.results.updatePerson1.result.updated).to.be.a('number')
    expect(uowResult.results.updatePerson1.result.name).to.equal(newPerson.name)
    expect(uowResult.results.updatePerson1.result.ownerId).to.equal(null)
    expect(uowResult.results.updatePerson1.result.age).to.equal(123)

    expect(uowResult.results.updatePerson1.result.objectId).to.equal(uowResult.results.createPerson1.result.objectId)

    const query = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause(`name='${newPerson.name}'`)

    const persons = await personsStore.find(query)

    expect(persons).to.have.length(1)
    expect(persons[0].name).to.equal(newPerson.name)
    expect(persons[0].age).to.equal(123)
  })

  describe('Fails', function() {

    it('has missed column', async function() {
      const obj = {
        objectId    : savedObject1.objectId,
        name        : `p-${Utils.uid()}`,
        missedColumn: 'missedColumn'
      }

      uow.update(PERSONS_TABLE_NAME, obj)

      const uowResult = await uow.execute()

      expect(uowResult.results).to.equal(null)
      expect(uowResult.success).to.equal(false)
      expect(uowResult.error.operation.operationType).to.eql('UPDATE')
      expect(uowResult.error.operation.table).to.eql('Person')
      expect(uowResult.error.operation.opResultId).to.eql('updatePerson1')
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

    it('has several update operations and one with missed column', async function() {
      const obj1 = { objectId: savedObject1.objectId, name: `p-many-one-missed-${Utils.uid()}` }
      const obj2 = { objectId: savedObject2.objectId, name: `p-many-one-missed-${Utils.uid()}` }
      const obj3 = { objectId: savedObject3.objectId, name: `p-many-one-missed-${Utils.uid()}`, missedColumn: 'm' }

      uow.update(PERSONS_TABLE_NAME, obj1)
      uow.update(PERSONS_TABLE_NAME, obj2)
      uow.update(PERSONS_TABLE_NAME, obj3)

      const uowResult = await uow.execute()

      const query = Backendless.Data.QueryBuilder
        .create()
        .setWhereClause('name like \'p-many-one-missed-%\'')

      const personsCount = await personsStore.getObjectCount(query)

      expect(personsCount).to.be.equal(0)

      expect(uowResult.results).to.equal(null)
      expect(uowResult.success).to.equal(false)
      expect(uowResult.error.operation.opResultId).to.equal('updatePerson3')
      expect(uowResult.error.message).to.equal(
        'Column \'missedColumn\' in table \'Person\' not exists. ' +
        'Transaction accepts only DML operations (Data Manipulation Language)'
      )
    })

  })

})
