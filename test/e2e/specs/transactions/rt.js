import sandbox, { Utils } from '../../helpers/sandbox'
import { runRTHandler, beforeRTHook, afterRTHook } from '../../helpers/rt'

const Backendless = sandbox.Backendless

class Foo {
  constructor(data) {
    data = data || {}

    this.firstName = data.firstName
    this.lastName = data.lastName
    this.age = data.age
  }
}

describe('Transactions - RT', function() {
  let fooDataStore
  let rtHandlers

  let testCaseMarker

  let uow

  const FOO_TABLE_NAME = 'Foo'

  sandbox.forSuite()

  before(async function() {
    fooDataStore = Backendless.Data.of(Foo)
    rtHandlers = fooDataStore.rt()

    await this.tablesAPI.createTable(FOO_TABLE_NAME)

    await this.tablesAPI.createColumn(FOO_TABLE_NAME, 'firstName', this.tablesAPI.DataTypes.STRING)
    await this.tablesAPI.createColumn(FOO_TABLE_NAME, 'lastName', this.tablesAPI.DataTypes.STRING)
    await this.tablesAPI.createColumn(FOO_TABLE_NAME, 'age', this.tablesAPI.DataTypes.INT)
  })

  beforeEach(async function() {
    testCaseMarker = Utils.uidShort()

    uow = new Backendless.UnitOfWork()

    await beforeRTHook(Backendless)
  })

  afterEach(async function() {
    await fooDataStore.bulkDelete('1=1') //remove all the saved object

    await afterRTHook(Backendless)
  })

  it('creates an object', async function() {
    const firstName = `p-${testCaseMarker}`
    const lastName = `p-${testCaseMarker}`
    const age = 45

    let nextResultData

    const rtHandler = await runRTHandler(({ callback, onError }) => {
      rtHandlers.addCreateListener(callback, onError)
    })

    const opResult = uow.create(FOO_TABLE_NAME, { firstName, lastName, age })

    await uow.execute()

    const restObject = opResult.getResult()

    nextResultData = await rtHandler.next()

    expect(restObject).to.be.eql(nextResultData)
    expect(restObject.objectId).to.be.eql(nextResultData.objectId).to.be.a('string')
    expect(restObject.created).to.be.equal(nextResultData.created).to.be.a('number')
    expect(restObject.firstName).to.be.equal(nextResultData.firstName).to.be.equal(firstName)
    expect(restObject.lastName).to.be.equal(nextResultData.lastName).to.be.equal(lastName)
    expect(restObject.age).to.be.equal(nextResultData.age).to.be.equal(age)
  })

  it('updates an object', async function() {
    const firstName = `p-${testCaseMarker}`
    const lastName = `p-${testCaseMarker}`
    const age = 45

    const savedObject = await fooDataStore.save({ firstName, lastName, age })

    let nextResultData

    const rtHandler = await runRTHandler(({ callback, onError }) => {
      rtHandlers.addUpdateListener(callback, onError)
    })

    savedObject.firstName = `next-value-${testCaseMarker}`

    const opResult = uow.update(FOO_TABLE_NAME, savedObject)

    await uow.execute()

    const restObject = opResult.getResult()

    nextResultData = await rtHandler.next()

    expect(restObject).to.be.eql(nextResultData)
    expect(restObject.objectId).to.be.eql(nextResultData.objectId).to.be.equal(savedObject.objectId)
    expect(restObject.created).to.be.equal(nextResultData.created).to.be.equal(savedObject.created)
    expect(restObject.updated).to.be.equal(nextResultData.updated).to.be.a('number')
    expect(restObject.firstName).to.be.equal(nextResultData.firstName).to.be.equal(savedObject.firstName)
    expect(restObject.lastName).to.be.equal(nextResultData.lastName).to.be.equal(savedObject.lastName)
    expect(restObject.age).to.be.equal(nextResultData.age).to.be.equal(savedObject.age)
  })

  it('deletes an object', async function() {
    const firstName = `p-${testCaseMarker}`
    const lastName = `p-${testCaseMarker}`
    const age = 45

    const savedObject = await fooDataStore.save({ firstName, lastName, age })

    let nextResultData

    const rtHandler = await runRTHandler(({ callback, onError }) => {
      rtHandlers.addDeleteListener(callback, onError)
    })

    const opResult = uow.delete(FOO_TABLE_NAME, savedObject)

    await uow.execute()

    const deletedTime = opResult.getResult()

    nextResultData = await rtHandler.next()

    expect(deletedTime).to.be.a('number')
    expect(nextResultData.objectId).to.be.equal(savedObject.objectId)
  })

  describe('Bulk Operations', function() {
    it('creates objects', async function() {
      const newObjects = [
        { firstName: `b-c-${testCaseMarker}-${Utils.uid()}`, lastName: `b-c-${testCaseMarker}`, age: 10 },
        { firstName: `b-c-${testCaseMarker}-${Utils.uid()}`, lastName: `b-c-${testCaseMarker}`, age: 10 },
        { firstName: `b-c-${testCaseMarker}-${Utils.uid()}`, lastName: `b-c-${testCaseMarker}`, age: 10 },
        { firstName: `b-c-${testCaseMarker}-${Utils.uid()}`, lastName: `b-c-${testCaseMarker}`, age: 20 },
        { firstName: `b-c-${testCaseMarker}-${Utils.uid()}`, lastName: `b-c-${testCaseMarker}`, age: 20 },
      ]

      let nextResultData

      const rtHandler = await runRTHandler(({ callback, onError }) => {
        rtHandlers.addBulkCreateListener(callback, onError)
      })

      const opResult = uow.bulkCreate(FOO_TABLE_NAME, newObjects)

      await uow.execute()

      const restObject = opResult.getResult()

      nextResultData = await rtHandler.next()

      expect(restObject).to.be.eql(nextResultData)
      expect(restObject).to.have.length(newObjects.length)
    })

    it('updates objects', async function() {
      const savedObjectsIds = await fooDataStore.bulkCreate([
        { firstName: `b-u-${testCaseMarker}-${Utils.uid()}`, lastName: `b-u-${testCaseMarker}`, age: 10 },
        { firstName: `b-u-${testCaseMarker}-${Utils.uid()}`, lastName: `b-u-${testCaseMarker}`, age: 10 },
        { firstName: `b-u-${testCaseMarker}-${Utils.uid()}`, lastName: `b-u-${testCaseMarker}`, age: 10 },
        { firstName: `b-u-${testCaseMarker}-${Utils.uid()}`, lastName: `b-u-${testCaseMarker}`, age: 20 },
        { firstName: `b-u-${testCaseMarker}-${Utils.uid()}`, lastName: `b-u-${testCaseMarker}`, age: 20 },
      ])

      let nextResultData

      const rtHandler = await runRTHandler(({ callback, onError }) => {
        rtHandlers.addBulkUpdateListener(callback, onError)
      })

      const opResult = uow.bulkUpdate(FOO_TABLE_NAME, savedObjectsIds, { age: 123 })

      await uow.execute()

      const restObject = opResult.getResult()

      nextResultData = await rtHandler.next()

      expect(restObject).to.be.eql(savedObjectsIds.length)

      expect(nextResultData).to.be.eql({
        whereClause: `objectId IN (${savedObjectsIds.map(id => `'${id}'`).join(',')})`,
        count      : savedObjectsIds.length
      })

      const updatedObjects = await fooDataStore.find()

      expect(updatedObjects.map(o => o.objectId).sort()).to.be.eql(savedObjectsIds.sort())
    })

    it('deletes objects', async function() {
      const savedObjectsIds = await fooDataStore.bulkCreate([
        { firstName: `b-u-${testCaseMarker}-${Utils.uid()}`, lastName: `b-u-${testCaseMarker}`, age: 10 },
        { firstName: `b-u-${testCaseMarker}-${Utils.uid()}`, lastName: `b-u-${testCaseMarker}`, age: 10 },
        { firstName: `b-u-${testCaseMarker}-${Utils.uid()}`, lastName: `b-u-${testCaseMarker}`, age: 10 },
        { firstName: `b-u-${testCaseMarker}-${Utils.uid()}`, lastName: `b-u-${testCaseMarker}`, age: 20 },
        { firstName: `b-u-${testCaseMarker}-${Utils.uid()}`, lastName: `b-u-${testCaseMarker}`, age: 20 },
      ])

      let nextResultData

      const rtHandler = await runRTHandler(({ callback, onError }) => {
        rtHandlers.addBulkDeleteListener(callback, onError)
      })

      const opResult = uow.bulkDelete(FOO_TABLE_NAME, savedObjectsIds)

      await uow.execute()

      const restObject = opResult.getResult()

      nextResultData = await rtHandler.next()

      expect(restObject).to.be.eql(savedObjectsIds.length)

      expect(nextResultData).to.be.eql({
        whereClause: `objectId IN (${savedObjectsIds.map(id => `'${id}'`).join(',')})`,
        count      : savedObjectsIds.length
      })

      const existsObjects = await fooDataStore.find()

      expect(existsObjects).to.have.length(0)
    })

  })
})
