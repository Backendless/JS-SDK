import '../../helpers/global'
import sandbox from '../../helpers/sandbox'
import * as Utils from '../../helpers/utils'
import { runRTHandler, RT_TIMEOUT_ERROR, beforeRTHook, afterRTHook } from '../../helpers/rt'

const Backendless = sandbox.Backendless

class Foo {
  constructor(data) {
    data = data || {}

    this.firstName = data.firstName
    this.lastName = data.lastName
    this.age = data.age
  }
}

describe('RT - Data', function() {
  let fooDataStore
  let rtHandlers

  let testCaseMarker

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

    await beforeRTHook(Backendless)
  })

  afterEach(async function() {
    await afterRTHook(Backendless)
  })

  describe('On Create Objects', function() {
    it('simple create', async () => {
      let restObject
      let nextResultData

      const rtHandler = await runRTHandler(({ callback, onError }) => {
        rtHandlers.addCreateListener(callback, onError)
      })

      restObject = await fooDataStore.save({ firstName: 'First', lastName: 'First' })
      nextResultData = await rtHandler.next()

      expect(nextResultData).to.be.instanceof(Foo)
      expect(restObject.objectId).to.be.equal(nextResultData.objectId)
      expect(restObject.firstName).to.be.equal(nextResultData.firstName).to.be.equal('First')
      expect(restObject.lastName).to.be.equal(nextResultData.lastName).to.be.equal('First')
      expect(restObject.created).to.be.equal(nextResultData.created).to.be.a('number')
      expect(restObject.___class).to.be.equal(nextResultData.___class).to.be.equal('Foo')

      restObject = await fooDataStore.save({ firstName: 'Second', lastName: 'Second' })
      nextResultData = await rtHandler.next()

      expect(nextResultData).to.be.instanceof(Foo)
      expect(nextResultData.objectId).to.be.equal(restObject.objectId)
      expect(nextResultData.firstName).to.be.equal(restObject.firstName).to.be.equal('Second')
      expect(nextResultData.lastName).to.be.equal(restObject.lastName).to.be.equal('Second')
      expect(nextResultData.created).to.be.equal(restObject.created).to.be.a('number')
      expect(nextResultData.___class).to.be.equal(restObject.___class).to.be.equal('Foo')

      expect(rtHandler.results).to.have.length(2)
      expect(rtHandler.results[0].firstName).to.be.equal('First')
      expect(rtHandler.results[1].firstName).to.be.equal('Second')
    })
  })

  describe('On Update Objects', function() {
    it('simple update', async () => {
      let nextResultData

      const restObject1 = await fooDataStore.save({ firstName: 'First', lastName: 'First' })
      const restObject2 = await fooDataStore.save({ firstName: 'Second', lastName: 'Second' })

      const rtHandler = await runRTHandler(({ callback, onError }) => {
        rtHandlers.addUpdateListener(callback, onError)
      })

      restObject1.firstName = 'test-1-firstName'
      restObject1.lastName = 'test-1-lastName'

      await fooDataStore.save(restObject1)

      nextResultData = await rtHandler.next()

      expect(nextResultData).to.be.instanceof(Foo)
      expect(nextResultData.___class).to.be.equal(restObject1.___class).to.be.equal('Foo')
      expect(nextResultData.objectId).to.be.equal(restObject1.objectId).to.be.a('string')
      expect(nextResultData.firstName).to.be.equal(restObject1.firstName).to.be.equal('test-1-firstName')
      expect(nextResultData.lastName).to.be.equal(restObject1.lastName).to.be.equal('test-1-lastName')
      expect(nextResultData.created).to.be.equal(restObject1.created).to.be.a('number')
      expect(nextResultData.updated).to.be.a('number')
      expect(restObject1.updated).to.be.equal(null)

      restObject2.firstName = 'test-2-firstName'
      restObject2.lastName = 'test-2-lastName'

      await fooDataStore.save(restObject2)

      nextResultData = await rtHandler.next()

      expect(nextResultData).to.be.instanceof(Foo)
      expect(nextResultData.___class).to.be.equal(restObject2.___class).to.be.equal('Foo')
      expect(nextResultData.objectId).to.be.equal(restObject2.objectId).to.be.a('string')
      expect(nextResultData.firstName).to.be.equal(restObject2.firstName).to.be.equal('test-2-firstName')
      expect(nextResultData.lastName).to.be.equal(restObject2.lastName).to.be.equal('test-2-lastName')
      expect(nextResultData.created).to.be.equal(restObject2.created).to.be.a('number')
      expect(nextResultData.updated).to.be.a('number')
      expect(restObject2.updated).to.be.equal(null)

      expect(rtHandler.results).to.have.length(2)
      expect(rtHandler.results[0].firstName).to.be.equal('test-1-firstName')
      expect(rtHandler.results[1].firstName).to.be.equal('test-2-firstName')
    })
  })

  describe('On Delete Objects', function() {
    it('simple delete', async () => {
      let nextResultData

      const restObject1 = await fooDataStore.save({ firstName: 'First', lastName: 'First', age: 111 })
      const restObject2 = await fooDataStore.save({ firstName: 'Second', lastName: 'Second', age: 222 })

      const rtHandler = await runRTHandler(({ callback, onError }) => {
        rtHandlers.addDeleteListener(callback, onError)
      })

      await fooDataStore.remove(restObject1)

      nextResultData = await rtHandler.next()

      expect(nextResultData).to.be.instanceof(Foo)
      expect(nextResultData.objectId).to.be.equal(restObject1.objectId)
      expect(nextResultData.firstName).to.be.equal(undefined)
      expect(nextResultData.lastName).to.be.equal(undefined)
      expect(nextResultData.age).to.be.equal(undefined)

      await fooDataStore.remove(restObject2)

      nextResultData = await rtHandler.next()

      expect(nextResultData).to.be.instanceof(Foo)
      expect(nextResultData.objectId).to.be.equal(restObject2.objectId)
      expect(nextResultData.firstName).to.be.equal(undefined)
      expect(nextResultData.lastName).to.be.equal(undefined)
      expect(nextResultData.age).to.be.equal(undefined)
    })
  })

  describe('With WhereClause Query', function() {
    const whereClause = 'firstName=\'bar\' and age > 20'

    it('creates', async () => {
      const rtHandler = await runRTHandler(({ callback, onError }) => {
        rtHandlers.addCreateListener(whereClause, callback, onError)
      })

      await fooDataStore.save({ firstName: 'bar', age: 35 })
      await fooDataStore.save({ firstName: 'bar', age: 10 })
      await fooDataStore.save({ firstName: 'foo', age: 40 })
      await fooDataStore.save({ firstName: 'bar', age: 40 })

      await rtHandler.next()
      await rtHandler.next()

      expect(rtHandler.results).to.have.length(2)
      expect(rtHandler.results[0].firstName).to.be.equal('bar')
      expect(rtHandler.results[0].age).to.be.equal(35)
      expect(rtHandler.results[1].firstName).to.be.equal('bar')
      expect(rtHandler.results[1].age).to.be.equal(40)
    })

    it('updates', async () => {
      const restObject1 = await fooDataStore.save({ firstName: 'bar', age: 30 })
      const restObject2 = await fooDataStore.save({ firstName: 'bar', age: 10 })
      const restObject3 = await fooDataStore.save({ firstName: 'foo', age: 30 })
      const restObject4 = await fooDataStore.save({ firstName: 'bar', age: 30 })

      const rtHandler = await runRTHandler(({ callback, onError }) => {
        rtHandlers.addUpdateListener(whereClause, callback, onError)
      })

      await fooDataStore.save({ objectId: restObject1.objectId, firstName: 'bar', age: 40 })
      await fooDataStore.save({ objectId: restObject2.objectId, firstName: 'bar', age: 45 })
      await fooDataStore.save({ objectId: restObject3.objectId, firstName: 'test', age: 60 })
      await fooDataStore.save({ objectId: restObject4.objectId, firstName: 'bar', age: 70 })

      await rtHandler.next()
      await rtHandler.next()
      await rtHandler.next()

      try {
        await rtHandler.next()
      } catch (e) {
        expect(e.message).to.be.equal(RT_TIMEOUT_ERROR)
      }

      expect(rtHandler.results).to.have.length(3)

      expect(rtHandler.results[0].objectId).to.be.equal(restObject1.objectId)
      expect(rtHandler.results[0].firstName).to.be.equal('bar')
      expect(rtHandler.results[0].age).to.be.equal(40)

      expect(rtHandler.results[1].objectId).to.be.equal(restObject2.objectId)
      expect(rtHandler.results[1].firstName).to.be.equal('bar')
      expect(rtHandler.results[1].age).to.be.equal(45)

      expect(rtHandler.results[2].objectId).to.be.equal(restObject4.objectId)
      expect(rtHandler.results[2].firstName).to.be.equal('bar')
      expect(rtHandler.results[2].age).to.be.equal(70)
    })

    it('removes', async () => {
      const restObject1 = await fooDataStore.save({ firstName: 'bar', age: 30 })
      const restObject2 = await fooDataStore.save({ firstName: 'bar', age: 10 })
      const restObject3 = await fooDataStore.save({ firstName: 'foo', age: 30 })
      const restObject4 = await fooDataStore.save({ firstName: 'bar', age: 30 })

      const rtHandler = await runRTHandler(({ callback, onError }) => {
        rtHandlers.addDeleteListener(whereClause, callback, onError)
      })

      await fooDataStore.remove(restObject1)
      await fooDataStore.remove(restObject2)
      await fooDataStore.remove(restObject3)
      await fooDataStore.remove(restObject4)

      await rtHandler.next()
      await rtHandler.next()

      try {
        await rtHandler.next()
      } catch (e) {
        expect(e.message).to.be.equal(RT_TIMEOUT_ERROR)
      }

      expect(rtHandler.results).to.have.length(2)

      expect(rtHandler.results[0].objectId).to.be.equal(restObject1.objectId)
      expect(rtHandler.results[0].firstName).to.be.equal(undefined)
      expect(rtHandler.results[0].lastName).to.be.equal(undefined)
      expect(rtHandler.results[0].age).to.be.equal(undefined)

      expect(rtHandler.results[1].objectId).to.be.equal(restObject4.objectId)
      expect(rtHandler.results[0].firstName).to.be.equal(undefined)
      expect(rtHandler.results[0].lastName).to.be.equal(undefined)
      expect(rtHandler.results[0].age).to.be.equal(undefined)

    })
  })
})
