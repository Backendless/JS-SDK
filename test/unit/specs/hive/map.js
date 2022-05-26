import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forTest, prepareMockRequest } from '../../helpers/sandbox'
import { HiveTypes } from '../../../../src/hive/constants'

describe('Map Store', function() {
  forTest(this)

  const hiveName = 'test'

  describe('Methods', () => {
    const fakeResult = { foo: true }

    const storeKey = 'testStoreKey'
    const baseUrl = `${APP_PATH}/hive/${hiveName}/${HiveTypes.MAP}/${storeKey}`

    let store

    beforeEach(() => {
      store = Backendless.Hive(hiveName).MapStore(storeKey)
    })

    describe('Get', () => {
      it('success', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.get()

        expect(req1).to.deep.include({
          method: 'POST',
          path  : `${baseUrl}`,
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('success with key', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.get('test')

        expect(req1).to.deep.include({
          method: 'POST',
          path  : `${baseUrl}`,
          body  : ['test']
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('success with keys', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.get(['test1', 'test2'])

        expect(req1).to.deep.include({
          method: 'POST',
          path  : `${baseUrl}`,
          body  : ['test1', 'test2']
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('fails when store created without key', async () => {
        store = Backendless.Hive(hiveName).MapStore()

        const errorMsg = 'Store must be created with store key.'

        await expect(() => store.get()).to.throw(errorMsg)
      })

      it('fails when key(s) is invalid', async () => {
        const errorMsg = 'Key(s) must be a string or list of strings.'

        await expect(() => store.get(null)).to.throw(errorMsg)
        await expect(() => store.get(NaN)).to.throw(errorMsg)
        await expect(() => store.get(false)).to.throw(errorMsg)
        await expect(() => store.get(true)).to.throw(errorMsg)
        await expect(() => store.get(0)).to.throw(errorMsg)
        await expect(() => store.get(123)).to.throw(errorMsg)
        await expect(() => store.get(() => undefined)).to.throw(errorMsg)
        await expect(() => store.get({})).to.throw(errorMsg)
      })
    })

    describe('Get Value', () => {
      it('success', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.getValue('test')

        expect(req1).to.deep.include({
          method: 'GET',
          path  : `${baseUrl}/get/test`,
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('fails when store created without key', async () => {
        store = Backendless.Hive(hiveName).MapStore()

        const errorMsg = 'Store must be created with store key.'

        await expect(() => store.getValue()).to.throw(errorMsg)
      })

      it('fails when key is invalid', async () => {
        const errorMsg = 'Key must be provided and must be a string.'

        await expect(() => store.getValue(null)).to.throw(errorMsg)
        await expect(() => store.getValue(NaN)).to.throw(errorMsg)
        await expect(() => store.getValue(false)).to.throw(errorMsg)
        await expect(() => store.getValue(true)).to.throw(errorMsg)
        await expect(() => store.getValue(0)).to.throw(errorMsg)
        await expect(() => store.getValue('')).to.throw(errorMsg)
        await expect(() => store.getValue(123)).to.throw(errorMsg)
        await expect(() => store.getValue(() => undefined)).to.throw(errorMsg)
        await expect(() => store.getValue({})).to.throw(errorMsg)
      })
    })

    describe('Key Exists', () => {
      it('success', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.keyExists('test')

        expect(req1).to.deep.include({
          method: 'GET',
          path  : `${baseUrl}/exists/test`,
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('fails when store created without key', async () => {
        store = Backendless.Hive(hiveName).MapStore()

        const errorMsg = 'Store must be created with store key.'

        await expect(() => store.keyExists()).to.throw(errorMsg)
      })

      it('fails when key is invalid', async () => {
        const errorMsg = 'Key must be provided and must be a string.'

        await expect(() => store.keyExists(null)).to.throw(errorMsg)
        await expect(() => store.keyExists(NaN)).to.throw(errorMsg)
        await expect(() => store.keyExists(false)).to.throw(errorMsg)
        await expect(() => store.keyExists(true)).to.throw(errorMsg)
        await expect(() => store.keyExists(0)).to.throw(errorMsg)
        await expect(() => store.keyExists('')).to.throw(errorMsg)
        await expect(() => store.keyExists(123)).to.throw(errorMsg)
        await expect(() => store.keyExists(() => undefined)).to.throw(errorMsg)
        await expect(() => store.keyExists({})).to.throw(errorMsg)
      })
    })

    describe('Length', async () => {
      it('success', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.length()

        expect(req1).to.deep.include({
          method: 'GET',
          path  : `${baseUrl}/length`,
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('fails when store created without key', async () => {
        store = Backendless.Hive(hiveName).MapStore()

        const errorMsg = 'Store must be created with store key.'

        await expect(() => store.length()).to.throw(errorMsg)
      })
    })

    describe('Keys', async () => {
      it('success', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.keys()

        expect(req1).to.deep.include({
          method: 'GET',
          path  : `${baseUrl}/keys`,
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('fails when store created without key', async () => {
        store = Backendless.Hive(hiveName).MapStore()

        const errorMsg = 'Store must be created with store key.'

        await expect(() => store.keys()).to.throw(errorMsg)
      })
    })

    describe('Values', async () => {
      it('success', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.values()

        expect(req1).to.deep.include({
          method: 'GET',
          path  : `${baseUrl}/values`,
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('fails when store created without key', async () => {
        store = Backendless.Hive(hiveName).MapStore()

        const errorMsg = 'Store must be created with store key.'

        await expect(() => store.values()).to.throw(errorMsg)
      })
    })

    describe('Set', async () => {
      it('success', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.set({ foo: 123 })

        expect(req1).to.deep.include({
          method: 'PUT',
          path  : `${baseUrl}`,
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('fails when store created without key', async () => {
        store = Backendless.Hive(hiveName).MapStore()

        const errorMsg = 'Store must be created with store key.'

        await expect(() => store.set()).to.throw(errorMsg)
      })

      it('fails with invalid argument', async () => {
        const errorMsg1 = 'Payload must be an object.'
        const errorMsg2 = 'Provided object must have at least 1 key.'

        await expect(() => store.set(null)).to.throw(errorMsg1)
        await expect(() => store.set(NaN)).to.throw(errorMsg1)
        await expect(() => store.set(false)).to.throw(errorMsg1)
        await expect(() => store.set(true)).to.throw(errorMsg1)
        await expect(() => store.set(0)).to.throw(errorMsg1)
        await expect(() => store.set(123)).to.throw(errorMsg1)
        await expect(() => store.set(() => undefined)).to.throw(errorMsg1)
        await expect(() => store.set('')).to.throw(errorMsg1)
        await expect(() => store.set('foo')).to.throw(errorMsg1)

        await expect(() => store.set({})).to.throw(errorMsg2)
      })
    })

    describe('Add', async () => {
      it('success', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.add({ foo: 123 })

        expect(req1).to.deep.include({
          method: 'PUT',
          path  : `${baseUrl}/add`,
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('fails when store created without key', async () => {
        store = Backendless.Hive(hiveName).MapStore()

        const errorMsg = 'Store must be created with store key.'

        await expect(() => store.add()).to.throw(errorMsg)
      })

      it('fails with invalid argument', async () => {
        const errorMsg1 = 'Payload must be an object.'
        const errorMsg2 = 'Provided object must have at least 1 key.'

        await expect(() => store.add(null)).to.throw(errorMsg1)
        await expect(() => store.add(NaN)).to.throw(errorMsg1)
        await expect(() => store.add(false)).to.throw(errorMsg1)
        await expect(() => store.add(true)).to.throw(errorMsg1)
        await expect(() => store.add(0)).to.throw(errorMsg1)
        await expect(() => store.add(123)).to.throw(errorMsg1)
        await expect(() => store.add(() => undefined)).to.throw(errorMsg1)
        await expect(() => store.add('')).to.throw(errorMsg1)
        await expect(() => store.add('foo')).to.throw(errorMsg1)

        await expect(() => store.add({})).to.throw(errorMsg2)
      })
    })

    describe('Set Value', async () => {
      it('success', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.setValue('target', 'value')

        expect(req1).to.deep.include({
          method: 'PUT',
          path  : `${baseUrl}/set/target`,
          body  : 'value'
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('success with before argument', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.setValue('target', 'value', false)

        expect(req1).to.deep.include({
          method: 'PUT',
          path  : `${baseUrl}/set/target?ifNotExists=false`,
          body  : 'value'
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('fails when store created without key', async () => {
        store = Backendless.Hive(hiveName).MapStore()

        const errorMsg = 'Store must be created with store key.'

        await expect(() => store.setValue('keyValue', 'newValue')).to.throw(errorMsg)
      })

      it('fails with invalid key', async () => {
        const errorMsg = 'Key must be provided and must be a string.'

        await expect(() => store.setValue(undefined, 'v')).to.throw(errorMsg)
        await expect(() => store.setValue(null, 'v')).to.throw(errorMsg)
        await expect(() => store.setValue(false, 'v')).to.throw(errorMsg)
        await expect(() => store.setValue(true, 'v')).to.throw(errorMsg)
        await expect(() => store.setValue(0, 'v')).to.throw(errorMsg)
        await expect(() => store.setValue(123, 'v')).to.throw(errorMsg)
        await expect(() => store.setValue('', 'v')).to.throw(errorMsg)
        await expect(() => store.setValue({}, 'v')).to.throw(errorMsg)
        await expect(() => store.setValue([], 'v')).to.throw(errorMsg)
        await expect(() => store.setValue(() => undefined, 'v')).to.throw(errorMsg)
      })

      it('fails with invalid value', async () => {
        const errorMsg = 'Value must be provided and must be a string.'

        await expect(() => store.setValue('k', undefined)).to.throw(errorMsg)
        await expect(() => store.setValue('k', null)).to.throw(errorMsg)
        await expect(() => store.setValue('k', false)).to.throw(errorMsg)
        await expect(() => store.setValue('k', 0)).to.throw(errorMsg)
        await expect(() => store.setValue('k', '')).to.throw(errorMsg)
        await expect(() => store.setValue('k', true)).to.throw(errorMsg)
        await expect(() => store.setValue('k', 123)).to.throw(errorMsg)
        await expect(() => store.setValue('k', {})).to.throw(errorMsg)
        await expect(() => store.setValue('k', [])).to.throw(errorMsg)
        await expect(() => store.setValue('k', () => undefined)).to.throw(errorMsg)
      })

      it('fails with invalid ifNotExist argument', async () => {
        const errorMsg = 'Argument ifNotExists must be a boolean.'

        await expect(() => store.setValue('k', 'v', null)).to.throw(errorMsg)
        await expect(() => store.setValue('k', 'v', {})).to.throw(errorMsg)
        await expect(() => store.setValue('k', 'v', [])).to.throw(errorMsg)
        await expect(() => store.setValue('k', 'v', 0)).to.throw(errorMsg)
        await expect(() => store.setValue('k', 'v', 123)).to.throw(errorMsg)
        await expect(() => store.setValue('k', 'v', '')).to.throw(errorMsg)
        await expect(() => store.setValue('k', 'v', '123')).to.throw(errorMsg)
        await expect(() => store.setValue('k', 'v', () => undefined)).to.throw(errorMsg)
      })
    })

    describe('Increment', async () => {
      it('success', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.increment('testKey')

        expect(req1).to.deep.include({
          method: 'PUT',
          path  : `${baseUrl}/increment/testKey`,
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('success with count', async () => {
        const req1 = prepareMockRequest(fakeResult)
        const req2 = prepareMockRequest(fakeResult)

        const result1 = await store.increment('testKey', 3)
        const result2 = await store.increment('testKey', -3)

        expect(req1).to.deep.include({
          method: 'PUT',
          path  : `${baseUrl}/increment/testKey?count=3`,
        })

        expect(req2).to.deep.include({
          method: 'PUT',
          path  : `${baseUrl}/increment/testKey?count=-3`,
        })

        expect(result1).to.be.eql(fakeResult)
        expect(result2).to.be.eql(fakeResult)
      })

      it('fails when store created without key', async () => {
        store = Backendless.Hive(hiveName).MapStore()

        const errorMsg = 'Store must be created with store key.'

        await expect(() => store.increment('testKey')).to.throw(errorMsg)
      })

      it('fails with invalid key', async () => {
        const errorMsg = 'Key must be provided and must be a string.'

        await expect(() => store.increment(undefined)).to.throw(errorMsg)
        await expect(() => store.increment(null)).to.throw(errorMsg)
        await expect(() => store.increment(false)).to.throw(errorMsg)
        await expect(() => store.increment(true)).to.throw(errorMsg)
        await expect(() => store.increment(0)).to.throw(errorMsg)
        await expect(() => store.increment(123)).to.throw(errorMsg)
        await expect(() => store.increment('')).to.throw(errorMsg)
        await expect(() => store.increment({})).to.throw(errorMsg)
        await expect(() => store.increment([])).to.throw(errorMsg)
        await expect(() => store.increment(() => undefined)).to.throw(errorMsg)
      })

      it('fails with invalid count', async () => {
        const errorMsg = 'Count must be a number.'

        await expect(() => store.increment('v', null)).to.throw(errorMsg)
        await expect(() => store.increment('v', NaN)).to.throw(errorMsg)
        await expect(() => store.increment('v', false)).to.throw(errorMsg)
        await expect(() => store.increment('v', '')).to.throw(errorMsg)
        await expect(() => store.increment('v', 'qwe')).to.throw(errorMsg)
        await expect(() => store.increment('v', true)).to.throw(errorMsg)
        await expect(() => store.increment('v', () => undefined)).to.throw(errorMsg)
        await expect(() => store.increment('v', {})).to.throw(errorMsg)
      })
    })

    describe('Delete Keys', () => {
      it('success with key', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.deleteKeys('test')

        expect(req1).to.deep.include({
          method: 'DELETE',
          path  : `${baseUrl}/by-obj-keys`,
          body  : ['test']
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('success with keys', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.deleteKeys(['test1', 'test2'])

        expect(req1).to.deep.include({
          method: 'DELETE',
          path  : `${baseUrl}/by-obj-keys`,
          body  : ['test1', 'test2']
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('fails when store created without key', async () => {
        store = Backendless.Hive(hiveName).MapStore()

        const errorMsg = 'Store must be created with store key.'

        await expect(() => store.deleteKeys()).to.throw(errorMsg)
      })

      it('fails when key(s) is invalid', async () => {
        const errorMsg = 'Key(s) must be provided and must be a string or list of strings.'

        await expect(() => store.deleteKeys(null)).to.throw(errorMsg)
        await expect(() => store.deleteKeys(undefined)).to.throw(errorMsg)
        await expect(() => store.deleteKeys(NaN)).to.throw(errorMsg)
        await expect(() => store.deleteKeys(false)).to.throw(errorMsg)
        await expect(() => store.deleteKeys(true)).to.throw(errorMsg)
        await expect(() => store.deleteKeys('')).to.throw(errorMsg)
        await expect(() => store.deleteKeys(0)).to.throw(errorMsg)
        await expect(() => store.deleteKeys(123)).to.throw(errorMsg)
        await expect(() => store.deleteKeys(() => undefined)).to.throw(errorMsg)
        await expect(() => store.deleteKeys({})).to.throw(errorMsg)
      })
    })
  })
})
