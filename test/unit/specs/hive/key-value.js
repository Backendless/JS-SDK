import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forTest, prepareMockRequest } from '../../helpers/sandbox'
import { HiveTypes } from '../../../../src/hive/constants'

describe('Key Value Store', function() {
  forTest(this)

  const hiveName = 'test'

  describe('Methods', () => {
    const fakeResult = { foo: true }

    const storeUrl = `${APP_PATH}/hive/${hiveName}/${HiveTypes.KEY_VALUE}`

    let store

    beforeEach(() => {
      store = Backendless.Hive(hiveName).KeyValueStore()
    })

    describe('Get', () => {
      it('success with single key', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.get('testKey')

        expect(req1).to.deep.include({
          method: 'GET',
          path  : `${storeUrl}/testKey`,
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('success with multi keys', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.get(['testKey1', 'testKey2'])

        expect(req1).to.deep.include({
          method : 'POST',
          path   : `${storeUrl}`,
          headers: { 'Content-Type': 'application/json' },
          body   : ['testKey1', 'testKey2']
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('fails when keys is invalid', async () => {
        const errorMsg = 'Key(s) must be provided and must be a string or list of strings.'

        await expect(() => store.get(undefined)).to.throw(errorMsg)
        await expect(() => store.get(null)).to.throw(errorMsg)
        await expect(() => store.get(0)).to.throw(errorMsg)
        await expect(() => store.get(false)).to.throw(errorMsg)
        await expect(() => store.get('')).to.throw(errorMsg)
        await expect(() => store.get(true)).to.throw(errorMsg)
        await expect(() => store.get(123)).to.throw(errorMsg)
        await expect(() => store.get(() => undefined)).to.throw(errorMsg)
        await expect(() => store.get({})).to.throw(errorMsg)
      })
    })

    describe('Set', async () => {
      it('success with single key', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.set('testKey', 'testValue')

        expect(req1).to.deep.include({
          method : 'PUT',
          path   : `${storeUrl}/testKey`,
          headers: { 'Content-Type': 'application/json' },
          body   : { value: 'testValue' }
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('success with options', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.set('testKey', 'testValue', {
          expirationSeconds: 100,
          expiration       : 'TTL',
          condition        : 'Always'
        })

        expect(req1).to.deep.include({
          method : 'PUT',
          path   : `${storeUrl}/testKey`,
          headers: { 'Content-Type': 'application/json' },
          body   : {
            'condition'        : 'Always',
            'expiration'       : 'TTL',
            'expirationSeconds': 100,
            'value'            : 'testValue'
          }
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('success with multi keys', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.set({ 'testKey1': 'testValue1', 'testKey2': 'testValue2' })

        expect(req1).to.deep.include({
          method : 'PUT',
          path   : `${storeUrl}`,
          headers: { 'Content-Type': 'application/json' },
          body   : {
            'testKey1': 'testValue1',
            'testKey2': 'testValue2',
          }
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('fails when key is invalid', async () => {
        const errorMsg = 'Key must be provided and must be a string.'

        await expect(() => store.set(undefined, 'testValue')).to.throw(errorMsg)
        await expect(() => store.set(null, 'testValue')).to.throw(errorMsg)
        await expect(() => store.set(false, 'testValue')).to.throw(errorMsg)
        await expect(() => store.set(0, 'testValue')).to.throw(errorMsg)
        await expect(() => store.set(true, 'testValue')).to.throw(errorMsg)
        await expect(() => store.set(123, 'testValue')).to.throw(errorMsg)
        await expect(() => store.set(() => undefined), 'testValue').to.throw(errorMsg)
      })

      it('fails when object is empty', async () => {
        const errorMsg = 'Provided object must have at least 1 key.'

        await expect(() => store.set({})).to.throw(errorMsg)
      })

      it('fails when options is invalid', async () => {
        const errorMsg1 = 'Expiration seconds must be a number.'

        await expect(() => store.set('k', 'v', { expirationSeconds: null })).to.throw(errorMsg1)
        await expect(() => store.set('k', 'v', { expirationSeconds: false })).to.throw(errorMsg1)
        await expect(() => store.set('k', 'v', { expirationSeconds: true })).to.throw(errorMsg1)
        await expect(() => store.set('k', 'v', { expirationSeconds: '' })).to.throw(errorMsg1)
        await expect(() => store.set('k', 'v', { expirationSeconds: 'foo' })).to.throw(errorMsg1)
        await expect(() => store.set('k', 'v', { expirationSeconds: NaN })).to.throw(errorMsg1)
        await expect(() => store.set('k', 'v', { expirationSeconds: () => undefined })).to.throw(errorMsg1)

        const errorMsg2 = 'Expiration must be one of this values: TTL, UnixTimestamp, None.'

        await expect(() => store.set('k', 'v', { expiration: null })).to.throw(errorMsg2)
        await expect(() => store.set('k', 'v', { expiration: false })).to.throw(errorMsg2)
        await expect(() => store.set('k', 'v', { expiration: true })).to.throw(errorMsg2)
        await expect(() => store.set('k', 'v', { expiration: '' })).to.throw(errorMsg2)
        await expect(() => store.set('k', 'v', { expiration: 'foo' })).to.throw(errorMsg2)
        await expect(() => store.set('k', 'v', { expiration: NaN })).to.throw(errorMsg2)
        await expect(() => store.set('k', 'v', { expiration: () => undefined })).to.throw(errorMsg2)

        const errorMsg3 = 'Condition must be one of this values: IfExists, IfNotExists, Always.'

        await expect(() => store.set('k', 'v', { condition: null })).to.throw(errorMsg3)
        await expect(() => store.set('k', 'v', { condition: false })).to.throw(errorMsg3)
        await expect(() => store.set('k', 'v', { condition: true })).to.throw(errorMsg3)
        await expect(() => store.set('k', 'v', { condition: '' })).to.throw(errorMsg3)
        await expect(() => store.set('k', 'v', { condition: 'foo' })).to.throw(errorMsg3)
        await expect(() => store.set('k', 'v', { condition: NaN })).to.throw(errorMsg3)
        await expect(() => store.set('k', 'v', { condition: () => undefined })).to.throw(errorMsg3)
      })
    })

    describe('Increment', () => {
      it('success', async () => {
        store = Backendless.Hive(hiveName).KeyValueStore('storeKey')

        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.increment(10)

        expect(req1).to.deep.include({
          method: 'PUT',
          path  : `${storeUrl}/storeKey/increment?value=10`,
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('fails when store created without key', async () => {
        const errorMsg = 'Store must be created with store key.'

        await expect(() => store.increment(10)).to.throw(errorMsg)
      })

      it('fails when value is invalid', async () => {
        store = Backendless.Hive(hiveName).KeyValueStore('storeKey')

        const errorMsg = 'Value must be provided and must be a number.'

        await expect(() => store.increment(undefined)).to.throw(errorMsg)
        await expect(() => store.increment(null)).to.throw(errorMsg)
        await expect(() => store.increment(false)).to.throw(errorMsg)
        await expect(() => store.increment('')).to.throw(errorMsg)
        await expect(() => store.increment('123')).to.throw(errorMsg)
        await expect(() => store.increment(NaN)).to.throw(errorMsg)
        await expect(() => store.increment(true)).to.throw(errorMsg)
        await expect(() => store.increment(() => undefined)).to.throw(errorMsg)
        await expect(() => store.increment({})).to.throw(errorMsg)
      })
    })

    describe('Decrement', () => {
      it('success', async () => {
        store = Backendless.Hive(hiveName).KeyValueStore('storeKey')

        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.decrement(10)

        expect(req1).to.deep.include({
          method: 'PUT',
          path  : `${storeUrl}/storeKey/decrement?value=10`,
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('fails when store created without key', async () => {
        const errorMsg = 'Store must be created with store key.'

        await expect(() => store.decrement(10)).to.throw(errorMsg)
      })

      it('fails when value is invalid', async () => {
        store = Backendless.Hive(hiveName).KeyValueStore('storeKey')

        const errorMsg = 'Value must be provided and must be a number.'

        await expect(() => store.decrement(undefined)).to.throw(errorMsg)
        await expect(() => store.decrement(null)).to.throw(errorMsg)
        await expect(() => store.decrement(false)).to.throw(errorMsg)
        await expect(() => store.decrement('')).to.throw(errorMsg)
        await expect(() => store.decrement('123')).to.throw(errorMsg)
        await expect(() => store.decrement(NaN)).to.throw(errorMsg)
        await expect(() => store.decrement(true)).to.throw(errorMsg)
        await expect(() => store.decrement(() => undefined)).to.throw(errorMsg)
        await expect(() => store.decrement({})).to.throw(errorMsg)
      })
    })
  })
})
