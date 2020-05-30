import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forTest, prepareMockRequest, Utils } from '../../helpers/sandbox'

function getTestObject() {
  return {
    str : 'test-1',
    num : 123,
    bool: true
  }
}

function getTestObjectWithId() {
  return {
    ...getTestObject(),
    objectId: Utils.objectId()
  }
}

describe('<Data> CRUD', function() {

  forTest(this)

  const fakeResult = { foo: 123 }

  const tableName = 'Person'

  class ClassPerson {
  }

  describe('Save', () => {
    it('creates object', async () => {
      const newObject = getTestObject()
      const savedObject = getTestObjectWithId()

      const req1 = prepareMockRequest(savedObject)

      const result1 = await Backendless.Data.of(tableName).save(newObject)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/${tableName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : newObject
      })

      expect(result1).to.be.eql(savedObject)
      expect(result1).to.not.equal(newObject)
    })

    it('creates object instance', async () => {
      const newObject = getTestObject()
      const savedObject = getTestObjectWithId()

      const req1 = prepareMockRequest(savedObject)

      const result1 = await Backendless.Data.of(ClassPerson).save(newObject)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/ClassPerson`,
        headers: { 'Content-Type': 'application/json' },
        body   : newObject
      })

      expect(result1).to.not.equal(newObject)
      expect(result1).to.be.instanceof(ClassPerson)
      expect(result1).to.be.eql({
        objectId: savedObject.objectId,
        str     : 'test-1',
        num     : 123,
        bool    : true,
      })
    })

    it('resolve children', async () => {
      const newObject = getTestObject()
      const savedObject = getTestObjectWithId()

      class FooItems {
      }

      class BarItem {
      }

      Backendless.Data.mapTableToClass('FooItems', FooItems)
      Backendless.Data.mapTableToClass('BarItem', BarItem)

      const req1 = prepareMockRequest({
        ...savedObject,
        fooItems: [{ ___class: 'FooItems' }, { ___class: 'FooItems' }, { ___class: 'FooItems' }],
        barItem : { ___class: 'BarItem' },
      })

      const result1 = await Backendless.Data.of(ClassPerson).save(newObject)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/ClassPerson`,
        headers: { 'Content-Type': 'application/json' },
        body   : newObject
      })

      expect(result1).to.not.equal(newObject)
      expect(result1).to.deep.include(savedObject)
      expect(result1).to.be.instanceof(ClassPerson)
      expect(result1.barItem).to.be.instanceof(BarItem)
      expect(result1.fooItems[0]).to.be.instanceof(FooItems)
      expect(result1.fooItems[1]).to.be.instanceof(FooItems)
      expect(result1.fooItems[2]).to.be.instanceof(FooItems)
    })
  })

  describe('Update', () => {
    it('updates object', async () => {
      const savedObject = getTestObjectWithId()
      savedObject.updatedProp = 'new-value'

      const req1 = prepareMockRequest({ ...savedObject })

      const result1 = await Backendless.Data.of(tableName).save(savedObject)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/${tableName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : savedObject
      })

      expect(result1).to.be.eql(savedObject)
      expect(result1).to.not.equal(savedObject)
    })

    it('creates object instance', async () => {
      const savedObject = getTestObjectWithId()
      savedObject.updatedProp = 'new-value'

      const req1 = prepareMockRequest({ ...savedObject })

      const result1 = await Backendless.Data.of(ClassPerson).save(savedObject)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/ClassPerson`,
        headers: { 'Content-Type': 'application/json' },
        body   : savedObject
      })

      expect(result1).to.be.eql(savedObject)
      expect(result1).to.be.instanceof(ClassPerson)
      expect(result1).to.not.equal(savedObject)
    })
  })

  describe('Remove', () => {
    it('removes object', async () => {
      const savedObject = getTestObjectWithId()

      const req1 = prepareMockRequest(fakeResult)

      const result1 = await Backendless.Data.of(tableName).remove(savedObject)

      expect(req1).to.deep.include({
        method : 'DELETE',
        path   : `${APP_PATH}/data/${tableName}/${savedObject.objectId}`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.equal(fakeResult)
    })

    it('removes object by its id', async () => {
      const savedObject = getTestObjectWithId()

      const req1 = prepareMockRequest(fakeResult)

      const result1 = await Backendless.Data.of(tableName).remove(savedObject.objectId)

      expect(req1).to.deep.include({
        method : 'DELETE',
        path   : `${APP_PATH}/data/${tableName}/${savedObject.objectId}`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.equal(fakeResult)
    })

    xit('fails when objectId is invalid', async () => {
      const errorMsg = 'Object Id must be provided and must be a string.'

      const dataStore = Backendless.Data.of(tableName)

      await expect(dataStore.remove()).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.remove('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.remove(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.remove(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.remove(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.remove(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.remove(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.remove(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.remove({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.remove([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.remove(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })
  })

})
