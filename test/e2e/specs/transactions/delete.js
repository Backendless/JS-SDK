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

describe('Transactions - Delete Operation', function() {

  let tablesAPI

  let personsStore

  let testCaseMarker

  let uow

  sandbox.forSuite()

  before(async function() {
    tablesAPI = this.tablesAPI

    await tablesAPI.createTable(PERSONS_TABLE_NAME)
    await tablesAPI.createColumn(PERSONS_TABLE_NAME, 'name', tablesAPI.DataTypes.STRING)

    personsStore = Backendless.Data.of(PERSONS_TABLE_NAME)

    await personsStore.save({ name: `p-${Utils.uid()}` })
    await personsStore.save({ name: `p-${Utils.uid()}` })
    await personsStore.save({ name: `p-${Utils.uid()}` })
  })

  beforeEach(function() {
    testCaseMarker = Utils.uidShort()

    uow = new Backendless.UnitOfWork()
  })

  it('deletes one map-object', async function() {
    const obj = await personsStore.save({ name: `p-${Utils.uid()}` })

    uow.delete(PERSONS_TABLE_NAME, obj)

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(uowResult.results.deletePerson1.operationType).to.equal('DELETE')
    expect(uowResult.results.deletePerson1.result).to.be.a('number')

    const query = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause(`objectId='${obj.objectId}'`)

    const personsCount = await personsStore.getObjectCount(query)

    expect(personsCount).to.equal(0)
  })

  it('deletes one instance-object', async function() {
    const savedObj = await personsStore.save({ name: `p-${Utils.uid()}` })
    const obj = new Person({ objectId: savedObj.objectId, name: savedObj.name })

    uow.delete(obj)

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(uowResult.results.deletePerson1.operationType).to.equal('DELETE')
    expect(uowResult.results.deletePerson1.result).to.be.a('number')

    const query = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause(`objectId='${savedObj.objectId}'`)

    const personsCount = await personsStore.getObjectCount(query)

    expect(personsCount).to.equal(0)
  })

  it('deletes several objects', async function() {
    const [obj1, obj2, obj3] = await Promise.all([
      personsStore.save({ name: `p-${Utils.uid()}` }),
      personsStore.save({ name: `p-${Utils.uid()}` }),
      personsStore.save({ name: `p-${Utils.uid()}` }),
    ])

    uow.delete(PERSONS_TABLE_NAME, obj1)
    uow.delete(PERSONS_TABLE_NAME, obj2)
    uow.delete(PERSONS_TABLE_NAME, obj3)

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(uowResult.results.deletePerson1.result).to.be.a('number')
    expect(uowResult.results.deletePerson2.result).to.be.a('number')
    expect(uowResult.results.deletePerson3.result).to.be.a('number')

    const checkObject = async obj => {
      const query = Backendless.Data.QueryBuilder
        .create()
        .setWhereClause(`objectId='${obj.objectId}'`)

      const personsCount = await personsStore.getObjectCount(query)

      expect(personsCount).to.equal(0)
    }

    await Promise.all([
      checkObject(obj1),
      checkObject(obj2),
      checkObject(obj3),
    ])
  })

  it('deletes 20 objects', async function() {
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

    query.prepareNextPage()

    expect(savedPerson.length).to.be.equal(limit)

    uow = new Backendless.UnitOfWork()

    savedPerson.forEach(savedPerson => {
      uow.delete(PERSONS_TABLE_NAME, { objectId: savedPerson.objectId })
    })

    const uowResult = await uow.execute()

    const query2 = Backendless.Data.QueryBuilder
      .create()
      .setWhereClause('name like \'p-many-%\'')

    const personsCount = await personsStore.getObjectCount(query2)

    expect(personsCount).to.be.equal(0)

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)

    expect(Object.keys(uowResult.results).length).to.equal(limit)
  })


  it('deletes object using opResult of FIND operation', async function() {
    const personName= `Bob-${testCaseMarker}`

    const createObjectResult = await personsStore.save({ name: personName })

    expect(createObjectResult.objectId).to.be.a('string')

    const query = Backendless.DataQueryBuilder
      .create()
      .setWhereClause(`name = '${personName}'`)

    const findOp = uow.find(PERSONS_TABLE_NAME, query)

    uow.delete(findOp.resolveTo(0))

    const uowResult = await uow.execute()

    expect(uowResult.error).to.equal(null)
    expect(uowResult.success).to.equal(true)
    expect(uowResult.results.findPerson1.operationType).to.equal('FIND')
    expect(uowResult.results.findPerson1.result).to.have.length(1)
    expect(uowResult.results.findPerson1.result[0].name).to.equal(personName)
    expect(uowResult.results.findPerson1.result[0].objectId).to.equal(createObjectResult.objectId)
    expect(uowResult.results.deletePerson1.operationType).to.equal('DELETE')
    expect(uowResult.results.deletePerson1.result).to.be.a('number')

    const objectsCountResult = await personsStore.getObjectCount(query)

    expect(objectsCountResult).to.equal(0)
  })

  describe('Fails', function() {

  })

})
