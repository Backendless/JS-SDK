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

describe('Transactions - Create-Bulk Operation', function() {

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

  it('creates lists of map-objects', async function() {
    const objects = [
      { name: `p-o-${Utils.uid()}` },
      { name: `p-o-${Utils.uid()}` },
      { name: `p-o-${Utils.uid()}` },
      { name: `p-o-${Utils.uid()}` },
      { name: `p-o-${Utils.uid()}` },
    ]

    uow.bulkCreate(PERSONS_TABLE_NAME, objects)

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(uowResult.results.create_bulkPerson1.operationType).to.equal('CREATE_BULK')
    expect(uowResult.results.create_bulkPerson1.result).to.be.an('array')
    expect(uowResult.results.create_bulkPerson1.result).to.have.length(5)

    const objectsMap = {}

    uowResult.results.create_bulkPerson1.result.forEach((objectId, index) => {
      objectsMap[objectId] = objects[index].name
    })

    const query = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause('name like \'p-o-%\'')

    const persons = await personsStore.find(query)

    expect(persons).to.have.length(5)

    persons.forEach(person => {
      expect(objectsMap[person.objectId]).to.equal(person.name)
    })
  })

  it('creates lists of instance-objects', async function() {
    const objects = [
      new Person({ name: `p-i-${Utils.uid()}` }),
      new Person({ name: `p-i-${Utils.uid()}` }),
      new Person({ name: `p-i-${Utils.uid()}` }),
      new Person({ name: `p-i-${Utils.uid()}` }),
      new Person({ name: `p-i-${Utils.uid()}` }),
    ]

    uow.bulkCreate(objects)

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(uowResult.results.create_bulkPerson1.operationType).to.equal('CREATE_BULK')
    expect(uowResult.results.create_bulkPerson1.result).to.be.an('array')
    expect(uowResult.results.create_bulkPerson1.result).to.have.length(5)

    const objectsMap = {}

    uowResult.results.create_bulkPerson1.result.forEach((objectId, index) => {
      objectsMap[objectId] = objects[index].name
    })

    const query = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause('name like \'p-i-%\'')

    const persons = await personsStore.find(query)

    expect(persons).to.have.length(5)

    persons.forEach(person => {
      expect(objectsMap[person.objectId]).to.equal(person.name)
    })
  })

  it('creates several lists of objects', async function() {
    const objects1 = [
      { name: `p-ll-1-${Utils.uid()}` },
      { name: `p-ll-1-${Utils.uid()}` },
      { name: `p-ll-1-${Utils.uid()}` },
      { name: `p-ll-1-${Utils.uid()}` },
      { name: `p-ll-1-${Utils.uid()}` },
    ]

    const objects2 = [
      { name: `p-ll-2-${Utils.uid()}` },
      { name: `p-ll-2-${Utils.uid()}` },
      { name: `p-ll-2-${Utils.uid()}` },
      { name: `p-ll-2-${Utils.uid()}` },
      { name: `p-ll-2-${Utils.uid()}` },
    ]

    const objects3 = [
      { name: `p-ll-3-${Utils.uid()}` },
      { name: `p-ll-3-${Utils.uid()}` },
      { name: `p-ll-3-${Utils.uid()}` },
      { name: `p-ll-3-${Utils.uid()}` },
      { name: `p-ll-3-${Utils.uid()}` },
    ]

    uow.bulkCreate(PERSONS_TABLE_NAME, objects1)
    uow.bulkCreate(PERSONS_TABLE_NAME, objects2)
    uow.bulkCreate(PERSONS_TABLE_NAME, objects3)

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(uowResult.results.create_bulkPerson1.operationType).to.equal('CREATE_BULK')
    expect(uowResult.results.create_bulkPerson1.result).to.be.an('array')
    expect(uowResult.results.create_bulkPerson1.result).to.have.length(5)
    expect(uowResult.results.create_bulkPerson2.operationType).to.equal('CREATE_BULK')
    expect(uowResult.results.create_bulkPerson2.result).to.be.an('array')
    expect(uowResult.results.create_bulkPerson2.result).to.have.length(5)
    expect(uowResult.results.create_bulkPerson3.operationType).to.equal('CREATE_BULK')
    expect(uowResult.results.create_bulkPerson3.result).to.be.an('array')
    expect(uowResult.results.create_bulkPerson3.result).to.have.length(5)

    const objectsMap = {}

    uowResult.results.create_bulkPerson1.result.forEach((objectId, index) => {
      objectsMap[objectId] = objects1[index].name
    })

    uowResult.results.create_bulkPerson2.result.forEach((objectId, index) => {
      objectsMap[objectId] = objects2[index].name
    })

    uowResult.results.create_bulkPerson3.result.forEach((objectId, index) => {
      objectsMap[objectId] = objects3[index].name
    })

    const query = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause('name like \'p-ll-%\'')
      .setPageSize(100)

    const persons = await personsStore.find(query)

    expect(persons).to.have.length(15)

    persons.forEach(person => {
      expect(objectsMap[person.objectId]).to.equal(person.name)
    })
  })

  it('creates many objects', async function() {
    const limit = 100

    const objects = []

    for (let i = 0; i < limit; i++) {
      objects.push({ name: `p-many-${Utils.uid()}` })
    }

    uow.bulkCreate(PERSONS_TABLE_NAME, objects)

    await uow.execute()

    const query = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause('name like \'p-many-%\'')

    const personsCount = await personsStore.getObjectCount(query)

    expect(personsCount).to.be.equal(limit)
  })

  describe('Fails', function() {

    it('creates more objects than allowed for a single operation', async function() {
      const limit = 200

      const objects = []

      for (let i = 0; i < limit; i++) {
        objects.push({ name: `p-over-${Utils.uid()}` })
      }

      uow.bulkCreate(PERSONS_TABLE_NAME, objects)

      const uowResult = await uow.execute()

      expect(uowResult.results).to.equal(null)
      expect(uowResult.success).to.equal(false)

      expect(uowResult.error.message).to.equal('Bulk create operation supports no more than 100 objects')
      expect(uowResult.error.operation.operationType).to.equal('CREATE_BULK')
      expect(uowResult.error.operation.table).to.equal(PERSONS_TABLE_NAME)
      expect(uowResult.error.operation.opResultId).to.equal('create_bulkPerson1')
      expect(uowResult.error.operation.payload).to.eql(objects)

      const query = Backendless.Data.QueryBuilder
        .create()
        .setWhereClause('name like \'p-over-%\'')

      const personsCount = await personsStore.getObjectCount(query)

      expect(personsCount).to.be.equal(0)
    })

    it('has many create-bulk operations and one with missed column', async function() {
      const objects1 = [
        { name: `p-m-1-${Utils.uid()}` },
        { name: `p-m-1-${Utils.uid()}` },
        { name: `p-m-1-${Utils.uid()}` },
        { name: `p-m-1-${Utils.uid()}` },
        { name: `p-m-1-${Utils.uid()}` },
      ]

      const objects2 = [
        { name: `p-m-2-${Utils.uid()}` },
        { name: `p-m-2-${Utils.uid()}` },
        { name: `p-m-2-${Utils.uid()}` },
        { name: `p-m-2-${Utils.uid()}` },
        { name: `p-m-2-${Utils.uid()}` },
      ]

      const objects3 = [
        { name: `p-m-3-${Utils.uid()}` },
        { name: `p-m-3-${Utils.uid()}` },
        { name: `p-m-3-${Utils.uid()}` },
        { name: `p-m-3-${Utils.uid()}` },
        { name: `p-m-3-${Utils.uid()}`, missedColumn: 'm' },
      ]

      uow.bulkCreate(PERSONS_TABLE_NAME, objects1)
      uow.bulkCreate(PERSONS_TABLE_NAME, objects2)
      uow.bulkCreate(PERSONS_TABLE_NAME, objects3)

      const uowResult = await uow.execute()

      expect(uowResult.results).to.equal(null)
      expect(uowResult.success).to.equal(false)

      expect(uowResult.error.message).to.equal(
        'Column \'missedColumn\' in table \'Person\' not exists. ' +
        'Transaction accepts only DML operations (Data Manipulation Language)'
      )

      expect(uowResult.error.operation.operationType).to.equal('CREATE_BULK')
      expect(uowResult.error.operation.table).to.equal(PERSONS_TABLE_NAME)
      expect(uowResult.error.operation.opResultId).to.equal('create_bulkPerson3')
      expect(uowResult.error.operation.payload).to.eql(objects3)

      const query = Backendless.Data.QueryBuilder
        .create()
        .setWhereClause('name like \'p-m-%\'')
        .setPageSize(100)

      const personsCount = await personsStore.getObjectCount(query)

      expect(personsCount).to.equal(0)
    })

  })

})
