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

describe('Transactions - Delete-Bulk Operation', function() {

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

  it('deletes objects by conditional', async function() {
    await personsStore.bulkCreate([
      { name: `p-w-${Utils.uid()}`, age: 10 },
      { name: `p-w-${Utils.uid()}`, age: 10 },
      { name: `p-w-${Utils.uid()}`, age: 10 },
      { name: `p-w-${Utils.uid()}`, age: 20 },
      { name: `p-w-${Utils.uid()}`, age: 20 },
    ])

    uow.bulkDelete(PERSONS_TABLE_NAME, 'name like \'p-w-%\' and age = 10')

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(uowResult.results.delete_bulkPerson1.type).to.equal('DELETE_BULK')
    expect(uowResult.results.delete_bulkPerson1.result).to.equal(3)

    const query = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause('name like \'p-w-%\'')

    const persons = await personsStore.find(query)

    expect(persons).to.have.length(2)

    persons.forEach(person => {
      expect(person.age).to.equal(20)
    })
  })

  it('deletes list of instances', async function() {
    const objectIds = await personsStore.bulkCreate([
      { name: `p-wc-${Utils.uid()}`, age: 10 },
      { name: `p-wc-${Utils.uid()}`, age: 10 },
      { name: `p-wc-${Utils.uid()}`, age: 10 },
      { name: `p-wc-${Utils.uid()}`, age: 20 },
      { name: `p-wc-${Utils.uid()}`, age: 20 },
    ])

    uow.bulkDelete([
      new Person({ objectId: objectIds[0] }),
      new Person({ objectId: objectIds[1] }),
      new Person({ objectId: objectIds[2] }),
    ])

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(uowResult.results.delete_bulkPerson1.type).to.equal('DELETE_BULK')
    expect(uowResult.results.delete_bulkPerson1.result).to.equal(3)

    const query = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause('name like \'p-wc-%\'')

    const persons = await personsStore.find(query)

    expect(persons).to.have.length(2)

    persons.forEach(person => {
      expect(person.age).to.equal(20)
    })
  })

  it('deletes list of objects', async function() {
    const objectIds = await personsStore.bulkCreate([
      { name: `p-lo-${Utils.uid()}`, age: 10 },
      { name: `p-lo-${Utils.uid()}`, age: 10 },
      { name: `p-lo-${Utils.uid()}`, age: 10 },
      { name: `p-lo-${Utils.uid()}`, age: 20 },
      { name: `p-lo-${Utils.uid()}`, age: 20 },
    ])

    uow.bulkDelete(PERSONS_TABLE_NAME, [
      { objectId: objectIds[0] },
      { objectId: objectIds[1] },
      { objectId: objectIds[2] },
    ])

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(uowResult.results.delete_bulkPerson1.type).to.equal('DELETE_BULK')
    expect(uowResult.results.delete_bulkPerson1.result).to.equal(3)

    const query = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause('name like \'p-lo-%\'')

    const persons = await personsStore.find(query)

    expect(persons).to.have.length(2)

    persons.forEach(person => {
      expect(person.age).to.equal(20)
    })
  })

  it('updates objects by objectIds', async function() {
    const objectIds = await personsStore.bulkCreate([
      { name: `p-wo-${Utils.uid()}`, age: 10 },
      { name: `p-wo-${Utils.uid()}`, age: 10 },
      { name: `p-wo-${Utils.uid()}`, age: 10 },
      { name: `p-wo-${Utils.uid()}`, age: 20 },
      { name: `p-wo-${Utils.uid()}`, age: 20 },
    ])

    uow.bulkDelete(PERSONS_TABLE_NAME, [objectIds[0], objectIds[1], objectIds[2]])

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(uowResult.results.delete_bulkPerson1.type).to.equal('DELETE_BULK')
    expect(uowResult.results.delete_bulkPerson1.result).to.equal(3)

    const query = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause('name like \'p-wo-%\'')

    const persons = await personsStore.find(query)

    expect(persons).to.have.length(2)

    persons.forEach(person => {
      expect(person.age).to.equal(20)
    })
  })

  it('deletes 800 objects', async function() {
    for (let i = 0; i < 8; i++) {
      const objects = []

      for (let j = 0; j < 100; j++) {
        objects.push({ name: `p-1000-${Utils.uid()}`, age: 10 })
      }

      uow.bulkCreate(PERSONS_TABLE_NAME, objects)
    }

    for (let i = 0; i < 2; i++) {
      const objects = []

      for (let j = 0; j < 100; j++) {
        objects.push({ name: `p-1000-${Utils.uid()}`, age: 20 })
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

    uow.bulkDelete(PERSONS_TABLE_NAME, 'name like \'p-1000-%\' and age = 10')

    await uow.execute()

    const query2 = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause('name like \'p-1000-%\'')

    const personsCount2 = await personsStore.getObjectCount(query2)

    expect(personsCount2).to.be.equal(200)
  })

  describe('Fails', function() {

  })
})
