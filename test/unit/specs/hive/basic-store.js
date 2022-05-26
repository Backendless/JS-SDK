import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forTest, prepareMockRequest } from '../../helpers/sandbox'
import { HiveTypes } from '../../../../src/hive/constants'
import { HiveStore } from '../../../../src/hive/stores/base-store'

describe('Hive Store Class', function() {
  forTest(this)

  const hiveName = 'test'
  const storeKey = 'testStoreKey'

  const getStoreUrl = storeName => `${APP_PATH}/hive/${hiveName}/${storeName}`

  describe('Store Creating', () => {
    it('without key', async () => {
      const keyValueStore = Backendless.Hive(hiveName).KeyValueStore()
      const listStore = Backendless.Hive(hiveName).ListStore()
      const mapStore = Backendless.Hive(hiveName).MapStore()
      const setStore = Backendless.Hive(hiveName).SetStore()
      const sortedSetStore = Backendless.Hive(hiveName).SortedSetStore()

      expect(keyValueStore).to.be.instanceof(HiveStore)
      expect(keyValueStore.hiveName).to.be.eql(hiveName)
      expect(keyValueStore.storeKey).to.be.eql(undefined)
      expect(keyValueStore.storeUrl).to.be.eql(getStoreUrl(HiveTypes.KEY_VALUE))
      expect(keyValueStore.storeType).to.be.eql(HiveTypes.KEY_VALUE)

      expect(mapStore).to.be.instanceof(HiveStore)
      expect(mapStore.hiveName).to.be.eql(hiveName)
      expect(mapStore.storeKey).to.be.eql(undefined)
      expect(listStore.storeType).to.be.eql(HiveTypes.LIST)
      expect(listStore.storeUrl).to.be.eql(getStoreUrl(HiveTypes.LIST))

      expect(mapStore).to.be.instanceof(HiveStore)
      expect(mapStore.hiveName).to.be.eql(hiveName)
      expect(mapStore.storeKey).to.be.eql(undefined)
      expect(mapStore.storeType).to.be.eql(HiveTypes.MAP)
      expect(mapStore.storeUrl).to.be.eql(getStoreUrl(HiveTypes.MAP))

      expect(setStore).to.be.instanceof(HiveStore)
      expect(setStore.hiveName).to.be.eql(hiveName)
      expect(setStore.storeKey).to.be.eql(undefined)
      expect(setStore.storeType).to.be.eql(HiveTypes.SET)
      expect(setStore.storeUrl).to.be.eql(getStoreUrl(HiveTypes.SET))

      expect(sortedSetStore).to.be.instanceof(HiveStore)
      expect(sortedSetStore.hiveName).to.be.eql(hiveName)
      expect(sortedSetStore.storeKey).to.be.eql(undefined)
      expect(sortedSetStore.storeType).to.be.eql(HiveTypes.SORTED_SET)
      expect(sortedSetStore.storeUrl).to.be.eql(getStoreUrl(HiveTypes.SORTED_SET))
    })

    it('with key', async () => {
      const keyValueStore = Backendless.Hive(hiveName).KeyValueStore(storeKey)
      const listStore = Backendless.Hive(hiveName).ListStore(storeKey)
      const mapStore = Backendless.Hive(hiveName).MapStore(storeKey)
      const setStore = Backendless.Hive(hiveName).SetStore(storeKey)
      const sortedSetStore = Backendless.Hive(hiveName).SortedSetStore(storeKey)

      expect(keyValueStore).to.be.instanceof(HiveStore)
      expect(keyValueStore.hiveName).to.be.eql(hiveName)
      expect(keyValueStore.storeKey).to.be.eql(storeKey)
      expect(keyValueStore.storeUrl).to.be.eql(getStoreUrl(HiveTypes.KEY_VALUE))
      expect(keyValueStore.storeType).to.be.eql(HiveTypes.KEY_VALUE)

      expect(mapStore).to.be.instanceof(HiveStore)
      expect(mapStore.hiveName).to.be.eql(hiveName)
      expect(mapStore.storeKey).to.be.eql(storeKey)
      expect(listStore.storeType).to.be.eql(HiveTypes.LIST)
      expect(listStore.storeUrl).to.be.eql(getStoreUrl(HiveTypes.LIST))

      expect(mapStore).to.be.instanceof(HiveStore)
      expect(mapStore.hiveName).to.be.eql(hiveName)
      expect(mapStore.storeKey).to.be.eql(storeKey)
      expect(mapStore.storeType).to.be.eql(HiveTypes.MAP)
      expect(mapStore.storeUrl).to.be.eql(getStoreUrl(HiveTypes.MAP))

      expect(setStore).to.be.instanceof(HiveStore)
      expect(setStore.hiveName).to.be.eql(hiveName)
      expect(setStore.storeKey).to.be.eql(storeKey)
      expect(setStore.storeType).to.be.eql(HiveTypes.SET)
      expect(setStore.storeUrl).to.be.eql(getStoreUrl(HiveTypes.SET))

      expect(sortedSetStore).to.be.instanceof(HiveStore)
      expect(sortedSetStore.hiveName).to.be.eql(hiveName)
      expect(sortedSetStore.storeKey).to.be.eql(storeKey)
      expect(sortedSetStore.storeType).to.be.eql(HiveTypes.SORTED_SET)
      expect(sortedSetStore.storeUrl).to.be.eql(getStoreUrl(HiveTypes.SORTED_SET))
    })

    it('fails with invalid store key', async () => {
      const errorMsg = 'Store key must be a string.'

      const hive = Backendless.Hive(hiveName)

      await expect(() => hive.KeyValueStore(null)).to.throw(errorMsg)
      await expect(() => hive.KeyValueStore(0)).to.throw(errorMsg)
      await expect(() => hive.KeyValueStore(false)).to.throw(errorMsg)
      await expect(() => hive.KeyValueStore(true)).to.throw(errorMsg)
      await expect(() => hive.KeyValueStore(123)).to.throw(errorMsg)
      await expect(() => hive.KeyValueStore(() => undefined)).to.throw(errorMsg)
      await expect(() => hive.KeyValueStore({})).to.throw(errorMsg)

      await expect(() => hive.ListStore(null)).to.throw(errorMsg)
      await expect(() => hive.ListStore(0)).to.throw(errorMsg)
      await expect(() => hive.ListStore(false)).to.throw(errorMsg)
      await expect(() => hive.ListStore(true)).to.throw(errorMsg)
      await expect(() => hive.ListStore(123)).to.throw(errorMsg)
      await expect(() => hive.ListStore(() => undefined)).to.throw(errorMsg)
      await expect(() => hive.ListStore({})).to.throw(errorMsg)

      await expect(() => hive.MapStore(null)).to.throw(errorMsg)
      await expect(() => hive.MapStore(0)).to.throw(errorMsg)
      await expect(() => hive.MapStore(false)).to.throw(errorMsg)
      await expect(() => hive.MapStore(true)).to.throw(errorMsg)
      await expect(() => hive.MapStore(123)).to.throw(errorMsg)
      await expect(() => hive.MapStore(() => undefined)).to.throw(errorMsg)
      await expect(() => hive.MapStore({})).to.throw(errorMsg)

      await expect(() => hive.SetStore(null)).to.throw(errorMsg)
      await expect(() => hive.SetStore(0)).to.throw(errorMsg)
      await expect(() => hive.SetStore(false)).to.throw(errorMsg)
      await expect(() => hive.SetStore(true)).to.throw(errorMsg)
      await expect(() => hive.SetStore(123)).to.throw(errorMsg)
      await expect(() => hive.SetStore(() => undefined)).to.throw(errorMsg)
      await expect(() => hive.SetStore({})).to.throw(errorMsg)

      await expect(() => hive.SortedSetStore(null)).to.throw(errorMsg)
      await expect(() => hive.SortedSetStore(0)).to.throw(errorMsg)
      await expect(() => hive.SortedSetStore(false)).to.throw(errorMsg)
      await expect(() => hive.SortedSetStore(true)).to.throw(errorMsg)
      await expect(() => hive.SortedSetStore(123)).to.throw(errorMsg)
      await expect(() => hive.SortedSetStore(() => undefined)).to.throw(errorMsg)
      await expect(() => hive.SortedSetStore({})).to.throw(errorMsg)
    })
  })

  describe('Basic Methods', () => {
    const fakeResult = { foo: true }

    describe('Key Value', () => {
      const storeUrl = getStoreUrl(HiveTypes.KEY_VALUE)

      let store

      beforeEach(() => {
        store = Backendless.Hive(hiveName).KeyValueStore()
      })

      describe('Store Keys', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.storeKeys()

          expect(req1).to.deep.include({
            method: 'GET',
            path  : `${storeUrl}/keys`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('success with options', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.storeKeys({
            filterPattern: '123',
            cursor       : 20,
            pageSize     : 30
          })

          expect(req1).to.deep.include({
            method: 'GET',
            path  : `${storeUrl}/keys?filterPattern=123&cursor=20&pageSize=30`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when options is invalid', async () => {
          const errorMsg1 = 'Cursor must be a number.'

          await expect(() => store.storeKeys({ cursor: null })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: false })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: true })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: '' })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: 'foo' })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: NaN })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: () => undefined })).to.throw(errorMsg1)

          const errorMsg2 = 'Page size must be a number.'

          await expect(() => store.storeKeys({ pageSize: null })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: false })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: true })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: '' })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: 'foo' })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: NaN })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: () => undefined })).to.throw(errorMsg2)

          const errorMsg3 = 'Filter pattern must be a string.'

          await expect(() => store.storeKeys({ filterPattern: null })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: false })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: true })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: 123 })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: 0 })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: NaN })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: () => undefined })).to.throw(errorMsg3)
        })
      })

      describe('Delete', () => {
        it('success with single key', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.delete('testKey')

          expect(req1).to.deep.include({
            method : 'DELETE',
            path   : `${storeUrl}`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('success with multi keys', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.delete(['testKey1', 'testKey2'])

          expect(req1).to.deep.include({
            method : 'DELETE',
            path   : `${storeUrl}`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey1', 'testKey2']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key is invalid', async () => {
          const errorMsg = 'Key(s) must be provided and must be a string or list of strings.'

          await expect(() => store.delete(undefined)).to.throw(errorMsg)
          await expect(() => store.delete(null)).to.throw(errorMsg)
          await expect(() => store.delete(0)).to.throw(errorMsg)
          await expect(() => store.delete(false)).to.throw(errorMsg)
          await expect(() => store.delete('')).to.throw(errorMsg)
          await expect(() => store.delete(true)).to.throw(errorMsg)
          await expect(() => store.delete(123)).to.throw(errorMsg)
          await expect(() => store.delete(() => undefined)).to.throw(errorMsg)
          await expect(() => store.delete({})).to.throw(errorMsg)
        })
      })

      describe('Exists', async () => {
        it('success with single key', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.exists('testKey')

          expect(req1).to.deep.include({
            method : 'POST',
            path   : `${storeUrl}/exists`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('success with multi keys', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.exists(['testKey1', 'testKey1'])

          expect(req1).to.deep.include({
            method : 'POST',
            path   : `${storeUrl}/exists`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey1', 'testKey1']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key(s) is invalid', async () => {
          const errorMsg = 'Key(s) must be provided and must be a string or list of strings.'

          await expect(() => store.exists(undefined)).to.throw(errorMsg)
          await expect(() => store.exists(null)).to.throw(errorMsg)
          await expect(() => store.exists(false)).to.throw(errorMsg)
          await expect(() => store.exists(0)).to.throw(errorMsg)
          await expect(() => store.exists(true)).to.throw(errorMsg)
          await expect(() => store.exists(123)).to.throw(errorMsg)
          await expect(() => store.exists(() => undefined)).to.throw(errorMsg)
          await expect(() => store.exists({})).to.throw(errorMsg)
        })
      })

      describe('Rename', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.rename('testKey1', 'testKey2')

          expect(req1).to.deep.include({
            method: 'PUT',
            path  : `${storeUrl}/testKey1/rename?newKey=testKey2`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg1 = 'New key name must be provided and must be a string.'
          const errorMsg2 = 'Old key name must be provided and must be a string.'

          await expect(() => store.rename('test', undefined)).to.throw(errorMsg1)
          await expect(() => store.rename('test', null)).to.throw(errorMsg1)
          await expect(() => store.rename('test', false)).to.throw(errorMsg1)
          await expect(() => store.rename('test', true)).to.throw(errorMsg1)
          await expect(() => store.rename('test', 0)).to.throw(errorMsg1)
          await expect(() => store.rename('test', 123)).to.throw(errorMsg1)
          await expect(() => store.rename('test', () => undefined)).to.throw(errorMsg1)
          await expect(() => store.rename('test', {})).to.throw(errorMsg1)

          await expect(() => store.rename(undefined)).to.throw(errorMsg2)
          await expect(() => store.rename(null)).to.throw(errorMsg2)
          await expect(() => store.rename(false)).to.throw(errorMsg2)
          await expect(() => store.rename(true)).to.throw(errorMsg2)
          await expect(() => store.rename(0)).to.throw(errorMsg2)
          await expect(() => store.rename(123)).to.throw(errorMsg2)
          await expect(() => store.rename(() => undefined)).to.throw(errorMsg2)
          await expect(() => store.rename({})).to.throw(errorMsg2)
        })
      })

      describe('Rename If Not Exists', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.renameIfNotExists('testKey1', 'testKey2')

          expect(req1).to.deep.include({
            method: 'PUT',
            path  : `${storeUrl}/testKey1/rename-if-not-exists?newKey=testKey2`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg1 = 'New key name must be provided and must be a string.'
          const errorMsg2 = 'Old key name must be provided and must be a string.'

          await expect(() => store.renameIfNotExists('test', undefined)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', null)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', false)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', true)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', 0)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', 123)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', () => undefined)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', {})).to.throw(errorMsg1)

          await expect(() => store.renameIfNotExists(undefined)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(null)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(false)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(true)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(0)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(123)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(() => undefined)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists({})).to.throw(errorMsg2)
        })
      })

      describe('Get Expiration', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.getExpiration('testKey1')

          expect(req1).to.deep.include({
            method: 'GET',
            path  : `${storeUrl}/testKey1/get-expiration-ttl`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg = 'Key must be provided and must be a string.'

          await expect(() => store.getExpiration(undefined)).to.throw(errorMsg)
          await expect(() => store.getExpiration(null)).to.throw(errorMsg)
          await expect(() => store.getExpiration(false)).to.throw(errorMsg)
          await expect(() => store.getExpiration(true)).to.throw(errorMsg)
          await expect(() => store.getExpiration(0)).to.throw(errorMsg)
          await expect(() => store.getExpiration(123)).to.throw(errorMsg)
          await expect(() => store.getExpiration(() => undefined)).to.throw(errorMsg)
          await expect(() => store.getExpiration({})).to.throw(errorMsg)
        })
      })

      it('Remove Expiration', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.removeExpiration('testKey1')

          expect(req1).to.deep.include({
            method: 'PUT',
            path  : `${storeUrl}/testKey1/remove-expiration`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg = 'Key must be provided and must be a string.'

          await expect(() => store.removeExpiration(undefined)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(null)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(false)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(true)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(0)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(123)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(() => undefined)).to.throw(errorMsg)
          await expect(() => store.removeExpiration({})).to.throw(errorMsg)
        })
      })

      describe('Expire', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.expire('testKey1', 100)

          expect(req1).to.deep.include({
            method: 'PUT',
            path  : `${storeUrl}/testKey1/expire?ttl=100`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg1 = 'Key must be provided and must be a string.'

          await expect(() => store.expire(undefined)).to.throw(errorMsg1)
          await expect(() => store.expire(null)).to.throw(errorMsg1)
          await expect(() => store.expire(false)).to.throw(errorMsg1)
          await expect(() => store.expire(true)).to.throw(errorMsg1)
          await expect(() => store.expire(0)).to.throw(errorMsg1)
          await expect(() => store.expire(123)).to.throw(errorMsg1)
          await expect(() => store.expire(() => undefined)).to.throw(errorMsg1)
          await expect(() => store.expire({})).to.throw(errorMsg1)

          const errorMsg2 = 'TTL must be a number.'

          await expect(() => store.expire('test', undefined)).to.throw(errorMsg2)
          await expect(() => store.expire('test', null)).to.throw(errorMsg2)
          await expect(() => store.expire('test', false)).to.throw(errorMsg2)
          await expect(() => store.expire('test', true)).to.throw(errorMsg2)
          await expect(() => store.expire('test', NaN)).to.throw(errorMsg2)
          await expect(() => store.expire('test', () => undefined)).to.throw(errorMsg2)
          await expect(() => store.expire('test', {})).to.throw(errorMsg2)
        })
      })

      describe('Expire At', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.expireAt('testKey1', 100)

          expect(req1).to.deep.include({
            method: 'PUT',
            path  : `${storeUrl}/testKey1/expire-at?unixTime=100`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg1 = 'Key must be provided and must be a string.'

          await expect(() => store.expireAt(undefined)).to.throw(errorMsg1)
          await expect(() => store.expireAt(null)).to.throw(errorMsg1)
          await expect(() => store.expireAt(false)).to.throw(errorMsg1)
          await expect(() => store.expireAt(true)).to.throw(errorMsg1)
          await expect(() => store.expireAt(0)).to.throw(errorMsg1)
          await expect(() => store.expireAt(123)).to.throw(errorMsg1)
          await expect(() => store.expireAt(() => undefined)).to.throw(errorMsg1)
          await expect(() => store.expireAt({})).to.throw(errorMsg1)

          const errorMsg2 = 'Expiration time must be a number.'

          await expect(() => store.expireAt('test', undefined)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', null)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', false)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', true)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', NaN)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', () => undefined)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', {})).to.throw(errorMsg2)
        })
      })

      describe('Touch', async () => {
        it('success with single key', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.touch('testKey')

          expect(req1).to.deep.include({
            method : 'PUT',
            path   : `${storeUrl}/touch`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('success with multi keys', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.touch(['testKey1', 'testKey1'])

          expect(req1).to.deep.include({
            method : 'PUT',
            path   : `${storeUrl}/touch`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey1', 'testKey1']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key(s) is invalid', async () => {
          const errorMsg = 'Key(s) must be provided and must be a string or list of strings.'

          await expect(() => store.touch(undefined)).to.throw(errorMsg)
          await expect(() => store.touch(null)).to.throw(errorMsg)
          await expect(() => store.touch(false)).to.throw(errorMsg)
          await expect(() => store.touch(0)).to.throw(errorMsg)
          await expect(() => store.touch(true)).to.throw(errorMsg)
          await expect(() => store.touch(123)).to.throw(errorMsg)
          await expect(() => store.touch(() => undefined)).to.throw(errorMsg)
          await expect(() => store.touch({})).to.throw(errorMsg)
        })
      })
    })

    describe('List', () => {
      const storeUrl = getStoreUrl(HiveTypes.LIST)

      let store

      beforeEach(() => {
        store = Backendless.Hive(hiveName).ListStore()
      })

      describe('Store Keys', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.storeKeys()

          expect(req1).to.deep.include({
            method: 'GET',
            path  : `${storeUrl}/keys`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('success with options', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.storeKeys({
            filterPattern: '123',
            cursor       : 20,
            pageSize     : 30
          })

          expect(req1).to.deep.include({
            method: 'GET',
            path  : `${storeUrl}/keys?filterPattern=123&cursor=20&pageSize=30`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when options is invalid', async () => {
          const errorMsg1 = 'Cursor must be a number.'

          await expect(() => store.storeKeys({ cursor: null })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: false })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: true })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: '' })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: 'foo' })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: NaN })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: () => undefined })).to.throw(errorMsg1)

          const errorMsg2 = 'Page size must be a number.'

          await expect(() => store.storeKeys({ pageSize: null })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: false })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: true })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: '' })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: 'foo' })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: NaN })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: () => undefined })).to.throw(errorMsg2)

          const errorMsg3 = 'Filter pattern must be a string.'

          await expect(() => store.storeKeys({ filterPattern: null })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: false })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: true })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: 123 })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: 0 })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: NaN })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: () => undefined })).to.throw(errorMsg3)
        })
      })

      describe('Delete', () => {
        it('success with single key', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.delete('testKey')

          expect(req1).to.deep.include({
            method : 'DELETE',
            path   : `${storeUrl}`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('success with multi keys', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.delete(['testKey1', 'testKey2'])

          expect(req1).to.deep.include({
            method : 'DELETE',
            path   : `${storeUrl}`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey1', 'testKey2']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key is invalid', async () => {
          const errorMsg = 'Key(s) must be provided and must be a string or list of strings.'

          await expect(() => store.delete(undefined)).to.throw(errorMsg)
          await expect(() => store.delete(null)).to.throw(errorMsg)
          await expect(() => store.delete(0)).to.throw(errorMsg)
          await expect(() => store.delete(false)).to.throw(errorMsg)
          await expect(() => store.delete('')).to.throw(errorMsg)
          await expect(() => store.delete(true)).to.throw(errorMsg)
          await expect(() => store.delete(123)).to.throw(errorMsg)
          await expect(() => store.delete(() => undefined)).to.throw(errorMsg)
          await expect(() => store.delete({})).to.throw(errorMsg)
        })
      })

      describe('Exists', async () => {
        it('success with single key', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.exists('testKey')

          expect(req1).to.deep.include({
            method : 'POST',
            path   : `${storeUrl}/exists`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('success with multi keys', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.exists(['testKey1', 'testKey1'])

          expect(req1).to.deep.include({
            method : 'POST',
            path   : `${storeUrl}/exists`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey1', 'testKey1']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key(s) is invalid', async () => {
          const errorMsg = 'Key(s) must be provided and must be a string or list of strings.'

          await expect(() => store.exists(undefined)).to.throw(errorMsg)
          await expect(() => store.exists(null)).to.throw(errorMsg)
          await expect(() => store.exists(false)).to.throw(errorMsg)
          await expect(() => store.exists(0)).to.throw(errorMsg)
          await expect(() => store.exists(true)).to.throw(errorMsg)
          await expect(() => store.exists(123)).to.throw(errorMsg)
          await expect(() => store.exists(() => undefined)).to.throw(errorMsg)
          await expect(() => store.exists({})).to.throw(errorMsg)
        })
      })

      describe('Rename', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.rename('testKey1', 'testKey2')

          expect(req1).to.deep.include({
            method: 'PUT',
            path  : `${storeUrl}/testKey1/rename?newKey=testKey2`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg1 = 'New key name must be provided and must be a string.'
          const errorMsg2 = 'Old key name must be provided and must be a string.'

          await expect(() => store.rename('test', undefined)).to.throw(errorMsg1)
          await expect(() => store.rename('test', null)).to.throw(errorMsg1)
          await expect(() => store.rename('test', false)).to.throw(errorMsg1)
          await expect(() => store.rename('test', true)).to.throw(errorMsg1)
          await expect(() => store.rename('test', 0)).to.throw(errorMsg1)
          await expect(() => store.rename('test', 123)).to.throw(errorMsg1)
          await expect(() => store.rename('test', () => undefined)).to.throw(errorMsg1)
          await expect(() => store.rename('test', {})).to.throw(errorMsg1)

          await expect(() => store.rename(undefined)).to.throw(errorMsg2)
          await expect(() => store.rename(null)).to.throw(errorMsg2)
          await expect(() => store.rename(false)).to.throw(errorMsg2)
          await expect(() => store.rename(true)).to.throw(errorMsg2)
          await expect(() => store.rename(0)).to.throw(errorMsg2)
          await expect(() => store.rename(123)).to.throw(errorMsg2)
          await expect(() => store.rename(() => undefined)).to.throw(errorMsg2)
          await expect(() => store.rename({})).to.throw(errorMsg2)
        })
      })

      describe('Rename If Not Exists', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.renameIfNotExists('testKey1', 'testKey2')

          expect(req1).to.deep.include({
            method: 'PUT',
            path  : `${storeUrl}/testKey1/rename-if-not-exists?newKey=testKey2`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg1 = 'New key name must be provided and must be a string.'
          const errorMsg2 = 'Old key name must be provided and must be a string.'

          await expect(() => store.renameIfNotExists('test', undefined)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', null)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', false)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', true)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', 0)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', 123)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', () => undefined)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', {})).to.throw(errorMsg1)

          await expect(() => store.renameIfNotExists(undefined)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(null)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(false)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(true)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(0)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(123)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(() => undefined)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists({})).to.throw(errorMsg2)
        })
      })

      describe('Get Expiration', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.getExpiration('testKey1')

          expect(req1).to.deep.include({
            method: 'GET',
            path  : `${storeUrl}/testKey1/get-expiration-ttl`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg = 'Key must be provided and must be a string.'

          await expect(() => store.getExpiration(undefined)).to.throw(errorMsg)
          await expect(() => store.getExpiration(null)).to.throw(errorMsg)
          await expect(() => store.getExpiration(false)).to.throw(errorMsg)
          await expect(() => store.getExpiration(true)).to.throw(errorMsg)
          await expect(() => store.getExpiration(0)).to.throw(errorMsg)
          await expect(() => store.getExpiration(123)).to.throw(errorMsg)
          await expect(() => store.getExpiration(() => undefined)).to.throw(errorMsg)
          await expect(() => store.getExpiration({})).to.throw(errorMsg)
        })
      })

      it('Remove Expiration', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.removeExpiration('testKey1')

          expect(req1).to.deep.include({
            method: 'PUT',
            path  : `${storeUrl}/testKey1/remove-expiration`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg = 'Key must be provided and must be a string.'

          await expect(() => store.removeExpiration(undefined)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(null)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(false)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(true)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(0)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(123)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(() => undefined)).to.throw(errorMsg)
          await expect(() => store.removeExpiration({})).to.throw(errorMsg)
        })
      })

      describe('Expire', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.expire('testKey1', 100)

          expect(req1).to.deep.include({
            method: 'PUT',
            path  : `${storeUrl}/testKey1/expire?ttl=100`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg1 = 'Key must be provided and must be a string.'

          await expect(() => store.expire(undefined)).to.throw(errorMsg1)
          await expect(() => store.expire(null)).to.throw(errorMsg1)
          await expect(() => store.expire(false)).to.throw(errorMsg1)
          await expect(() => store.expire(true)).to.throw(errorMsg1)
          await expect(() => store.expire(0)).to.throw(errorMsg1)
          await expect(() => store.expire(123)).to.throw(errorMsg1)
          await expect(() => store.expire(() => undefined)).to.throw(errorMsg1)
          await expect(() => store.expire({})).to.throw(errorMsg1)

          const errorMsg2 = 'TTL must be a number.'

          await expect(() => store.expire('test', undefined)).to.throw(errorMsg2)
          await expect(() => store.expire('test', null)).to.throw(errorMsg2)
          await expect(() => store.expire('test', false)).to.throw(errorMsg2)
          await expect(() => store.expire('test', true)).to.throw(errorMsg2)
          await expect(() => store.expire('test', NaN)).to.throw(errorMsg2)
          await expect(() => store.expire('test', () => undefined)).to.throw(errorMsg2)
          await expect(() => store.expire('test', {})).to.throw(errorMsg2)
        })
      })

      describe('Expire At', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.expireAt('testKey1', 100)

          expect(req1).to.deep.include({
            method: 'PUT',
            path  : `${storeUrl}/testKey1/expire-at?unixTime=100`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg1 = 'Key must be provided and must be a string.'

          await expect(() => store.expireAt(undefined)).to.throw(errorMsg1)
          await expect(() => store.expireAt(null)).to.throw(errorMsg1)
          await expect(() => store.expireAt(false)).to.throw(errorMsg1)
          await expect(() => store.expireAt(true)).to.throw(errorMsg1)
          await expect(() => store.expireAt(0)).to.throw(errorMsg1)
          await expect(() => store.expireAt(123)).to.throw(errorMsg1)
          await expect(() => store.expireAt(() => undefined)).to.throw(errorMsg1)
          await expect(() => store.expireAt({})).to.throw(errorMsg1)

          const errorMsg2 = 'Expiration time must be a number.'

          await expect(() => store.expireAt('test', undefined)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', null)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', false)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', true)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', NaN)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', () => undefined)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', {})).to.throw(errorMsg2)
        })
      })

      describe('Touch', async () => {
        it('success with single key', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.touch('testKey')

          expect(req1).to.deep.include({
            method : 'PUT',
            path   : `${storeUrl}/touch`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('success with multi keys', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.touch(['testKey1', 'testKey1'])

          expect(req1).to.deep.include({
            method : 'PUT',
            path   : `${storeUrl}/touch`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey1', 'testKey1']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key(s) is invalid', async () => {
          const errorMsg = 'Key(s) must be provided and must be a string or list of strings.'

          await expect(() => store.touch(undefined)).to.throw(errorMsg)
          await expect(() => store.touch(null)).to.throw(errorMsg)
          await expect(() => store.touch(false)).to.throw(errorMsg)
          await expect(() => store.touch(0)).to.throw(errorMsg)
          await expect(() => store.touch(true)).to.throw(errorMsg)
          await expect(() => store.touch(123)).to.throw(errorMsg)
          await expect(() => store.touch(() => undefined)).to.throw(errorMsg)
          await expect(() => store.touch({})).to.throw(errorMsg)
        })
      })
    })

    describe('Map', () => {
      const storeUrl = getStoreUrl(HiveTypes.MAP)

      let store

      beforeEach(() => {
        store = Backendless.Hive(hiveName).MapStore()
      })

      describe('Store Keys', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.storeKeys()

          expect(req1).to.deep.include({
            method: 'GET',
            path  : `${storeUrl}/keys`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('success with options', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.storeKeys({
            filterPattern: '123',
            cursor       : 20,
            pageSize     : 30
          })

          expect(req1).to.deep.include({
            method: 'GET',
            path  : `${storeUrl}/keys?filterPattern=123&cursor=20&pageSize=30`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when options is invalid', async () => {
          const errorMsg1 = 'Cursor must be a number.'

          await expect(() => store.storeKeys({ cursor: null })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: false })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: true })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: '' })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: 'foo' })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: NaN })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: () => undefined })).to.throw(errorMsg1)

          const errorMsg2 = 'Page size must be a number.'

          await expect(() => store.storeKeys({ pageSize: null })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: false })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: true })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: '' })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: 'foo' })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: NaN })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: () => undefined })).to.throw(errorMsg2)

          const errorMsg3 = 'Filter pattern must be a string.'

          await expect(() => store.storeKeys({ filterPattern: null })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: false })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: true })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: 123 })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: 0 })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: NaN })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: () => undefined })).to.throw(errorMsg3)
        })
      })

      describe('Delete', () => {
        it('success with single key', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.delete('testKey')

          expect(req1).to.deep.include({
            method : 'DELETE',
            path   : `${storeUrl}`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('success with multi keys', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.delete(['testKey1', 'testKey2'])

          expect(req1).to.deep.include({
            method : 'DELETE',
            path   : `${storeUrl}`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey1', 'testKey2']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key is invalid', async () => {
          const errorMsg = 'Key(s) must be provided and must be a string or list of strings.'

          await expect(() => store.delete(undefined)).to.throw(errorMsg)
          await expect(() => store.delete(null)).to.throw(errorMsg)
          await expect(() => store.delete(0)).to.throw(errorMsg)
          await expect(() => store.delete(false)).to.throw(errorMsg)
          await expect(() => store.delete('')).to.throw(errorMsg)
          await expect(() => store.delete(true)).to.throw(errorMsg)
          await expect(() => store.delete(123)).to.throw(errorMsg)
          await expect(() => store.delete(() => undefined)).to.throw(errorMsg)
          await expect(() => store.delete({})).to.throw(errorMsg)
        })
      })

      describe('Exists', async () => {
        it('success with single key', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.exists('testKey')

          expect(req1).to.deep.include({
            method : 'POST',
            path   : `${storeUrl}/exists`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('success with multi keys', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.exists(['testKey1', 'testKey1'])

          expect(req1).to.deep.include({
            method : 'POST',
            path   : `${storeUrl}/exists`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey1', 'testKey1']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key(s) is invalid', async () => {
          const errorMsg = 'Key(s) must be provided and must be a string or list of strings.'

          await expect(() => store.exists(undefined)).to.throw(errorMsg)
          await expect(() => store.exists(null)).to.throw(errorMsg)
          await expect(() => store.exists(false)).to.throw(errorMsg)
          await expect(() => store.exists(0)).to.throw(errorMsg)
          await expect(() => store.exists(true)).to.throw(errorMsg)
          await expect(() => store.exists(123)).to.throw(errorMsg)
          await expect(() => store.exists(() => undefined)).to.throw(errorMsg)
          await expect(() => store.exists({})).to.throw(errorMsg)
        })
      })

      describe('Rename', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.rename('testKey1', 'testKey2')

          expect(req1).to.deep.include({
            method: 'PUT',
            path  : `${storeUrl}/testKey1/rename?newKey=testKey2`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg1 = 'New key name must be provided and must be a string.'
          const errorMsg2 = 'Old key name must be provided and must be a string.'

          await expect(() => store.rename('test', undefined)).to.throw(errorMsg1)
          await expect(() => store.rename('test', null)).to.throw(errorMsg1)
          await expect(() => store.rename('test', false)).to.throw(errorMsg1)
          await expect(() => store.rename('test', true)).to.throw(errorMsg1)
          await expect(() => store.rename('test', 0)).to.throw(errorMsg1)
          await expect(() => store.rename('test', 123)).to.throw(errorMsg1)
          await expect(() => store.rename('test', () => undefined)).to.throw(errorMsg1)
          await expect(() => store.rename('test', {})).to.throw(errorMsg1)

          await expect(() => store.rename(undefined)).to.throw(errorMsg2)
          await expect(() => store.rename(null)).to.throw(errorMsg2)
          await expect(() => store.rename(false)).to.throw(errorMsg2)
          await expect(() => store.rename(true)).to.throw(errorMsg2)
          await expect(() => store.rename(0)).to.throw(errorMsg2)
          await expect(() => store.rename(123)).to.throw(errorMsg2)
          await expect(() => store.rename(() => undefined)).to.throw(errorMsg2)
          await expect(() => store.rename({})).to.throw(errorMsg2)
        })
      })

      describe('Rename If Not Exists', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.renameIfNotExists('testKey1', 'testKey2')

          expect(req1).to.deep.include({
            method: 'PUT',
            path  : `${storeUrl}/testKey1/rename-if-not-exists?newKey=testKey2`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg1 = 'New key name must be provided and must be a string.'
          const errorMsg2 = 'Old key name must be provided and must be a string.'

          await expect(() => store.renameIfNotExists('test', undefined)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', null)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', false)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', true)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', 0)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', 123)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', () => undefined)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', {})).to.throw(errorMsg1)

          await expect(() => store.renameIfNotExists(undefined)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(null)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(false)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(true)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(0)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(123)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(() => undefined)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists({})).to.throw(errorMsg2)
        })
      })

      describe('Get Expiration', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.getExpiration('testKey1')

          expect(req1).to.deep.include({
            method: 'GET',
            path  : `${storeUrl}/testKey1/get-expiration-ttl`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg = 'Key must be provided and must be a string.'

          await expect(() => store.getExpiration(undefined)).to.throw(errorMsg)
          await expect(() => store.getExpiration(null)).to.throw(errorMsg)
          await expect(() => store.getExpiration(false)).to.throw(errorMsg)
          await expect(() => store.getExpiration(true)).to.throw(errorMsg)
          await expect(() => store.getExpiration(0)).to.throw(errorMsg)
          await expect(() => store.getExpiration(123)).to.throw(errorMsg)
          await expect(() => store.getExpiration(() => undefined)).to.throw(errorMsg)
          await expect(() => store.getExpiration({})).to.throw(errorMsg)
        })
      })

      it('Remove Expiration', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.removeExpiration('testKey1')

          expect(req1).to.deep.include({
            method: 'PUT',
            path  : `${storeUrl}/testKey1/remove-expiration`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg = 'Key must be provided and must be a string.'

          await expect(() => store.removeExpiration(undefined)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(null)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(false)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(true)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(0)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(123)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(() => undefined)).to.throw(errorMsg)
          await expect(() => store.removeExpiration({})).to.throw(errorMsg)
        })
      })

      describe('Expire', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.expire('testKey1', 100)

          expect(req1).to.deep.include({
            method: 'PUT',
            path  : `${storeUrl}/testKey1/expire?ttl=100`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg1 = 'Key must be provided and must be a string.'

          await expect(() => store.expire(undefined)).to.throw(errorMsg1)
          await expect(() => store.expire(null)).to.throw(errorMsg1)
          await expect(() => store.expire(false)).to.throw(errorMsg1)
          await expect(() => store.expire(true)).to.throw(errorMsg1)
          await expect(() => store.expire(0)).to.throw(errorMsg1)
          await expect(() => store.expire(123)).to.throw(errorMsg1)
          await expect(() => store.expire(() => undefined)).to.throw(errorMsg1)
          await expect(() => store.expire({})).to.throw(errorMsg1)

          const errorMsg2 = 'TTL must be a number.'

          await expect(() => store.expire('test', undefined)).to.throw(errorMsg2)
          await expect(() => store.expire('test', null)).to.throw(errorMsg2)
          await expect(() => store.expire('test', false)).to.throw(errorMsg2)
          await expect(() => store.expire('test', true)).to.throw(errorMsg2)
          await expect(() => store.expire('test', NaN)).to.throw(errorMsg2)
          await expect(() => store.expire('test', () => undefined)).to.throw(errorMsg2)
          await expect(() => store.expire('test', {})).to.throw(errorMsg2)
        })
      })

      describe('Expire At', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.expireAt('testKey1', 100)

          expect(req1).to.deep.include({
            method: 'PUT',
            path  : `${storeUrl}/testKey1/expire-at?unixTime=100`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg1 = 'Key must be provided and must be a string.'

          await expect(() => store.expireAt(undefined)).to.throw(errorMsg1)
          await expect(() => store.expireAt(null)).to.throw(errorMsg1)
          await expect(() => store.expireAt(false)).to.throw(errorMsg1)
          await expect(() => store.expireAt(true)).to.throw(errorMsg1)
          await expect(() => store.expireAt(0)).to.throw(errorMsg1)
          await expect(() => store.expireAt(123)).to.throw(errorMsg1)
          await expect(() => store.expireAt(() => undefined)).to.throw(errorMsg1)
          await expect(() => store.expireAt({})).to.throw(errorMsg1)

          const errorMsg2 = 'Expiration time must be a number.'

          await expect(() => store.expireAt('test', undefined)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', null)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', false)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', true)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', NaN)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', () => undefined)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', {})).to.throw(errorMsg2)
        })
      })

      describe('Touch', async () => {
        it('success with single key', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.touch('testKey')

          expect(req1).to.deep.include({
            method : 'PUT',
            path   : `${storeUrl}/touch`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('success with multi keys', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.touch(['testKey1', 'testKey1'])

          expect(req1).to.deep.include({
            method : 'PUT',
            path   : `${storeUrl}/touch`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey1', 'testKey1']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key(s) is invalid', async () => {
          const errorMsg = 'Key(s) must be provided and must be a string or list of strings.'

          await expect(() => store.touch(undefined)).to.throw(errorMsg)
          await expect(() => store.touch(null)).to.throw(errorMsg)
          await expect(() => store.touch(false)).to.throw(errorMsg)
          await expect(() => store.touch(0)).to.throw(errorMsg)
          await expect(() => store.touch(true)).to.throw(errorMsg)
          await expect(() => store.touch(123)).to.throw(errorMsg)
          await expect(() => store.touch(() => undefined)).to.throw(errorMsg)
          await expect(() => store.touch({})).to.throw(errorMsg)
        })
      })
    })

    describe('Set', () => {
      const storeUrl = getStoreUrl(HiveTypes.SET)

      let store

      beforeEach(() => {
        store = Backendless.Hive(hiveName).SetStore()
      })

      describe('Store Keys', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.storeKeys()

          expect(req1).to.deep.include({
            method: 'GET',
            path  : `${storeUrl}/keys`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('success with options', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.storeKeys({
            filterPattern: '123',
            cursor       : 20,
            pageSize     : 30
          })

          expect(req1).to.deep.include({
            method: 'GET',
            path  : `${storeUrl}/keys?filterPattern=123&cursor=20&pageSize=30`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when options is invalid', async () => {
          const errorMsg1 = 'Cursor must be a number.'

          await expect(() => store.storeKeys({ cursor: null })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: false })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: true })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: '' })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: 'foo' })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: NaN })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: () => undefined })).to.throw(errorMsg1)

          const errorMsg2 = 'Page size must be a number.'

          await expect(() => store.storeKeys({ pageSize: null })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: false })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: true })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: '' })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: 'foo' })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: NaN })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: () => undefined })).to.throw(errorMsg2)

          const errorMsg3 = 'Filter pattern must be a string.'

          await expect(() => store.storeKeys({ filterPattern: null })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: false })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: true })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: 123 })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: 0 })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: NaN })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: () => undefined })).to.throw(errorMsg3)
        })
      })

      describe('Delete', () => {
        it('success with single key', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.delete('testKey')

          console.log({ req1 })

          expect(req1).to.deep.include({
            method : 'DELETE',
            path   : `${storeUrl}`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('success with multi keys', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.delete(['testKey1', 'testKey2'])

          expect(req1).to.deep.include({
            method : 'DELETE',
            path   : `${storeUrl}`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey1', 'testKey2']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key is invalid', async () => {
          const errorMsg = 'Key(s) must be provided and must be a string or list of strings.'

          await expect(() => store.delete(undefined)).to.throw(errorMsg)
          await expect(() => store.delete(null)).to.throw(errorMsg)
          await expect(() => store.delete(0)).to.throw(errorMsg)
          await expect(() => store.delete(false)).to.throw(errorMsg)
          await expect(() => store.delete('')).to.throw(errorMsg)
          await expect(() => store.delete(true)).to.throw(errorMsg)
          await expect(() => store.delete(123)).to.throw(errorMsg)
          await expect(() => store.delete(() => undefined)).to.throw(errorMsg)
          await expect(() => store.delete({})).to.throw(errorMsg)
        })
      })

      describe('Exists', async () => {
        it('success with single key', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.exists('testKey')

          expect(req1).to.deep.include({
            method : 'POST',
            path   : `${storeUrl}/exists`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('success with multi keys', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.exists(['testKey1', 'testKey1'])

          expect(req1).to.deep.include({
            method : 'POST',
            path   : `${storeUrl}/exists`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey1', 'testKey1']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key(s) is invalid', async () => {
          const errorMsg = 'Key(s) must be provided and must be a string or list of strings.'

          await expect(() => store.exists(undefined)).to.throw(errorMsg)
          await expect(() => store.exists(null)).to.throw(errorMsg)
          await expect(() => store.exists(false)).to.throw(errorMsg)
          await expect(() => store.exists(0)).to.throw(errorMsg)
          await expect(() => store.exists(true)).to.throw(errorMsg)
          await expect(() => store.exists(123)).to.throw(errorMsg)
          await expect(() => store.exists(() => undefined)).to.throw(errorMsg)
          await expect(() => store.exists({})).to.throw(errorMsg)
        })
      })

      describe('Rename', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.rename('testKey1', 'testKey2')

          expect(req1).to.deep.include({
            method: 'PUT',
            path  : `${storeUrl}/testKey1/rename?newKey=testKey2`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg1 = 'New key name must be provided and must be a string.'
          const errorMsg2 = 'Old key name must be provided and must be a string.'

          await expect(() => store.rename('test', undefined)).to.throw(errorMsg1)
          await expect(() => store.rename('test', null)).to.throw(errorMsg1)
          await expect(() => store.rename('test', false)).to.throw(errorMsg1)
          await expect(() => store.rename('test', true)).to.throw(errorMsg1)
          await expect(() => store.rename('test', 0)).to.throw(errorMsg1)
          await expect(() => store.rename('test', 123)).to.throw(errorMsg1)
          await expect(() => store.rename('test', () => undefined)).to.throw(errorMsg1)
          await expect(() => store.rename('test', {})).to.throw(errorMsg1)

          await expect(() => store.rename(undefined)).to.throw(errorMsg2)
          await expect(() => store.rename(null)).to.throw(errorMsg2)
          await expect(() => store.rename(false)).to.throw(errorMsg2)
          await expect(() => store.rename(true)).to.throw(errorMsg2)
          await expect(() => store.rename(0)).to.throw(errorMsg2)
          await expect(() => store.rename(123)).to.throw(errorMsg2)
          await expect(() => store.rename(() => undefined)).to.throw(errorMsg2)
          await expect(() => store.rename({})).to.throw(errorMsg2)
        })
      })

      describe('Rename If Not Exists', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.renameIfNotExists('testKey1', 'testKey2')

          expect(req1).to.deep.include({
            method: 'PUT',
            path  : `${storeUrl}/testKey1/rename-if-not-exists?newKey=testKey2`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg1 = 'New key name must be provided and must be a string.'
          const errorMsg2 = 'Old key name must be provided and must be a string.'

          await expect(() => store.renameIfNotExists('test', undefined)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', null)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', false)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', true)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', 0)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', 123)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', () => undefined)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', {})).to.throw(errorMsg1)

          await expect(() => store.renameIfNotExists(undefined)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(null)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(false)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(true)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(0)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(123)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(() => undefined)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists({})).to.throw(errorMsg2)
        })
      })

      describe('Get Expiration', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.getExpiration('testKey1')

          expect(req1).to.deep.include({
            method: 'GET',
            path  : `${storeUrl}/testKey1/get-expiration-ttl`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg = 'Key must be provided and must be a string.'

          await expect(() => store.getExpiration(undefined)).to.throw(errorMsg)
          await expect(() => store.getExpiration(null)).to.throw(errorMsg)
          await expect(() => store.getExpiration(false)).to.throw(errorMsg)
          await expect(() => store.getExpiration(true)).to.throw(errorMsg)
          await expect(() => store.getExpiration(0)).to.throw(errorMsg)
          await expect(() => store.getExpiration(123)).to.throw(errorMsg)
          await expect(() => store.getExpiration(() => undefined)).to.throw(errorMsg)
          await expect(() => store.getExpiration({})).to.throw(errorMsg)
        })
      })

      it('Remove Expiration', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.removeExpiration('testKey1')

          expect(req1).to.deep.include({
            method: 'PUT',
            path  : `${storeUrl}/testKey1/remove-expiration`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg = 'Key must be provided and must be a string.'

          await expect(() => store.removeExpiration(undefined)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(null)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(false)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(true)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(0)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(123)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(() => undefined)).to.throw(errorMsg)
          await expect(() => store.removeExpiration({})).to.throw(errorMsg)
        })
      })

      describe('Expire', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.expire('testKey1', 100)

          expect(req1).to.deep.include({
            method: 'PUT',
            path  : `${storeUrl}/testKey1/expire?ttl=100`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg1 = 'Key must be provided and must be a string.'

          await expect(() => store.expire(undefined)).to.throw(errorMsg1)
          await expect(() => store.expire(null)).to.throw(errorMsg1)
          await expect(() => store.expire(false)).to.throw(errorMsg1)
          await expect(() => store.expire(true)).to.throw(errorMsg1)
          await expect(() => store.expire(0)).to.throw(errorMsg1)
          await expect(() => store.expire(123)).to.throw(errorMsg1)
          await expect(() => store.expire(() => undefined)).to.throw(errorMsg1)
          await expect(() => store.expire({})).to.throw(errorMsg1)

          const errorMsg2 = 'TTL must be a number.'

          await expect(() => store.expire('test', undefined)).to.throw(errorMsg2)
          await expect(() => store.expire('test', null)).to.throw(errorMsg2)
          await expect(() => store.expire('test', false)).to.throw(errorMsg2)
          await expect(() => store.expire('test', true)).to.throw(errorMsg2)
          await expect(() => store.expire('test', NaN)).to.throw(errorMsg2)
          await expect(() => store.expire('test', () => undefined)).to.throw(errorMsg2)
          await expect(() => store.expire('test', {})).to.throw(errorMsg2)
        })
      })

      describe('Expire At', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.expireAt('testKey1', 100)

          expect(req1).to.deep.include({
            method: 'PUT',
            path  : `${storeUrl}/testKey1/expire-at?unixTime=100`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg1 = 'Key must be provided and must be a string.'

          await expect(() => store.expireAt(undefined)).to.throw(errorMsg1)
          await expect(() => store.expireAt(null)).to.throw(errorMsg1)
          await expect(() => store.expireAt(false)).to.throw(errorMsg1)
          await expect(() => store.expireAt(true)).to.throw(errorMsg1)
          await expect(() => store.expireAt(0)).to.throw(errorMsg1)
          await expect(() => store.expireAt(123)).to.throw(errorMsg1)
          await expect(() => store.expireAt(() => undefined)).to.throw(errorMsg1)
          await expect(() => store.expireAt({})).to.throw(errorMsg1)

          const errorMsg2 = 'Expiration time must be a number.'

          await expect(() => store.expireAt('test', undefined)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', null)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', false)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', true)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', NaN)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', () => undefined)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', {})).to.throw(errorMsg2)
        })
      })

      describe('Touch', async () => {
        it('success with single key', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.touch('testKey')

          expect(req1).to.deep.include({
            method : 'PUT',
            path   : `${storeUrl}/touch`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('success with multi keys', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.touch(['testKey1', 'testKey1'])

          expect(req1).to.deep.include({
            method : 'PUT',
            path   : `${storeUrl}/touch`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey1', 'testKey1']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key(s) is invalid', async () => {
          const errorMsg = 'Key(s) must be provided and must be a string or list of strings.'

          await expect(() => store.touch(undefined)).to.throw(errorMsg)
          await expect(() => store.touch(null)).to.throw(errorMsg)
          await expect(() => store.touch(false)).to.throw(errorMsg)
          await expect(() => store.touch(0)).to.throw(errorMsg)
          await expect(() => store.touch(true)).to.throw(errorMsg)
          await expect(() => store.touch(123)).to.throw(errorMsg)
          await expect(() => store.touch(() => undefined)).to.throw(errorMsg)
          await expect(() => store.touch({})).to.throw(errorMsg)
        })
      })
    })

    describe('Sorted Set', () => {
      const storeUrl = getStoreUrl(HiveTypes.SORTED_SET)

      let store

      beforeEach(() => {
        store = Backendless.Hive(hiveName).SortedSetStore()
      })

      describe('Store Keys', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.storeKeys()

          expect(req1).to.deep.include({
            method: 'GET',
            path  : `${storeUrl}/keys`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('success with options', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.storeKeys({
            filterPattern: '123',
            cursor       : 20,
            pageSize     : 30
          })

          expect(req1).to.deep.include({
            method: 'GET',
            path  : `${storeUrl}/keys?filterPattern=123&cursor=20&pageSize=30`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when options is invalid', async () => {
          const errorMsg1 = 'Cursor must be a number.'

          await expect(() => store.storeKeys({ cursor: null })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: false })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: true })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: '' })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: 'foo' })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: NaN })).to.throw(errorMsg1)
          await expect(() => store.storeKeys({ cursor: () => undefined })).to.throw(errorMsg1)

          const errorMsg2 = 'Page size must be a number.'

          await expect(() => store.storeKeys({ pageSize: null })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: false })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: true })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: '' })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: 'foo' })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: NaN })).to.throw(errorMsg2)
          await expect(() => store.storeKeys({ pageSize: () => undefined })).to.throw(errorMsg2)

          const errorMsg3 = 'Filter pattern must be a string.'

          await expect(() => store.storeKeys({ filterPattern: null })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: false })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: true })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: 123 })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: 0 })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: NaN })).to.throw(errorMsg3)
          await expect(() => store.storeKeys({ filterPattern: () => undefined })).to.throw(errorMsg3)
        })
      })

      describe('Delete', () => {
        it('success with single key', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.delete('testKey')

          console.log({ req1 })

          expect(req1).to.deep.include({
            method : 'DELETE',
            path   : `${storeUrl}`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('success with multi keys', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.delete(['testKey1', 'testKey2'])

          expect(req1).to.deep.include({
            method : 'DELETE',
            path   : `${storeUrl}`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey1', 'testKey2']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key is invalid', async () => {
          const errorMsg = 'Key(s) must be provided and must be a string or list of strings.'

          await expect(() => store.delete(undefined)).to.throw(errorMsg)
          await expect(() => store.delete(null)).to.throw(errorMsg)
          await expect(() => store.delete(0)).to.throw(errorMsg)
          await expect(() => store.delete(false)).to.throw(errorMsg)
          await expect(() => store.delete('')).to.throw(errorMsg)
          await expect(() => store.delete(true)).to.throw(errorMsg)
          await expect(() => store.delete(123)).to.throw(errorMsg)
          await expect(() => store.delete(() => undefined)).to.throw(errorMsg)
          await expect(() => store.delete({})).to.throw(errorMsg)
        })
      })

      describe('Exists', async () => {
        it('success with single key', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.exists('testKey')

          expect(req1).to.deep.include({
            method : 'POST',
            path   : `${storeUrl}/exists`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('success with multi keys', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.exists(['testKey1', 'testKey1'])

          expect(req1).to.deep.include({
            method : 'POST',
            path   : `${storeUrl}/exists`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey1', 'testKey1']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key(s) is invalid', async () => {
          const errorMsg = 'Key(s) must be provided and must be a string or list of strings.'

          await expect(() => store.exists(undefined)).to.throw(errorMsg)
          await expect(() => store.exists(null)).to.throw(errorMsg)
          await expect(() => store.exists(false)).to.throw(errorMsg)
          await expect(() => store.exists(0)).to.throw(errorMsg)
          await expect(() => store.exists(true)).to.throw(errorMsg)
          await expect(() => store.exists(123)).to.throw(errorMsg)
          await expect(() => store.exists(() => undefined)).to.throw(errorMsg)
          await expect(() => store.exists({})).to.throw(errorMsg)
        })
      })

      describe('Rename', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.rename('testKey1', 'testKey2')

          expect(req1).to.deep.include({
            method: 'PUT',
            path  : `${storeUrl}/testKey1/rename?newKey=testKey2`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg1 = 'New key name must be provided and must be a string.'
          const errorMsg2 = 'Old key name must be provided and must be a string.'

          await expect(() => store.rename('test', undefined)).to.throw(errorMsg1)
          await expect(() => store.rename('test', null)).to.throw(errorMsg1)
          await expect(() => store.rename('test', false)).to.throw(errorMsg1)
          await expect(() => store.rename('test', true)).to.throw(errorMsg1)
          await expect(() => store.rename('test', 0)).to.throw(errorMsg1)
          await expect(() => store.rename('test', 123)).to.throw(errorMsg1)
          await expect(() => store.rename('test', () => undefined)).to.throw(errorMsg1)
          await expect(() => store.rename('test', {})).to.throw(errorMsg1)

          await expect(() => store.rename(undefined)).to.throw(errorMsg2)
          await expect(() => store.rename(null)).to.throw(errorMsg2)
          await expect(() => store.rename(false)).to.throw(errorMsg2)
          await expect(() => store.rename(true)).to.throw(errorMsg2)
          await expect(() => store.rename(0)).to.throw(errorMsg2)
          await expect(() => store.rename(123)).to.throw(errorMsg2)
          await expect(() => store.rename(() => undefined)).to.throw(errorMsg2)
          await expect(() => store.rename({})).to.throw(errorMsg2)
        })
      })

      describe('Rename If Not Exists', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.renameIfNotExists('testKey1', 'testKey2')

          expect(req1).to.deep.include({
            method: 'PUT',
            path  : `${storeUrl}/testKey1/rename-if-not-exists?newKey=testKey2`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg1 = 'New key name must be provided and must be a string.'
          const errorMsg2 = 'Old key name must be provided and must be a string.'

          await expect(() => store.renameIfNotExists('test', undefined)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', null)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', false)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', true)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', 0)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', 123)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', () => undefined)).to.throw(errorMsg1)
          await expect(() => store.renameIfNotExists('test', {})).to.throw(errorMsg1)

          await expect(() => store.renameIfNotExists(undefined)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(null)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(false)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(true)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(0)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(123)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists(() => undefined)).to.throw(errorMsg2)
          await expect(() => store.renameIfNotExists({})).to.throw(errorMsg2)
        })
      })

      describe('Get Expiration', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.getExpiration('testKey1')

          expect(req1).to.deep.include({
            method: 'GET',
            path  : `${storeUrl}/testKey1/get-expiration-ttl`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg = 'Key must be provided and must be a string.'

          await expect(() => store.getExpiration(undefined)).to.throw(errorMsg)
          await expect(() => store.getExpiration(null)).to.throw(errorMsg)
          await expect(() => store.getExpiration(false)).to.throw(errorMsg)
          await expect(() => store.getExpiration(true)).to.throw(errorMsg)
          await expect(() => store.getExpiration(0)).to.throw(errorMsg)
          await expect(() => store.getExpiration(123)).to.throw(errorMsg)
          await expect(() => store.getExpiration(() => undefined)).to.throw(errorMsg)
          await expect(() => store.getExpiration({})).to.throw(errorMsg)
        })
      })

      it('Remove Expiration', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.removeExpiration('testKey1')

          expect(req1).to.deep.include({
            method: 'PUT',
            path  : `${storeUrl}/testKey1/remove-expiration`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg = 'Key must be provided and must be a string.'

          await expect(() => store.removeExpiration(undefined)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(null)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(false)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(true)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(0)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(123)).to.throw(errorMsg)
          await expect(() => store.removeExpiration(() => undefined)).to.throw(errorMsg)
          await expect(() => store.removeExpiration({})).to.throw(errorMsg)
        })
      })

      describe('Expire', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.expire('testKey1', 100)

          expect(req1).to.deep.include({
            method: 'PUT',
            path  : `${storeUrl}/testKey1/expire?ttl=100`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg1 = 'Key must be provided and must be a string.'

          await expect(() => store.expire(undefined)).to.throw(errorMsg1)
          await expect(() => store.expire(null)).to.throw(errorMsg1)
          await expect(() => store.expire(false)).to.throw(errorMsg1)
          await expect(() => store.expire(true)).to.throw(errorMsg1)
          await expect(() => store.expire(0)).to.throw(errorMsg1)
          await expect(() => store.expire(123)).to.throw(errorMsg1)
          await expect(() => store.expire(() => undefined)).to.throw(errorMsg1)
          await expect(() => store.expire({})).to.throw(errorMsg1)

          const errorMsg2 = 'TTL must be a number.'

          await expect(() => store.expire('test', undefined)).to.throw(errorMsg2)
          await expect(() => store.expire('test', null)).to.throw(errorMsg2)
          await expect(() => store.expire('test', false)).to.throw(errorMsg2)
          await expect(() => store.expire('test', true)).to.throw(errorMsg2)
          await expect(() => store.expire('test', NaN)).to.throw(errorMsg2)
          await expect(() => store.expire('test', () => undefined)).to.throw(errorMsg2)
          await expect(() => store.expire('test', {})).to.throw(errorMsg2)
        })
      })

      describe('Expire At', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.expireAt('testKey1', 100)

          expect(req1).to.deep.include({
            method: 'PUT',
            path  : `${storeUrl}/testKey1/expire-at?unixTime=100`,
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key names is invalid', async () => {
          const errorMsg1 = 'Key must be provided and must be a string.'

          await expect(() => store.expireAt(undefined)).to.throw(errorMsg1)
          await expect(() => store.expireAt(null)).to.throw(errorMsg1)
          await expect(() => store.expireAt(false)).to.throw(errorMsg1)
          await expect(() => store.expireAt(true)).to.throw(errorMsg1)
          await expect(() => store.expireAt(0)).to.throw(errorMsg1)
          await expect(() => store.expireAt(123)).to.throw(errorMsg1)
          await expect(() => store.expireAt(() => undefined)).to.throw(errorMsg1)
          await expect(() => store.expireAt({})).to.throw(errorMsg1)

          const errorMsg2 = 'Expiration time must be a number.'

          await expect(() => store.expireAt('test', undefined)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', null)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', false)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', true)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', NaN)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', () => undefined)).to.throw(errorMsg2)
          await expect(() => store.expireAt('test', {})).to.throw(errorMsg2)
        })
      })

      describe('Touch', async () => {
        it('success with single key', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.touch('testKey')

          expect(req1).to.deep.include({
            method : 'PUT',
            path   : `${storeUrl}/touch`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('success with multi keys', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.touch(['testKey1', 'testKey1'])

          expect(req1).to.deep.include({
            method : 'PUT',
            path   : `${storeUrl}/touch`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey1', 'testKey1']
          })

          expect(result1).to.be.eql(fakeResult)
        })

        it('fails when key(s) is invalid', async () => {
          const errorMsg = 'Key(s) must be provided and must be a string or list of strings.'

          await expect(() => store.touch(undefined)).to.throw(errorMsg)
          await expect(() => store.touch(null)).to.throw(errorMsg)
          await expect(() => store.touch(false)).to.throw(errorMsg)
          await expect(() => store.touch(0)).to.throw(errorMsg)
          await expect(() => store.touch(true)).to.throw(errorMsg)
          await expect(() => store.touch(123)).to.throw(errorMsg)
          await expect(() => store.touch(() => undefined)).to.throw(errorMsg)
          await expect(() => store.touch({})).to.throw(errorMsg)
        })
      })
    })
  })
})
