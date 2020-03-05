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

describe('Transactions - Operation Result', function() {

  let tablesAPI

  let personsStore

  let uow

  sandbox.forSuite()

  before(async function() {
    tablesAPI = this.tablesAPI

    await Promise.all([
      tablesAPI.createTable(PERSONS_TABLE_NAME),
    ])

    await Promise.all([
      tablesAPI.createColumn(PERSONS_TABLE_NAME, 'tag', tablesAPI.DataTypes.STRING),
      tablesAPI.createColumn(PERSONS_TABLE_NAME, 'name', tablesAPI.DataTypes.STRING),
      tablesAPI.createColumn(PERSONS_TABLE_NAME, 'age', tablesAPI.DataTypes.INT),
    ])

    personsStore = Backendless.Data.of(Person)
  })

  beforeEach(function() {
    uow = new Backendless.UnitOfWork()
  })

  describe('Result Assigning', function() {

    it('"create" operation', async function() {
      const operation = uow.create(PERSONS_TABLE_NAME, { tag: 'r-a', name: 'Bob-1', age: 12 })

      await uow.execute()

      expect(operation.result.tag).to.equal('r-a')
      expect(operation.result.name).to.equal('Bob-1')
      expect(operation.result.___class).to.equal('Person')
      expect(operation.result.objectId).to.be.a('string')
      expect(operation.result.created).to.be.a('number')
      expect(operation.result.updated).to.equal(null)
      expect(operation.result.ownerId).to.equal(null)
      expect(operation.result.age).to.equal(12)
    })

    it('"update" operation', async function() {
      const savedPerson = await personsStore.save({ tag: 'r-a', name: 'Bob-2', age: 12 })

      savedPerson.age = 43
      savedPerson.name = 'Nick'

      const operation = uow.update(savedPerson)

      await uow.execute()

      expect(operation.result.tag).to.equal('r-a')
      expect(operation.result.name).to.equal('Nick')
      expect(operation.result.___class).to.equal('Person')
      expect(operation.result.objectId).to.equal(savedPerson.objectId)
      expect(operation.result.created).to.be.a('number')
      expect(operation.result.updated).to.be.a('number')
      expect(operation.result.ownerId).to.equal(null)
      expect(operation.result.age).to.equal(43)
    })

    it('"delete" operation', async function() {
      const savedPerson = await personsStore.save({})

      const operation = uow.delete(savedPerson)

      await uow.execute()

      expect(operation.result).to.be.a('number') //deletion time
    })

    it('"bulk-create" operation', async function() {
      const operation = uow.bulkCreate(PERSONS_TABLE_NAME, [
        { name: `p-bco-${Utils.uid()}` },
        { name: `p-bco-${Utils.uid()}` },
        { name: `p-bco-${Utils.uid()}` },
      ])

      await uow.execute()

      expect(operation.result).to.have.length(3)
      expect(operation.result[0]).to.be.a('string')
      expect(operation.result[1]).to.be.a('string')
      expect(operation.result[2]).to.be.a('string')
    })

    it('"bulk-update" operation', async function() {
      await personsStore.bulkCreate([
        { name: `p-buo-${Utils.uid()}`, age: 10 },
        { name: `p-buo-${Utils.uid()}`, age: 10 },
        { name: `p-buo-${Utils.uid()}`, age: 10 },
        { name: `p-buo-${Utils.uid()}`, age: 20 },
        { name: `p-buo-${Utils.uid()}`, age: 20 },
      ])

      const operation = uow.bulkUpdate(PERSONS_TABLE_NAME, 'name like \'p-buo-%\' and age = 10', { age: 30 })

      await uow.execute()

      expect(operation.result).to.equal(3)
    })

    it('"bulk-delete" operation', async function() {
      await personsStore.bulkCreate([
        { name: `p-bdo-${Utils.uid()}`, age: 10 },
        { name: `p-bdo-${Utils.uid()}`, age: 10 },
        { name: `p-bdo-${Utils.uid()}`, age: 10 },
        { name: `p-bdo-${Utils.uid()}`, age: 20 },
        { name: `p-bdo-${Utils.uid()}`, age: 20 },
      ])

      const operation = uow.bulkDelete(PERSONS_TABLE_NAME, 'name like \'p-bdo-%\' and age = 10')

      await uow.execute()

      expect(operation.result).to.equal(3)
    })

    it('"find" operation', async function() {
      await personsStore.bulkCreate([
        { name: `p-fo-${Utils.uid()}`, age: 10 },
        { name: `p-fo-${Utils.uid()}`, age: 10 },
        { name: `p-fo-${Utils.uid()}`, age: 10 },
        { name: `p-fo-${Utils.uid()}`, age: 20 },
        { name: `p-fo-${Utils.uid()}`, age: 20 },
      ])

      const query = Backendless.Data.QueryBuilder.create()
        .setWhereClause('name like \'p-fo-%\' and age = 20')

      const operation = uow.find(PERSONS_TABLE_NAME, query)

      await uow.execute()

      expect(operation.result).to.have.length(2)

      operation.result.forEach(item => {
        expect(item.name).to.be.a('string')
        expect(item.___class).to.equal('Person')
        expect(item.objectId).to.be.a('string')
        expect(item.created).to.be.a('number')
        expect(item.updated).to.equal(null)
        expect(item.ownerId).to.equal(null)
        expect(item.age).to.be.a('number')
      })
    })

  })

  describe('Fails', function() {

  })
})
