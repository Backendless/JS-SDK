import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forTest, prepareMockRequest } from '../../helpers/sandbox'

describe('Hive - Key Value Store', function() {
  forTest(this)

  const hiveName = 'testHiveName'
  const storeKey = 'testStoreKey'

  const fakeResult = { foo: true }

  let store
  let Store

  beforeEach(() => {
    Store = Backendless.Hive(hiveName).KeyValueStore
    store = Backendless.Hive(hiveName).KeyValueStore(storeKey)
  })

  describe('General Methods', () => {
    describe('Static Methods', () => {
      describe('Keys', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await Store.keys()

          expect(request).to.deep.include({
            method: 'GET',
            path  : `${APP_PATH}/hive/${hiveName}/key-value/keys`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('success with options', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await Store.keys({
            filterPattern: '123',
            cursor       : 20,
            pageSize     : 30
          })

          expect(request).to.deep.include({
            method: 'GET',
            path  : `${APP_PATH}/hive/${hiveName}/key-value/keys?filterPattern=123&cursor=20&pageSize=30`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when options is invalid', async () => {
          const errorMsg = 'Options must be an object.'

          await expect(() => Store.keys(null)).to.throw(errorMsg)
          await expect(() => Store.keys(NaN)).to.throw(errorMsg)
          await expect(() => Store.keys('')).to.throw(errorMsg)
          await expect(() => Store.keys('123')).to.throw(errorMsg)
          await expect(() => Store.keys(123)).to.throw(errorMsg)
          await expect(() => Store.keys(0)).to.throw(errorMsg)
          await expect(() => Store.keys([])).to.throw(errorMsg)
          await expect(() => Store.keys(() => undefined)).to.throw(errorMsg)
          await expect(() => Store.keys(true)).to.throw(errorMsg)
          await expect(() => Store.keys(false)).to.throw(errorMsg)
        })

        it('fails when Cursor is invalid', async () => {
          const errorMsg = 'Cursor must be a number.'

          await expect(() => Store.keys({ cursor: null })).to.throw(errorMsg)
          await expect(() => Store.keys({ cursor: false })).to.throw(errorMsg)
          await expect(() => Store.keys({ cursor: true })).to.throw(errorMsg)
          await expect(() => Store.keys({ cursor: '' })).to.throw(errorMsg)
          await expect(() => Store.keys({ cursor: 'foo' })).to.throw(errorMsg)
          await expect(() => Store.keys({ cursor: NaN })).to.throw(errorMsg)
          await expect(() => Store.keys({ cursor: () => undefined })).to.throw(errorMsg)
        })

        it('fails when Page Size is invalid', async () => {
          const errorMsg = 'Page size must be a number.'

          await expect(() => Store.keys({ pageSize: null })).to.throw(errorMsg)
          await expect(() => Store.keys({ pageSize: false })).to.throw(errorMsg)
          await expect(() => Store.keys({ pageSize: true })).to.throw(errorMsg)
          await expect(() => Store.keys({ pageSize: '' })).to.throw(errorMsg)
          await expect(() => Store.keys({ pageSize: 'foo' })).to.throw(errorMsg)
          await expect(() => Store.keys({ pageSize: NaN })).to.throw(errorMsg)
          await expect(() => Store.keys({ pageSize: () => undefined })).to.throw(errorMsg)
        })

        it('fails when Filter Pattern is invalid', async () => {
          const errorMsg = 'Filter pattern must be a string.'

          await expect(() => Store.keys({ filterPattern: null })).to.throw(errorMsg)
          await expect(() => Store.keys({ filterPattern: false })).to.throw(errorMsg)
          await expect(() => Store.keys({ filterPattern: true })).to.throw(errorMsg)
          await expect(() => Store.keys({ filterPattern: 123 })).to.throw(errorMsg)
          await expect(() => Store.keys({ filterPattern: 0 })).to.throw(errorMsg)
          await expect(() => Store.keys({ filterPattern: NaN })).to.throw(errorMsg)
          await expect(() => Store.keys({ filterPattern: () => undefined })).to.throw(errorMsg)
        })
      })

      describe('Delete', () => {
        it('success with multi keys', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await Store.delete(['testKey1', 'testKey2'])

          expect(request).to.deep.include({
            method : 'DELETE',
            path   : `${APP_PATH}/hive/${hiveName}/key-value`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey1', 'testKey2']
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when key is invalid', async () => {
          const errorMsg = 'Keys must be provided and must be a list of strings.'

          await expect(() => Store.delete(undefined)).to.throw(errorMsg)
          await expect(() => Store.delete(null)).to.throw(errorMsg)
          await expect(() => Store.delete(123)).to.throw(errorMsg)
          await expect(() => Store.delete(0)).to.throw(errorMsg)
          await expect(() => Store.delete(false)).to.throw(errorMsg)
          await expect(() => Store.delete(true)).to.throw(errorMsg)
          await expect(() => Store.delete('')).to.throw(errorMsg)
          await expect(() => Store.delete('key')).to.throw(errorMsg)
          await expect(() => Store.delete(() => undefined)).to.throw(errorMsg)
          await expect(() => Store.delete({})).to.throw(errorMsg)
        })
      })

      describe('Exists', async () => {
        it('success with multi keys', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await Store.exists(['testKey1', 'testKey1'])

          expect(request).to.deep.include({
            method : 'POST',
            path   : `${APP_PATH}/hive/${hiveName}/key-value/action/exists`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey1', 'testKey1']
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when key(s) is invalid', async () => {
          const errorMsg = 'Keys must be provided and must be a list of strings.'

          await expect(() => Store.exists(undefined)).to.throw(errorMsg)
          await expect(() => Store.exists(null)).to.throw(errorMsg)
          await expect(() => Store.exists(false)).to.throw(errorMsg)
          await expect(() => Store.exists(true)).to.throw(errorMsg)
          await expect(() => Store.exists('')).to.throw(errorMsg)
          await expect(() => Store.exists('key')).to.throw(errorMsg)
          await expect(() => Store.exists(0)).to.throw(errorMsg)
          await expect(() => Store.exists(123)).to.throw(errorMsg)
          await expect(() => Store.exists(() => undefined)).to.throw(errorMsg)
          await expect(() => Store.exists({})).to.throw(errorMsg)
        })
      })

      describe('Touch', async () => {
        it('success with multi keys', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await Store.touch(['testKey1', 'testKey1'])

          expect(request).to.deep.include({
            method : 'PUT',
            path   : `${APP_PATH}/hive/${hiveName}/key-value/action/touch`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey1', 'testKey1']
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when key(s) is invalid', async () => {
          const errorMsg = 'Keys must be provided and must be a list of strings.'

          await expect(() => Store.touch(undefined)).to.throw(errorMsg)
          await expect(() => Store.touch(null)).to.throw(errorMsg)
          await expect(() => Store.touch(false)).to.throw(errorMsg)
          await expect(() => Store.touch(true)).to.throw(errorMsg)
          await expect(() => Store.touch('')).to.throw(errorMsg)
          await expect(() => Store.touch('key')).to.throw(errorMsg)
          await expect(() => Store.touch(0)).to.throw(errorMsg)
          await expect(() => Store.touch(123)).to.throw(errorMsg)
          await expect(() => Store.touch(() => undefined)).to.throw(errorMsg)
          await expect(() => Store.touch({})).to.throw(errorMsg)
        })
      })
    })

    describe('Instance Methods ', () => {

      it('fails when init store without key', async () => {
        const errorMsg = 'Store key must be a string.'

        const hive = Backendless.Hive(hiveName)

        await expect(() => hive.KeyValueStore()).to.throw(errorMsg)
        await expect(() => hive.KeyValueStore('')).to.throw(errorMsg)
        await expect(() => hive.KeyValueStore(null)).to.throw(errorMsg)
        await expect(() => hive.KeyValueStore(0)).to.throw(errorMsg)
        await expect(() => hive.KeyValueStore(false)).to.throw(errorMsg)
        await expect(() => hive.KeyValueStore(true)).to.throw(errorMsg)
        await expect(() => hive.KeyValueStore(123)).to.throw(errorMsg)
        await expect(() => hive.KeyValueStore(() => undefined)).to.throw(errorMsg)
        await expect(() => hive.KeyValueStore({})).to.throw(errorMsg)
      })

      describe('Delete', () => {
        it('success with single key', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.delete()

          expect(request).to.deep.include({
            method : 'DELETE',
            path   : `${APP_PATH}/hive/${hiveName}/key-value`,
            headers: { 'Content-Type': 'application/json' },
            body   : [storeKey]
          })

          expect(result).to.be.eql(fakeResult)
        })
      })

      describe('Exists', async () => {
        it('success with single key', async () => {
          const req1 = prepareMockRequest(1)
          const req2 = prepareMockRequest(0)

          const result1 = await store.exists(storeKey)
          const result2 = await store.exists(storeKey)

          expect(req1).to.deep.include({
            method : 'POST',
            path   : `${APP_PATH}/hive/${hiveName}/key-value/action/exists`,
            headers: { 'Content-Type': 'application/json' },
            body   : [storeKey]
          })

          expect(req2).to.deep.include({
            method : 'POST',
            path   : `${APP_PATH}/hive/${hiveName}/key-value/action/exists`,
            headers: { 'Content-Type': 'application/json' },
            body   : [storeKey]
          })

          expect(result1).to.be.eql(true)
          expect(result2).to.be.eql(false)
        })
      })

      describe('Rename', async () => {
        it('rename without overwrite', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.rename('testKey2')

          expect(request).to.deep.include({
            method: 'POST',
            path  : `${APP_PATH}/hive/${hiveName}/key-value/${storeKey}/rename?newKey=testKey2`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('rename with overwrite=true', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.rename('testKey2', true)

          expect(request).to.deep.include({
            method: 'POST',
            path  : `${APP_PATH}/hive/${hiveName}/key-value/${storeKey}/rename?newKey=testKey2&overwrite=true`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('rename with overwrite=false', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.rename('testKey2', false)

          expect(request).to.deep.include({
            method: 'POST',
            path  : `${APP_PATH}/hive/${hiveName}/key-value/${storeKey}/rename?newKey=testKey2&overwrite=false`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when overwrite option is invalid', async () => {
          const errorMsg = 'Overwrite must be a boolean.'

          await expect(() => store.rename('v', null)).to.throw(errorMsg)
          await expect(() => store.rename('v', '')).to.throw(errorMsg)
          await expect(() => store.rename('v', 'foo')).to.throw(errorMsg)
          await expect(() => store.rename('v', 0)).to.throw(errorMsg)
          await expect(() => store.rename('v', 123)).to.throw(errorMsg)
          await expect(() => store.rename('v', () => undefined)).to.throw(errorMsg)
          await expect(() => store.rename('v', {})).to.throw(errorMsg)
          await expect(() => store.rename('v', [])).to.throw(errorMsg)
        })

        it('fails when new key name is invalid', async () => {
          const errorMsg = 'New key name must be provided and must be a string.'

          await expect(() => store.rename(undefined)).to.throw(errorMsg)
          await expect(() => store.rename(null)).to.throw(errorMsg)
          await expect(() => store.rename(false)).to.throw(errorMsg)
          await expect(() => store.rename(true)).to.throw(errorMsg)
          await expect(() => store.rename(0)).to.throw(errorMsg)
          await expect(() => store.rename(123)).to.throw(errorMsg)
          await expect(() => store.rename(() => undefined)).to.throw(errorMsg)
          await expect(() => store.rename({})).to.throw(errorMsg)
        })
      })

      describe('Get Expiration', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.getExpiration()

          expect(request).to.deep.include({
            method: 'GET',
            path  : `${APP_PATH}/hive/${hiveName}/key-value/${storeKey}/get-expiration-ttl`,
          })

          expect(result).to.be.eql(fakeResult)
        })

      })

      describe('Delete Expiration', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.clearExpiration()

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/key-value/${storeKey}/clear-expiration`,
          })

          expect(result).to.be.eql(fakeResult)
        })

      })

      describe('Expire', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.expireAfter(100)

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/key-value/${storeKey}/expire?ttl=100`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when TTL argument is invalid', async () => {
          const errorMsg = 'TTL must be a number.'

          await expect(() => store.expireAfter(undefined)).to.throw(errorMsg)
          await expect(() => store.expireAfter(null)).to.throw(errorMsg)
          await expect(() => store.expireAfter(false)).to.throw(errorMsg)
          await expect(() => store.expireAfter(true)).to.throw(errorMsg)
          await expect(() => store.expireAfter(NaN)).to.throw(errorMsg)
          await expect(() => store.expireAfter(() => undefined)).to.throw(errorMsg)
          await expect(() => store.expireAfter({})).to.throw(errorMsg)
        })
      })

      describe('Expire At', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.expireAt(100)

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/key-value/${storeKey}/expire-at?unixTime=100`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when expiration time is invalid', async () => {
          const errorMsg = 'Expiration time must be a number.'

          await expect(() => store.expireAt(undefined)).to.throw(errorMsg)
          await expect(() => store.expireAt(null)).to.throw(errorMsg)
          await expect(() => store.expireAt(false)).to.throw(errorMsg)
          await expect(() => store.expireAt(true)).to.throw(errorMsg)
          await expect(() => store.expireAt(NaN)).to.throw(errorMsg)
          await expect(() => store.expireAt(() => undefined)).to.throw(errorMsg)
          await expect(() => store.expireAt({})).to.throw(errorMsg)
        })
      })

      describe('Touch', async () => {
        it('success with single key', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.touch()

          expect(request).to.deep.include({
            method : 'PUT',
            path   : `${APP_PATH}/hive/${hiveName}/key-value/action/touch`,
            headers: { 'Content-Type': 'application/json' },
            body   : [storeKey]
          })

          expect(result).to.be.eql(fakeResult)
        })
      })

      describe('SecondsSinceLastOperation', async () => {
        it('success with single key', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.secondsSinceLastOperation()

          expect(request).to.deep.include({
            method: 'GET',
            path  : `${APP_PATH}/hive/${hiveName}/key-value/${storeKey}/seconds-since-last-operation`,
          })

          expect(result).to.be.eql(fakeResult)
        })
      })
    })
  })

  describe('Static Methods', () => {
    describe('Get', () => {

      it('success with multi keys', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await Store.get(['testKey1', 'testKey2'])

        expect(request).to.deep.include({
          method : 'POST',
          path   : `${APP_PATH}/hive/${hiveName}/key-value`,
          headers: { 'Content-Type': 'application/json' },
          body   : ['testKey1', 'testKey2']
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('fails when keys is invalid', async () => {
        const errorMsg = 'Keys must be provided and must be a list of strings.'

        await expect(() => Store.get(undefined)).to.throw(errorMsg)
        await expect(() => Store.get(null)).to.throw(errorMsg)
        await expect(() => Store.get(0)).to.throw(errorMsg)
        await expect(() => Store.get(false)).to.throw(errorMsg)
        await expect(() => Store.get('')).to.throw(errorMsg)
        await expect(() => Store.get('key')).to.throw(errorMsg)
        await expect(() => Store.get(true)).to.throw(errorMsg)
        await expect(() => Store.get(123)).to.throw(errorMsg)
        await expect(() => Store.get(() => undefined)).to.throw(errorMsg)
        await expect(() => Store.get({})).to.throw(errorMsg)
      })
    })

    describe('Set', async () => {

      it('success with single key', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await Store.set('testKey', 'testValue')

        expect(request).to.deep.include({
          method : 'PUT',
          path   : `${APP_PATH}/hive/${hiveName}/key-value/testKey`,
          headers: { 'Content-Type': 'application/json' },
          body   : { value: 'testValue' }
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('success with options', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await Store.set('testKey', 'testValue', {
          ttl      : 100,
          expireAt : 1234567890,
          condition: 'SetIfExists'
        })

        expect(request).to.deep.include({
          method : 'PUT',
          path   : `${APP_PATH}/hive/${hiveName}/key-value/testKey`,
          headers: { 'Content-Type': 'application/json' },
          body   : {
            'value'  : 'testValue',
            ttl      : 100,
            expireAt : 1234567890,
            condition: 'SetIfExists',
          }
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('success with multi keys', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await Store.set({ 'testKey1': 'testValue1', 'testKey2': 'testValue2' })

        expect(request).to.deep.include({
          method : 'PUT',
          path   : `${APP_PATH}/hive/${hiveName}/key-value`,
          headers: { 'Content-Type': 'application/json' },
          body   : {
            'testKey1': 'testValue1',
            'testKey2': 'testValue2',
          }
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('fails when key is invalid', async () => {
        const errorMsg = 'Key must be provided and must be a string.'

        await expect(() => Store.set(undefined, 'testValue')).to.throw(errorMsg)
        await expect(() => Store.set(null, 'testValue')).to.throw(errorMsg)
        await expect(() => Store.set(false, 'testValue')).to.throw(errorMsg)
        await expect(() => Store.set(true, 'testValue')).to.throw(errorMsg)
        await expect(() => Store.set('', 'testValue')).to.throw(errorMsg)
        await expect(() => Store.set(0, 'testValue')).to.throw(errorMsg)
        await expect(() => Store.set(123, 'testValue')).to.throw(errorMsg)
        await expect(() => Store.set(() => undefined), 'testValue').to.throw(errorMsg)
      })

      it('fails when object is empty', async () => {
        const errorMsg = 'Provided object must have at least 1 key.'

        await expect(() => Store.set({})).to.throw(errorMsg)
      })

      it('fails when options is invalid', async () => {
        const errorMsg = 'Options must be an object.'

        await expect(() => Store.set('k', 'v', null)).to.throw(errorMsg)
        await expect(() => Store.set('k', 'v', NaN)).to.throw(errorMsg)
        await expect(() => Store.set('k', 'v', '')).to.throw(errorMsg)
        await expect(() => Store.set('k', 'v', '123')).to.throw(errorMsg)
        await expect(() => Store.set('k', 'v', 123)).to.throw(errorMsg)
        await expect(() => Store.set('k', 'v', 0)).to.throw(errorMsg)
        await expect(() => Store.set('k', 'v', [])).to.throw(errorMsg)
        await expect(() => Store.set('k', 'v', () => undefined)).to.throw(errorMsg)
        await expect(() => Store.set('k', 'v', true)).to.throw(errorMsg)
        await expect(() => Store.set('k', 'v', false)).to.throw(errorMsg)
      })

      it('fails when Expiration TTL Seconds is invalid', async () => {
        const errorMsg = 'TTL in seconds must be a number.'

        await expect(() => Store.set('k', 'v', { ttl: null })).to.throw(errorMsg)
        await expect(() => Store.set('k', 'v', { ttl: false })).to.throw(errorMsg)
        await expect(() => Store.set('k', 'v', { ttl: true })).to.throw(errorMsg)
        await expect(() => Store.set('k', 'v', { ttl: '' })).to.throw(errorMsg)
        await expect(() => Store.set('k', 'v', { ttl: 'foo' })).to.throw(errorMsg)
        await expect(() => Store.set('k', 'v', { ttl: NaN })).to.throw(errorMsg)
        await expect(() => Store.set('k', 'v', { ttl: () => undefined })).to.throw(errorMsg)
      })

      it('fails when Expiration is invalid', async () => {
        const errorMsg = 'ExpireAt timestamp must be a number.'

        await expect(() => Store.set('k', 'v', { expireAt: null })).to.throw(errorMsg)
        await expect(() => Store.set('k', 'v', { expireAt: false })).to.throw(errorMsg)
        await expect(() => Store.set('k', 'v', { expireAt: true })).to.throw(errorMsg)
        await expect(() => Store.set('k', 'v', { expireAt: '' })).to.throw(errorMsg)
        await expect(() => Store.set('k', 'v', { expireAt: 'foo' })).to.throw(errorMsg)
        await expect(() => Store.set('k', 'v', { expireAt: NaN })).to.throw(errorMsg)
        await expect(() => Store.set('k', 'v', { expireAt: () => undefined })).to.throw(errorMsg)
      })

      it('fails when Condition is invalid', async () => {
        const errorMsg = 'Condition must be one of this values: SetIfExists, SetIfNotExists.'

        await expect(() => Store.set('k', 'v', { condition: null })).to.throw(errorMsg)
        await expect(() => Store.set('k', 'v', { condition: false })).to.throw(errorMsg)
        await expect(() => Store.set('k', 'v', { condition: true })).to.throw(errorMsg)
        await expect(() => Store.set('k', 'v', { condition: '' })).to.throw(errorMsg)
        await expect(() => Store.set('k', 'v', { condition: 'foo' })).to.throw(errorMsg)
        await expect(() => Store.set('k', 'v', { condition: NaN })).to.throw(errorMsg)
        await expect(() => Store.set('k', 'v', { condition: () => undefined })).to.throw(errorMsg)
      })
    })
  })

  describe('Instance Methods ', () => {

    describe('Get', () => {
      it('success with single key', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.get()

        expect(request).to.deep.include({
          method: 'GET',
          path  : `${APP_PATH}/hive/${hiveName}/key-value/${storeKey}`,
        })

        expect(result).to.be.eql(fakeResult)
      })
    })

    describe('Set', async () => {
      it('success with single key', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.set('testValue')

        expect(request).to.deep.include({
          method : 'PUT',
          path   : `${APP_PATH}/hive/${hiveName}/key-value/${storeKey}`,
          headers: { 'Content-Type': 'application/json' },
          body   : { value: 'testValue' }
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('success with options', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.set('testValue', {
          ttl      : 100,
          expireAt : 1234567890,
          condition: 'SetIfNotExists'
        })

        expect(request).to.deep.include({
          method : 'PUT',
          path   : `${APP_PATH}/hive/${hiveName}/key-value/${storeKey}`,
          headers: { 'Content-Type': 'application/json' },
          body   : {
            'value'  : 'testValue',
            ttl      : 100,
            expireAt : 1234567890,
            condition: 'SetIfNotExists',
          }
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('fails when options is invalid', async () => {
        const errorMsg = 'Options must be an object.'

        await expect(() => store.set('k', 'v', null)).to.throw(errorMsg)
        await expect(() => store.set('k', 'v', NaN)).to.throw(errorMsg)
        await expect(() => store.set('k', 'v', '')).to.throw(errorMsg)
        await expect(() => store.set('k', 'v', '123')).to.throw(errorMsg)
        await expect(() => store.set('k', 'v', 123)).to.throw(errorMsg)
        await expect(() => store.set('k', 'v', 0)).to.throw(errorMsg)
        await expect(() => store.set('k', 'v', [])).to.throw(errorMsg)
        await expect(() => store.set('k', 'v', () => undefined)).to.throw(errorMsg)
        await expect(() => store.set('k', 'v', true)).to.throw(errorMsg)
        await expect(() => store.set('k', 'v', false)).to.throw(errorMsg)
      })

      it('fails when Expiration Seconds is invalid', async () => {
        const errorMsg = 'TTL in seconds must be a number.'

        await expect(() => store.set('v', { ttl: null })).to.throw(errorMsg)
        await expect(() => store.set('v', { ttl: false })).to.throw(errorMsg)
        await expect(() => store.set('v', { ttl: true })).to.throw(errorMsg)
        await expect(() => store.set('v', { ttl: '' })).to.throw(errorMsg)
        await expect(() => store.set('v', { ttl: 'foo' })).to.throw(errorMsg)
        await expect(() => store.set('v', { ttl: NaN })).to.throw(errorMsg)
        await expect(() => store.set('v', { ttl: () => undefined })).to.throw(errorMsg)
      })

      it('fails when Expiration is invalid', async () => {
        const errorMsg = 'ExpireAt timestamp must be a number.'

        await expect(() => store.set('v', { expireAt: null })).to.throw(errorMsg)
        await expect(() => store.set('v', { expireAt: false })).to.throw(errorMsg)
        await expect(() => store.set('v', { expireAt: true })).to.throw(errorMsg)
        await expect(() => store.set('v', { expireAt: '' })).to.throw(errorMsg)
        await expect(() => store.set('v', { expireAt: 'foo' })).to.throw(errorMsg)
        await expect(() => store.set('v', { expireAt: NaN })).to.throw(errorMsg)
        await expect(() => store.set('v', { expireAt: () => undefined })).to.throw(errorMsg)
      })

      it('fails when Condition is invalid', async () => {
        const errorMsg = 'Condition must be one of this values: SetIfExists, SetIfNotExists.'

        await expect(() => store.set('v', { condition: null })).to.throw(errorMsg)
        await expect(() => store.set('v', { condition: false })).to.throw(errorMsg)
        await expect(() => store.set('v', { condition: true })).to.throw(errorMsg)
        await expect(() => store.set('v', { condition: '' })).to.throw(errorMsg)
        await expect(() => store.set('v', { condition: 'foo' })).to.throw(errorMsg)
        await expect(() => store.set('v', { condition: NaN })).to.throw(errorMsg)
        await expect(() => store.set('v', { condition: () => undefined })).to.throw(errorMsg)
      })
    })

    describe('Increment', () => {
      it('success', async () => {
        store = Backendless.Hive(hiveName).KeyValueStore(storeKey)

        const request = prepareMockRequest(fakeResult)

        const result = await store.increment(10)

        expect(request).to.deep.include({
          method: 'PUT',
          path  : `${APP_PATH}/hive/${hiveName}/key-value/${storeKey}/increment?value=10`,
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('fails when value is invalid', async () => {
        store = Backendless.Hive(hiveName).KeyValueStore(storeKey)

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
        store = Backendless.Hive(hiveName).KeyValueStore(storeKey)

        const request = prepareMockRequest(fakeResult)

        const result = await store.decrement(10)

        expect(request).to.deep.include({
          method: 'PUT',
          path  : `${APP_PATH}/hive/${hiveName}/key-value/${storeKey}/decrement?value=10`,
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('fails when value is invalid', async () => {
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
