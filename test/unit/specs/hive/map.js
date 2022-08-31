import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forTest, prepareMockRequest } from '../../helpers/sandbox'

describe('Hive - Map Store', function() {
  forTest(this)

  const hiveName = 'testHiveName'
  const storeKey = 'testStoreKey'

  const fakeResult = { foo: true }

  let store
  let Store

  beforeEach(() => {
    Store = Backendless.Hive(hiveName).MapStore
    store = Backendless.Hive(hiveName).MapStore(storeKey)
  })

  describe('General Methods', () => {
    describe('Static Methods', () => {
      describe('Keys', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await Store.keys()

          expect(request).to.deep.include({
            method: 'GET',
            path  : `${APP_PATH}/hive/${hiveName}/map/keys`,
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
            path  : `${APP_PATH}/hive/${hiveName}/map/keys?filterPattern=123&cursor=20&pageSize=30`,
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
            path   : `${APP_PATH}/hive/${hiveName}/map`,
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
            path   : `${APP_PATH}/hive/${hiveName}/map/action/exists`,
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
            path   : `${APP_PATH}/hive/${hiveName}/map/action/touch`,
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

        await expect(() => hive.MapStore()).to.throw(errorMsg)
        await expect(() => hive.MapStore('')).to.throw(errorMsg)
        await expect(() => hive.MapStore(null)).to.throw(errorMsg)
        await expect(() => hive.MapStore(0)).to.throw(errorMsg)
        await expect(() => hive.MapStore(false)).to.throw(errorMsg)
        await expect(() => hive.MapStore(true)).to.throw(errorMsg)
        await expect(() => hive.MapStore(123)).to.throw(errorMsg)
        await expect(() => hive.MapStore(() => undefined)).to.throw(errorMsg)
        await expect(() => hive.MapStore({})).to.throw(errorMsg)
      })

      describe('Delete', () => {
        it('success with single key', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.delete()

          expect(request).to.deep.include({
            method : 'DELETE',
            path   : `${APP_PATH}/hive/${hiveName}/map`,
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
            path   : `${APP_PATH}/hive/${hiveName}/map/action/exists`,
            headers: { 'Content-Type': 'application/json' },
            body   : [storeKey]
          })

          expect(req2).to.deep.include({
            method : 'POST',
            path   : `${APP_PATH}/hive/${hiveName}/map/action/exists`,
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
            path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}/rename?newKey=testKey2`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('rename with overwrite=true', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.rename('testKey2', true)

          expect(request).to.deep.include({
            method: 'POST',
            path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}/rename?newKey=testKey2&overwrite=true`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('rename with overwrite=false', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.rename('testKey2', false)

          expect(request).to.deep.include({
            method: 'POST',
            path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}/rename?newKey=testKey2&overwrite=false`,
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
            path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}/get-expiration-ttl`,
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
            path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}/clear-expiration`,
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
            path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}/expire?ttl=100`,
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
            path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}/expire-at?unixTime=100`,
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
            path   : `${APP_PATH}/hive/${hiveName}/map/action/touch`,
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
            path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}/seconds-since-last-operation`,
          })

          expect(result).to.be.eql(fakeResult)
        })
      })
    })
  })

  describe('Instance', () => {

    describe('Get', () => {
      it('success', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.get()

        expect(request).to.deep.include({
          method: 'POST',
          path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}`,
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('success with key', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.get('test')

        expect(request).to.deep.include({
          method: 'POST',
          path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}`,
          body  : ['test']
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('success with keys', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.get(['test1', 'test2'])

        expect(request).to.deep.include({
          method: 'POST',
          path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}`,
          body  : ['test1', 'test2']
        })

        expect(result).to.be.eql(fakeResult)
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
        const request = prepareMockRequest(fakeResult)

        const result = await store.getValue('test')

        expect(request).to.deep.include({
          method: 'GET',
          path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}/get/test`,
        })

        expect(result).to.be.eql(fakeResult)
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
        const request = prepareMockRequest(fakeResult)

        const result = await store.keyExists('test')

        expect(request).to.deep.include({
          method: 'GET',
          path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}/exists/test`,
        })

        expect(result).to.be.eql(fakeResult)
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
        const request = prepareMockRequest(fakeResult)

        const result = await store.length()

        expect(request).to.deep.include({
          method: 'GET',
          path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}/length`,
        })

        expect(result).to.be.eql(fakeResult)
      })

    })

    describe('Keys', async () => {
      it('success', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.keys()

        expect(request).to.deep.include({
          method: 'GET',
          path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}/keys`,
        })

        expect(result).to.be.eql(fakeResult)
      })

    })

    describe('Values', async () => {
      it('success', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.values()

        expect(request).to.deep.include({
          method: 'GET',
          path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}/values`,
        })

        expect(result).to.be.eql(fakeResult)
      })

    })

    describe('Set Values', async () => {
      it('success', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.set({ foo: 123 })

        expect(request).to.deep.include({
          method: 'PUT',
          path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}`,
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('fails with invalid first argument', async () => {
        const errorMsg = 'First argument must be provided and must be a string or an object.'

        await expect(() => store.set(null)).to.throw(errorMsg)
        await expect(() => store.set(NaN)).to.throw(errorMsg)
        await expect(() => store.set(false)).to.throw(errorMsg)
        await expect(() => store.set(0)).to.throw(errorMsg)
        await expect(() => store.set('')).to.throw(errorMsg)
      })

      it('fails when payload object have no keys', async () => {
        const errorMsg = 'Provided object must have at least 1 key.'

        await expect(() => store.set({})).to.throw(errorMsg)
      })
    })

    describe('Set Value', async () => {
      it('success', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.set('target', 'value1')

        expect(request).to.deep.include({
          method: 'PUT',
          path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}/set/target`,
          body  : {
            value: 'value1'
          }
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('fails with invalid key', async () => {
        const errorMsg = 'Key must be a string.'

        await expect(() => store.set(true)).to.throw(errorMsg)
        await expect(() => store.set(123)).to.throw(errorMsg)
        await expect(() => store.set([])).to.throw(errorMsg)
        await expect(() => store.set(() => undefined)).to.throw(errorMsg)
      })

      it('fails with invalid value', async () => {
        const errorMsg = 'Value must be provided and must be a string.'

        await expect(() => store.set('k', undefined)).to.throw(errorMsg)
        await expect(() => store.set('k', null)).to.throw(errorMsg)
        await expect(() => store.set('k', false)).to.throw(errorMsg)
        await expect(() => store.set('k', 0)).to.throw(errorMsg)
        await expect(() => store.set('k', '')).to.throw(errorMsg)
        await expect(() => store.set('k', true)).to.throw(errorMsg)
        await expect(() => store.set('k', 123)).to.throw(errorMsg)
        await expect(() => store.set('k', {})).to.throw(errorMsg)
        await expect(() => store.set('k', [])).to.throw(errorMsg)
        await expect(() => store.set('k', () => undefined)).to.throw(errorMsg)
      })
    })

    describe('Set With Overwrite', async () => {
      it('success', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.setWithOverwrite('target', 'value1')

        expect(request).to.deep.include({
          method: 'PUT',
          path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}/set-with-overwrite/target`,
          body  : {
            value: 'value1'
          }
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('success with overwrite option', async () => {
        const request1 = prepareMockRequest(fakeResult)
        const request2 = prepareMockRequest(fakeResult)

        const result1 = await store.setWithOverwrite('target1', 'value1', true)
        const result2 = await store.setWithOverwrite('target2', 'value2', false)

        expect(request1).to.deep.include({
          method: 'PUT',
          path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}/set-with-overwrite/target1`,
          body  : {
            value    : 'value1',
            overwrite: true
          }
        })

        expect(request2).to.deep.include({
          method: 'PUT',
          path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}/set-with-overwrite/target2`,
          body  : {
            value    : 'value2',
            overwrite: false
          }
        })

        expect(result1).to.be.eql(fakeResult)
        expect(result2).to.be.eql(fakeResult)
      })

      it('fails with invalid key', async () => {
        const errorMsg = 'Key must be provided and must be a string.'

        await expect(() => store.setWithOverwrite(null, 'v')).to.throw(errorMsg)
        await expect(() => store.setWithOverwrite(false, 'v')).to.throw(errorMsg)
        await expect(() => store.setWithOverwrite(true, 'v')).to.throw(errorMsg)
        await expect(() => store.setWithOverwrite(0, 'v')).to.throw(errorMsg)
        await expect(() => store.setWithOverwrite(123, 'v')).to.throw(errorMsg)
        await expect(() => store.setWithOverwrite('', 'v')).to.throw(errorMsg)
        await expect(() => store.setWithOverwrite([], 'v')).to.throw(errorMsg)
        await expect(() => store.setWithOverwrite(() => undefined, 'v')).to.throw(errorMsg)
      })

      it('fails with invalid value', async () => {
        const errorMsg = 'Value must be provided and must be a string.'

        await expect(() => store.setWithOverwrite('k', undefined)).to.throw(errorMsg)
        await expect(() => store.setWithOverwrite('k', null)).to.throw(errorMsg)
        await expect(() => store.setWithOverwrite('k', false)).to.throw(errorMsg)
        await expect(() => store.setWithOverwrite('k', 0)).to.throw(errorMsg)
        await expect(() => store.setWithOverwrite('k', '')).to.throw(errorMsg)
        await expect(() => store.setWithOverwrite('k', true)).to.throw(errorMsg)
        await expect(() => store.setWithOverwrite('k', 123)).to.throw(errorMsg)
        await expect(() => store.setWithOverwrite('k', {})).to.throw(errorMsg)
        await expect(() => store.setWithOverwrite('k', [])).to.throw(errorMsg)
        await expect(() => store.setWithOverwrite('k', () => undefined)).to.throw(errorMsg)
      })

      it('fails with invalid overwrite argument', async () => {
        const errorMsg = 'Overwrite must be a boolean.'

        await expect(() => store.setWithOverwrite('k', 'v', null)).to.throw(errorMsg)
        await expect(() => store.setWithOverwrite('k', 'v', {})).to.throw(errorMsg)
        await expect(() => store.setWithOverwrite('k', 'v', [])).to.throw(errorMsg)
        await expect(() => store.setWithOverwrite('k', 'v', 0)).to.throw(errorMsg)
        await expect(() => store.setWithOverwrite('k', 'v', 123)).to.throw(errorMsg)
        await expect(() => store.setWithOverwrite('k', 'v', '')).to.throw(errorMsg)
        await expect(() => store.setWithOverwrite('k', 'v', '123')).to.throw(errorMsg)
        await expect(() => store.setWithOverwrite('k', 'v', () => undefined)).to.throw(errorMsg)
      })
    })

    describe('Add', async () => {
      it('success', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.add({ foo: 123 })

        expect(request).to.deep.include({
          method: 'PUT',
          path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}/add`,
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('fails when payload object is invalid', async () => {
        const errorMsg = 'Payload must be an object.'

        await expect(() => store.add(null)).to.throw(errorMsg)
        await expect(() => store.add(NaN)).to.throw(errorMsg)
        await expect(() => store.add(false)).to.throw(errorMsg)
        await expect(() => store.add(true)).to.throw(errorMsg)
        await expect(() => store.add(0)).to.throw(errorMsg)
        await expect(() => store.add(123)).to.throw(errorMsg)
        await expect(() => store.add(() => undefined)).to.throw(errorMsg)
        await expect(() => store.add('')).to.throw(errorMsg)
        await expect(() => store.add('foo')).to.throw(errorMsg)
      })

      it('fails when payload object ha invalid argument', async () => {
        const errorMsg = 'Provided object must have at least 1 key.'

        await expect(() => store.add({})).to.throw(errorMsg)
      })
    })

    describe('Increment', async () => {
      it('success', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.increment('testKey')

        expect(request).to.deep.include({
          method: 'PUT',
          path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}/increment/testKey`,
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('success with count', async () => {
        const request = prepareMockRequest(fakeResult)
        const req2 = prepareMockRequest(fakeResult)

        const result = await store.increment('testKey', 3)
        const result2 = await store.increment('testKey', -3)

        expect(request).to.deep.include({
          method: 'PUT',
          path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}/increment/testKey?count=3`,
        })

        expect(req2).to.deep.include({
          method: 'PUT',
          path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}/increment/testKey?count=-3`,
        })

        expect(result).to.be.eql(fakeResult)
        expect(result2).to.be.eql(fakeResult)
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

    describe('Decrement', async () => {
      it('success', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.decrement('testKey')

        expect(request).to.deep.include({
          method: 'PUT',
          path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}/decrement/testKey`,
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('success with count', async () => {
        const request = prepareMockRequest(fakeResult)
        const req2 = prepareMockRequest(fakeResult)

        const result = await store.decrement('testKey', 3)
        const result2 = await store.decrement('testKey', -3)

        expect(request).to.deep.include({
          method: 'PUT',
          path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}/decrement/testKey?count=3`,
        })

        expect(req2).to.deep.include({
          method: 'PUT',
          path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}/decrement/testKey?count=-3`,
        })

        expect(result).to.be.eql(fakeResult)
        expect(result2).to.be.eql(fakeResult)
      })

      it('fails with invalid key', async () => {
        const errorMsg = 'Key must be provided and must be a string.'

        await expect(() => store.decrement(undefined)).to.throw(errorMsg)
        await expect(() => store.decrement(null)).to.throw(errorMsg)
        await expect(() => store.decrement(false)).to.throw(errorMsg)
        await expect(() => store.decrement(true)).to.throw(errorMsg)
        await expect(() => store.decrement(0)).to.throw(errorMsg)
        await expect(() => store.decrement(123)).to.throw(errorMsg)
        await expect(() => store.decrement('')).to.throw(errorMsg)
        await expect(() => store.decrement({})).to.throw(errorMsg)
        await expect(() => store.decrement([])).to.throw(errorMsg)
        await expect(() => store.decrement(() => undefined)).to.throw(errorMsg)
      })

      it('fails with invalid count', async () => {
        const errorMsg = 'Count must be a number.'

        await expect(() => store.decrement('v', null)).to.throw(errorMsg)
        await expect(() => store.decrement('v', NaN)).to.throw(errorMsg)
        await expect(() => store.decrement('v', false)).to.throw(errorMsg)
        await expect(() => store.decrement('v', '')).to.throw(errorMsg)
        await expect(() => store.decrement('v', 'qwe')).to.throw(errorMsg)
        await expect(() => store.decrement('v', true)).to.throw(errorMsg)
        await expect(() => store.decrement('v', () => undefined)).to.throw(errorMsg)
        await expect(() => store.decrement('v', {})).to.throw(errorMsg)
      })
    })

    describe('Delete Keys', () => {
      it('success with key', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.deleteKeys('test')

        expect(request).to.deep.include({
          method: 'DELETE',
          path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}/by-obj-keys`,
          body  : ['test']
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('success with keys', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.deleteKeys(['test1', 'test2'])

        expect(request).to.deep.include({
          method: 'DELETE',
          path  : `${APP_PATH}/hive/${hiveName}/map/${storeKey}/by-obj-keys`,
          body  : ['test1', 'test2']
        })

        expect(result).to.be.eql(fakeResult)
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
