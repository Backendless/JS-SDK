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

describe('Transactions - Results', function() {

  let tablesAPI

  let personsStore

  let uow

  sandbox.forSuite()

  before(async function() {
    tablesAPI = this.tablesAPI

    personsStore = Backendless.Data.of(Person)

    const fakePerson = await personsStore.save({ tag: 'fake', name: 'Bob', age: 123 })

    await personsStore.remove(fakePerson)
  })

  beforeEach(function() {
    uow = new Backendless.UnitOfWork()
  })

  describe('UnitOfWorkResult', function() {

    it('isSuccess method returns boolean value', async function() {
      let result

      uow.create(PERSONS_TABLE_NAME, { tag: 's-2', name: 'Bob-2', age: 123 })

      result = await uow.execute()

      expect(result.success).to.equal(true)
      expect(result.isSuccess()).to.equal(true)

      uow = new Backendless.UnitOfWork()

      uow.create(PERSONS_TABLE_NAME, { unknownColumn: 'unknownColumn' })

      result = await uow.execute()

      expect(result.success).to.equal(false)
      expect(result.isSuccess()).to.equal(false)
    })

    it('has an TransactionOperationError', async function() {
      let result

      const opResult = uow.create(PERSONS_TABLE_NAME, { unknownColumn: 'unknownColumn' })

      result = await uow.execute()

      const error = result.getError()

      expect(error instanceof Error).to.equal(true)

      expect(error).to.equal(result.error)
      expect(error).to.equal(opResult.getError())

      expect(error.message).to.equal(
        'Column \'unknownColumn\' in table \'Person\' not exists. ' +
        'Transaction accepts only DML operations (Data Manipulation Language)'
      )

      expect(error.operation.operationType).to.equal('CREATE')
      expect(error.operation.table).to.equal('Person')
      expect(error.operation.opResultId).to.equal('createPerson1')
      expect(error.operation.payload).to.eql({ unknownColumn: 'unknownColumn' })
    })

  })

  describe('OpResult', function() {

    it('has an access to opResultId', async function() {
      const customOpResultId = 'My Test Operation ID'

      const operation = uow.create(PERSONS_TABLE_NAME, { tag: 's-1', name: 'Bob-1', age: 123 })

      operation.setOpResultId(customOpResultId)

      expect(operation.getOpResultId()).to.equal(customOpResultId)

      const result = await uow.execute()

      expect(result.results[customOpResultId].operationType).to.equal('CREATE')
      expect(result.results[customOpResultId].result.___class).to.equal('Person')
      expect(result.results[customOpResultId].result.age).to.equal(123)
      expect(result.results[customOpResultId].result.name).to.equal('Bob-1')
      expect(result.results[customOpResultId].result.tag).to.equal('s-1')
    })

    it('has an access to tableName', async function() {
      expect(uow.create(PERSONS_TABLE_NAME, {}).getTableName()).to.equal(PERSONS_TABLE_NAME)
      expect(uow.find(PERSONS_TABLE_NAME, {}).resolvedTo(0).getTableName()).to.equal(PERSONS_TABLE_NAME)
    })

    it('has an access to operationType', async function() {
      expect(uow.create(PERSONS_TABLE_NAME, {}).getType()).to.equal('CREATE')
      expect(uow.bulkCreate(PERSONS_TABLE_NAME, {}).getType()).to.equal('CREATE_BULK')
      expect(uow.update(PERSONS_TABLE_NAME, {}).getType()).to.equal('UPDATE')
      expect(uow.bulkUpdate(PERSONS_TABLE_NAME, {}).getType()).to.equal('UPDATE_BULK')
      expect(uow.delete(PERSONS_TABLE_NAME, {}).getType()).to.equal('DELETE')
      expect(uow.bulkDelete(PERSONS_TABLE_NAME, '1=1').getType()).to.equal('DELETE_BULK')
      expect(uow.find(PERSONS_TABLE_NAME, {}).getType()).to.equal('FIND')
      expect(uow.addToRelation(PERSONS_TABLE_NAME, {}, 'columnName', []).getType()).to.equal('ADD_RELATION')
      expect(uow.setRelation(PERSONS_TABLE_NAME, {}, 'columnName', []).getType()).to.equal('SET_RELATION')
      expect(uow.deleteRelation(PERSONS_TABLE_NAME, {}, 'columnName', []).getType()).to.equal('DELETE_RELATION')
    })

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
