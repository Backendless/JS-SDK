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

describe('<Users> CRUD', function() {

  forTest(this)

  const fakeResult = { foo: 123 }

  const tableName = 'Users'

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

      expect(result1).to.be.eql({
        ...savedObject,
        ___class: 'Users',
      })

      expect(result1).to.be.instanceof(Backendless.User)
      expect(result1).to.not.equal(newObject)
    })

    it('creates object instance', async () => {
      const newObject = getTestObject()
      const savedObject = getTestObjectWithId()

      const req1 = prepareMockRequest(savedObject)

      const result1 = await Backendless.Data.of(Backendless.User).save(newObject)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/${tableName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : newObject
      })

      expect(result1).to.not.equal(newObject)
      expect(result1).to.be.instanceof(Backendless.User)
      expect(result1).to.be.eql({
        ___class: 'Users',
        objectId: savedObject.objectId,
        str     : 'test-1',
        num     : 123,
        bool    : true,
      })
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

      expect(result1).to.be.eql({
        ...savedObject,
        ___class: 'Users',
      })

      expect(result1).to.be.instanceof(Backendless.User)
      expect(result1).to.not.equal(savedObject)
    })

    it('creates object instance', async () => {
      const savedObject = getTestObjectWithId()
      savedObject.updatedProp = 'new-value'

      const req1 = prepareMockRequest({ ...savedObject })

      const result1 = await Backendless.Data.of(Backendless.User).save(savedObject)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/${tableName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : savedObject
      })

      expect(result1).to.be.eql({ ...savedObject, ___class: 'Users' })
      expect(result1).to.be.instanceof(Backendless.User)
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

    it('fails when objectId is invalid', async () => {
      const errorMsg = 'Invalid value for the "value" argument. The argument must contain only string or object values'

      const dataStore = Backendless.Data.of(tableName)

      // await expect(dataStore.remove()).to.eventually.be.rejectedWith(errorMsg)
      // await expect(dataStore.remove('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.remove(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.remove(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.remove(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.remove(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.remove(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.remove(123)).to.eventually.be.rejectedWith(errorMsg)
      // await expect(dataStore.remove({})).to.eventually.be.rejectedWith(errorMsg)
      // await expect(dataStore.remove([])).to.eventually.be.rejectedWith(errorMsg)
      // await expect(dataStore.remove(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })
  })

})
