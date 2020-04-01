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

describe('Transactions - Update-Bulk Operation', function() {

  let tablesAPI

  let personsStore

  let uow

  sandbox.forSuite()

  before(async function() {
    tablesAPI = this.tablesAPI

    await tablesAPI.createTable(PERSONS_TABLE_NAME)
    await tablesAPI.createColumn(PERSONS_TABLE_NAME, 'name', tablesAPI.DataTypes.STRING)
    await tablesAPI.createColumn(PERSONS_TABLE_NAME, 'age', tablesAPI.DataTypes.INT)

    personsStore = Backendless.Data.of(PERSONS_TABLE_NAME)
  })

  beforeEach(function() {
    uow = new Backendless.UnitOfWork()
  })

  it('updates objects by conditional', async function() {
    await personsStore.bulkCreate([
      { name: `p-w-${Utils.uid()}`, age: 10 },
      { name: `p-w-${Utils.uid()}`, age: 10 },
      { name: `p-w-${Utils.uid()}`, age: 10 },
      { name: `p-w-${Utils.uid()}`, age: 20 },
      { name: `p-w-${Utils.uid()}`, age: 20 },
    ])

    uow.bulkUpdate(PERSONS_TABLE_NAME, 'name like \'p-w-%\' and age = 10', { age: 30 })

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(uowResult.results.update_bulkPerson1.operationType).to.equal('UPDATE_BULK')
    expect(uowResult.results.update_bulkPerson1.result).to.equal(3)

    const query = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause('name like \'p-w-%\'')
      .setSortBy('age')

    const persons = await personsStore.find(query)

    expect(persons).to.have.length(5)

    expect(persons[0].age).to.equal(20)
    expect(persons[1].age).to.equal(20)
    expect(persons[2].age).to.equal(30)
    expect(persons[3].age).to.equal(30)
    expect(persons[4].age).to.equal(30)
  })

  it('updates objects by conditional and Class', async function() {
    await personsStore.bulkCreate([
      { name: `p-wc-${Utils.uid()}`, age: 10 },
      { name: `p-wc-${Utils.uid()}`, age: 10 },
      { name: `p-wc-${Utils.uid()}`, age: 10 },
      { name: `p-wc-${Utils.uid()}`, age: 20 },
      { name: `p-wc-${Utils.uid()}`, age: 20 },
    ])

    uow.bulkUpdate('name like \'p-wc-%\' and age = 10', new Person({ age: 30 }))

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(uowResult.results.update_bulkPerson1.operationType).to.equal('UPDATE_BULK')
    expect(uowResult.results.update_bulkPerson1.result).to.equal(3)

    const query = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause('name like \'p-wc-%\'')
      .setSortBy('age')

    const persons = await personsStore.find(query)

    expect(persons).to.have.length(5)

    expect(persons[0].age).to.equal(20)
    expect(persons[1].age).to.equal(20)
    expect(persons[2].age).to.equal(30)
    expect(persons[3].age).to.equal(30)
    expect(persons[4].age).to.equal(30)
  })

  it('updates objects by objectIds', async function() {
    const objectIds = await personsStore.bulkCreate([
      { name: `p-wo-${Utils.uid()}`, age: 11 },
      { name: `p-wo-${Utils.uid()}`, age: 12 },
      { name: `p-wo-${Utils.uid()}`, age: 13 },
      { name: `p-wo-${Utils.uid()}`, age: 14 },
      { name: `p-wo-${Utils.uid()}`, age: 15 },
    ])

    uow.bulkUpdate(PERSONS_TABLE_NAME, objectIds, { age: 123 })

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(uowResult.results.update_bulkPerson1.operationType).to.equal('UPDATE_BULK')
    expect(uowResult.results.update_bulkPerson1.result).to.equal(5)

    const query = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause('name like \'p-wo-%\'')

    const persons = await personsStore.find(query)

    expect(persons).to.have.length(5)

    persons.forEach(person => {
      expect(person.age).to.equal(123)
    })
  })

  it('updates 1000 objects', async function() {
    for (let i = 0; i < 10; i++) {
      const objects = []

      for (let j = 0; j < 100; j++) {
        objects.push({ name: `p-1000-${Utils.uid()}`, age: 1 })
      }

      uow.bulkCreate(PERSONS_TABLE_NAME, objects)
    }

    await uow.execute()

    const query = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause('name like \'p-1000-%\'')

    const personsCount = await personsStore.getObjectCount(query)

    expect(personsCount).to.be.equal(1000)

    uow = new Backendless.UnitOfWork()

    uow.bulkUpdate(PERSONS_TABLE_NAME, 'name like \'p-1000-%\'', { age: 123 })

    await uow.execute()

    const query2 = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause('age=123 and name like \'p-1000-%\'')

    const personsCount2 = await personsStore.getObjectCount(query2)

    expect(personsCount2).to.be.equal(1000)
  })

  describe('Fails', function() {
    it('has missed column while update with conditional', async function() {
      await personsStore.bulkCreate([
        { name: `p-wm-${Utils.uid()}`, age: 11 },
        { name: `p-wm-${Utils.uid()}`, age: 12 },
        { name: `p-wm-${Utils.uid()}`, age: 13 },
        { name: `p-wm-${Utils.uid()}`, age: 14 },
        { name: `p-wm-${Utils.uid()}`, age: 15 },
      ])

      const changes = { age: 123, missedColumn: 'm' }
      const conditional = 'name like \'p-wm-%\''

      uow.bulkUpdate(PERSONS_TABLE_NAME, conditional, changes)

      const uowResult = await uow.execute()

      expect(uowResult.results).to.equal(null)
      expect(uowResult.success).to.equal(false)

      expect(uowResult.error.operation.operationType).to.equal('UPDATE_BULK')
      expect(uowResult.error.operation.table).to.equal('Person')
      expect(uowResult.error.operation.opResultId).to.equal('update_bulkPerson1')
      expect(uowResult.error.operation.payload).to.eql({ changes, conditional })

      expect(uowResult.error.message).to.equal(
        'Column \'missedColumn\' in table \'Person\' not exists. ' +
        'Transaction accepts only DML operations (Data Manipulation Language)'
      )

      const query = Backendless.Data.QueryBuilder
        .create()
        .setWhereClause(conditional)

      const persons = await personsStore.find(query)

      expect(persons).to.have.length(5)

      persons.forEach(person => {
        expect(person.age).to.not.equal(123)
      })
    })
  })
})
