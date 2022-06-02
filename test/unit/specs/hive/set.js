import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forTest, prepareMockRequest } from '../../helpers/sandbox'

describe('Set Store', function() {
  forTest(this)

  const hiveName = 'testHiveName'
  const storeKey = 'testStoreKey'

  describe('Methods', () => {
    const fakeResult = { foo: true }

    let store

    describe('Basic', () => {
      beforeEach(() => {
        store = Backendless.Hive(hiveName).SetStore()
      })

      describe('Store Keys', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.storeKeys()

          expect(request).to.deep.include({
            method: 'GET',
            path  : `${APP_PATH}/hive/${hiveName}/set/keys`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('success with options', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.storeKeys({
            filterPattern: '123',
            cursor       : 20,
            pageSize     : 30
          })

          expect(request).to.deep.include({
            method: 'GET',
            path  : `${APP_PATH}/hive/${hiveName}/set/keys?filterPattern=123&cursor=20&pageSize=30`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when options is invalid', async () => {
          const errorMsg = 'Options must be an object.'

          await expect(() => store.storeKeys(null)).to.throw(errorMsg)
          await expect(() => store.storeKeys(NaN)).to.throw(errorMsg)
          await expect(() => store.storeKeys('')).to.throw(errorMsg)
          await expect(() => store.storeKeys('123')).to.throw(errorMsg)
          await expect(() => store.storeKeys(123)).to.throw(errorMsg)
          await expect(() => store.storeKeys(0)).to.throw(errorMsg)
          await expect(() => store.storeKeys([])).to.throw(errorMsg)
          await expect(() => store.storeKeys(() => undefined)).to.throw(errorMsg)
          await expect(() => store.storeKeys(true)).to.throw(errorMsg)
          await expect(() => store.storeKeys(false)).to.throw(errorMsg)
        })

        it('fails when Cursor is invalid', async () => {
          const errorMsg = 'Cursor must be a number.'

          await expect(() => store.storeKeys({ cursor: null })).to.throw(errorMsg)
          await expect(() => store.storeKeys({ cursor: false })).to.throw(errorMsg)
          await expect(() => store.storeKeys({ cursor: true })).to.throw(errorMsg)
          await expect(() => store.storeKeys({ cursor: '' })).to.throw(errorMsg)
          await expect(() => store.storeKeys({ cursor: 'foo' })).to.throw(errorMsg)
          await expect(() => store.storeKeys({ cursor: NaN })).to.throw(errorMsg)
          await expect(() => store.storeKeys({ cursor: () => undefined })).to.throw(errorMsg)
        })

        it('fails when Page Size is invalid', async () => {
          const errorMsg = 'Page size must be a number.'

          await expect(() => store.storeKeys({ pageSize: null })).to.throw(errorMsg)
          await expect(() => store.storeKeys({ pageSize: false })).to.throw(errorMsg)
          await expect(() => store.storeKeys({ pageSize: true })).to.throw(errorMsg)
          await expect(() => store.storeKeys({ pageSize: '' })).to.throw(errorMsg)
          await expect(() => store.storeKeys({ pageSize: 'foo' })).to.throw(errorMsg)
          await expect(() => store.storeKeys({ pageSize: NaN })).to.throw(errorMsg)
          await expect(() => store.storeKeys({ pageSize: () => undefined })).to.throw(errorMsg)
        })

        it('fails when Filter Pattern is invalid', async () => {
          const errorMsg = 'Filter pattern must be a string.'

          await expect(() => store.storeKeys({ filterPattern: null })).to.throw(errorMsg)
          await expect(() => store.storeKeys({ filterPattern: false })).to.throw(errorMsg)
          await expect(() => store.storeKeys({ filterPattern: true })).to.throw(errorMsg)
          await expect(() => store.storeKeys({ filterPattern: 123 })).to.throw(errorMsg)
          await expect(() => store.storeKeys({ filterPattern: 0 })).to.throw(errorMsg)
          await expect(() => store.storeKeys({ filterPattern: NaN })).to.throw(errorMsg)
          await expect(() => store.storeKeys({ filterPattern: () => undefined })).to.throw(errorMsg)
        })
      })

      describe('Delete', () => {
        it('success with single key', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.delete('testKey')

          expect(request).to.deep.include({
            method : 'DELETE',
            path   : `${APP_PATH}/hive/${hiveName}/set`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey']
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('success with multi keys', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.delete(['testKey1', 'testKey2'])

          expect(request).to.deep.include({
            method : 'DELETE',
            path   : `${APP_PATH}/hive/${hiveName}/set`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey1', 'testKey2']
          })

          expect(result).to.be.eql(fakeResult)
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
          const request = prepareMockRequest(fakeResult)

          const result = await store.exists('testKey')

          expect(request).to.deep.include({
            method : 'POST',
            path   : `${APP_PATH}/hive/${hiveName}/set/exists`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey']
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('success with multi keys', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.exists(['testKey1', 'testKey1'])

          expect(request).to.deep.include({
            method : 'POST',
            path   : `${APP_PATH}/hive/${hiveName}/set/exists`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey1', 'testKey1']
          })

          expect(result).to.be.eql(fakeResult)
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
          const request = prepareMockRequest(fakeResult)

          const result = await store.rename('testKey1', 'testKey2')

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/set/testKey1/rename?newKey=testKey2`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when new key name is invalid', async () => {
          const errorMsg = 'New key name must be provided and must be a string.'

          await expect(() => store.renameIfNotExists('test', undefined)).to.throw(errorMsg)
          await expect(() => store.renameIfNotExists('test', null)).to.throw(errorMsg)
          await expect(() => store.renameIfNotExists('test', false)).to.throw(errorMsg)
          await expect(() => store.renameIfNotExists('test', true)).to.throw(errorMsg)
          await expect(() => store.renameIfNotExists('test', 0)).to.throw(errorMsg)
          await expect(() => store.renameIfNotExists('test', 123)).to.throw(errorMsg)
          await expect(() => store.renameIfNotExists('test', () => undefined)).to.throw(errorMsg)
          await expect(() => store.renameIfNotExists('test', {})).to.throw(errorMsg)
        })

        it('fails when old key name is invalid', async () => {
          const errorMsg = 'Old key name must be provided and must be a string.'

          await expect(() => store.renameIfNotExists(undefined)).to.throw(errorMsg)
          await expect(() => store.renameIfNotExists(null)).to.throw(errorMsg)
          await expect(() => store.renameIfNotExists(false)).to.throw(errorMsg)
          await expect(() => store.renameIfNotExists(true)).to.throw(errorMsg)
          await expect(() => store.renameIfNotExists(0)).to.throw(errorMsg)
          await expect(() => store.renameIfNotExists(123)).to.throw(errorMsg)
          await expect(() => store.renameIfNotExists(() => undefined)).to.throw(errorMsg)
          await expect(() => store.renameIfNotExists({})).to.throw(errorMsg)
        })
      })

      describe('Rename If Not Exists', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.renameIfNotExists('testKey1', 'testKey2')

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/set/testKey1/rename-if-not-exists?newKey=testKey2`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when new key name is invalid', async () => {
          const errorMsg = 'New key name must be provided and must be a string.'

          await expect(() => store.renameIfNotExists('test', undefined)).to.throw(errorMsg)
          await expect(() => store.renameIfNotExists('test', null)).to.throw(errorMsg)
          await expect(() => store.renameIfNotExists('test', false)).to.throw(errorMsg)
          await expect(() => store.renameIfNotExists('test', true)).to.throw(errorMsg)
          await expect(() => store.renameIfNotExists('test', 0)).to.throw(errorMsg)
          await expect(() => store.renameIfNotExists('test', 123)).to.throw(errorMsg)
          await expect(() => store.renameIfNotExists('test', () => undefined)).to.throw(errorMsg)
          await expect(() => store.renameIfNotExists('test', {})).to.throw(errorMsg)
        })

        it('fails when old key name is invalid', async () => {
          const errorMsg = 'Old key name must be provided and must be a string.'

          await expect(() => store.renameIfNotExists(undefined)).to.throw(errorMsg)
          await expect(() => store.renameIfNotExists(null)).to.throw(errorMsg)
          await expect(() => store.renameIfNotExists(false)).to.throw(errorMsg)
          await expect(() => store.renameIfNotExists(true)).to.throw(errorMsg)
          await expect(() => store.renameIfNotExists(0)).to.throw(errorMsg)
          await expect(() => store.renameIfNotExists(123)).to.throw(errorMsg)
          await expect(() => store.renameIfNotExists(() => undefined)).to.throw(errorMsg)
          await expect(() => store.renameIfNotExists({})).to.throw(errorMsg)
        })
      })

      describe('Get Expiration', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.getExpiration('testKey1')

          expect(request).to.deep.include({
            method: 'GET',
            path  : `${APP_PATH}/hive/${hiveName}/set/testKey1/get-expiration-ttl`,
          })

          expect(result).to.be.eql(fakeResult)
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
          const request = prepareMockRequest(fakeResult)

          const result = await store.removeExpiration('testKey1')

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/set/testKey1/remove-expiration`,
          })

          expect(result).to.be.eql(fakeResult)
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
          const request = prepareMockRequest(fakeResult)

          const result = await store.expire('testKey1', 100)

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/set/testKey1/expire?ttl=100`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when key name is invalid', async () => {
          const errorMsg = 'Key must be provided and must be a string.'

          await expect(() => store.expire(undefined)).to.throw(errorMsg)
          await expect(() => store.expire(null)).to.throw(errorMsg)
          await expect(() => store.expire(false)).to.throw(errorMsg)
          await expect(() => store.expire(true)).to.throw(errorMsg)
          await expect(() => store.expire(0)).to.throw(errorMsg)
          await expect(() => store.expire(123)).to.throw(errorMsg)
          await expect(() => store.expire(() => undefined)).to.throw(errorMsg)
          await expect(() => store.expire({})).to.throw(errorMsg)
        })

        it('fails when TTL argument is invalid', async () => {
          const errorMsg = 'TTL must be a number.'

          await expect(() => store.expire('test', undefined)).to.throw(errorMsg)
          await expect(() => store.expire('test', null)).to.throw(errorMsg)
          await expect(() => store.expire('test', false)).to.throw(errorMsg)
          await expect(() => store.expire('test', true)).to.throw(errorMsg)
          await expect(() => store.expire('test', NaN)).to.throw(errorMsg)
          await expect(() => store.expire('test', () => undefined)).to.throw(errorMsg)
          await expect(() => store.expire('test', {})).to.throw(errorMsg)
        })
      })

      describe('Expire At', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.expireAt('testKey1', 100)

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/set/testKey1/expire-at?unixTime=100`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when key name is invalid', async () => {
          const errorMsg = 'Key must be provided and must be a string.'

          await expect(() => store.expireAt(undefined)).to.throw(errorMsg)
          await expect(() => store.expireAt(null)).to.throw(errorMsg)
          await expect(() => store.expireAt(false)).to.throw(errorMsg)
          await expect(() => store.expireAt(true)).to.throw(errorMsg)
          await expect(() => store.expireAt(0)).to.throw(errorMsg)
          await expect(() => store.expireAt(123)).to.throw(errorMsg)
          await expect(() => store.expireAt(() => undefined)).to.throw(errorMsg)
          await expect(() => store.expireAt({})).to.throw(errorMsg)
        })

        it('fails when expiration time is invalid', async () => {
          const errorMsg = 'Expiration time must be a number.'

          await expect(() => store.expireAt('test', undefined)).to.throw(errorMsg)
          await expect(() => store.expireAt('test', null)).to.throw(errorMsg)
          await expect(() => store.expireAt('test', false)).to.throw(errorMsg)
          await expect(() => store.expireAt('test', true)).to.throw(errorMsg)
          await expect(() => store.expireAt('test', NaN)).to.throw(errorMsg)
          await expect(() => store.expireAt('test', () => undefined)).to.throw(errorMsg)
          await expect(() => store.expireAt('test', {})).to.throw(errorMsg)
        })
      })

      describe('Touch', async () => {
        it('success with single key', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.touch('testKey')

          expect(request).to.deep.include({
            method : 'PUT',
            path   : `${APP_PATH}/hive/${hiveName}/set/touch`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey']
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('success with multi keys', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.touch(['testKey1', 'testKey1'])

          expect(request).to.deep.include({
            method : 'PUT',
            path   : `${APP_PATH}/hive/${hiveName}/set/touch`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey1', 'testKey1']
          })

          expect(result).to.be.eql(fakeResult)
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

    describe('Store related', () => {
      beforeEach(() => {
        store = Backendless.Hive(hiveName).SetStore(storeKey)
      })

      describe('Get', () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.get()

          expect(request).to.deep.include({
            method: 'GET',
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when store created without key', async () => {
          store = Backendless.Hive(hiveName).SetStore()

          const errorMsg = 'Store must be created with store key.'

          await expect(() => store.get()).to.throw(errorMsg)
        })
      })

      describe('Get Random', () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.getRandom()

          expect(request).to.deep.include({
            method: 'GET',
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}/random`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('success with count', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.getRandom(3)

          expect(request).to.deep.include({
            method: 'GET',
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}/random?count=3`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when store created without key', async () => {
          store = Backendless.Hive(hiveName).SetStore()

          const errorMsg = 'Store must be created with store key.'

          await expect(() => store.getRandom()).to.throw(errorMsg)
        })

        it('fails when count is invalid', async () => {
          const errorMsg = 'Count must be a number.'

          await expect(() => store.getRandom(null)).to.throw(errorMsg)
          await expect(() => store.getRandom(false)).to.throw(errorMsg)
          await expect(() => store.getRandom(true)).to.throw(errorMsg)
          await expect(() => store.getRandom('')).to.throw(errorMsg)
          await expect(() => store.getRandom('foo')).to.throw(errorMsg)
          await expect(() => store.getRandom(NaN)).to.throw(errorMsg)
          await expect(() => store.getRandom(() => undefined)).to.throw(errorMsg)
        })
      })

      describe('Get Random and Delete', () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.getRandomAndDelete()

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}/random`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('success with count', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.getRandomAndDelete(3)

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}/random?count=3`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when store created without key', async () => {
          store = Backendless.Hive(hiveName).SetStore()

          const errorMsg = 'Store must be created with store key.'

          await expect(() => store.getRandomAndDelete()).to.throw(errorMsg)
        })

        it('fails when count is invalid', async () => {
          const errorMsg = 'Count must be a number.'

          await expect(() => store.getRandomAndDelete(null)).to.throw(errorMsg)
          await expect(() => store.getRandomAndDelete(false)).to.throw(errorMsg)
          await expect(() => store.getRandomAndDelete(true)).to.throw(errorMsg)
          await expect(() => store.getRandomAndDelete('')).to.throw(errorMsg)
          await expect(() => store.getRandomAndDelete('foo')).to.throw(errorMsg)
          await expect(() => store.getRandomAndDelete(NaN)).to.throw(errorMsg)
          await expect(() => store.getRandomAndDelete(() => undefined)).to.throw(errorMsg)
        })
      })

      describe('Set', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.set('value')

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}`,
            body  : ['value']
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('success with array of values', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.set(['value1', 'value2'])

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}`,
            body  : ['value1', 'value2']
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when store created without key', async () => {
          store = Backendless.Hive(hiveName).SetStore()

          const errorMsg = 'Store must be created with store key.'

          await expect(() => store.set('keyValue')).to.throw(errorMsg)
        })

        it('fails with invalid value', async () => {
          const errorMsg = 'Value(s) must be provided and must be a string or list of strings.'

          await expect(() => store.set(undefined)).to.throw(errorMsg)
          await expect(() => store.set(null)).to.throw(errorMsg)
          await expect(() => store.set(false)).to.throw(errorMsg)
          await expect(() => store.set(0)).to.throw(errorMsg)
          await expect(() => store.set(123)).to.throw(errorMsg)
          await expect(() => store.set('')).to.throw(errorMsg)
          await expect(() => store.set({})).to.throw(errorMsg)
          await expect(() => store.set(() => undefined)).to.throw(errorMsg)
          await expect(() => store.set(true)).to.throw(errorMsg)
        })
      })

      describe('Add', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.add('value')

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}/add`,
            body  : ['value']
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('success with array of values', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.add(['value1', 'value2'])

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}/add`,
            body  : ['value1', 'value2']
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when store created without key', async () => {
          store = Backendless.Hive(hiveName).SetStore()

          const errorMsg = 'Store must be created with store key.'

          await expect(() => store.add('keyValue')).to.throw(errorMsg)
        })

        it('fails with invalid value', async () => {
          const errorMsg = 'Value(s) must be provided and must be a string or list of strings.'

          await expect(() => store.add(undefined)).to.throw(errorMsg)
          await expect(() => store.add(null)).to.throw(errorMsg)
          await expect(() => store.add(false)).to.throw(errorMsg)
          await expect(() => store.add(0)).to.throw(errorMsg)
          await expect(() => store.add(123)).to.throw(errorMsg)
          await expect(() => store.add('')).to.throw(errorMsg)
          await expect(() => store.add({})).to.throw(errorMsg)
          await expect(() => store.add(() => undefined)).to.throw(errorMsg)
          await expect(() => store.add(true)).to.throw(errorMsg)
        })
      })

      describe('Remove Values', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.removeValues('value')

          expect(request).to.deep.include({
            method: 'DELETE',
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}/values`,
            body  : ['value']
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('success with array of values', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.removeValues(['value1', 'value2'])

          expect(request).to.deep.include({
            method: 'DELETE',
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}/values`,
            body  : ['value1', 'value2']
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when store created without key', async () => {
          store = Backendless.Hive(hiveName).SetStore()

          const errorMsg = 'Store must be created with store key.'

          await expect(() => store.removeValues('keyValue')).to.throw(errorMsg)
        })

        it('fails with invalid value', async () => {
          const errorMsg = 'Value(s) must be provided and must be a string or list of strings.'

          await expect(() => store.removeValues(undefined)).to.throw(errorMsg)
          await expect(() => store.removeValues(null)).to.throw(errorMsg)
          await expect(() => store.removeValues(false)).to.throw(errorMsg)
          await expect(() => store.removeValues(0)).to.throw(errorMsg)
          await expect(() => store.removeValues(123)).to.throw(errorMsg)
          await expect(() => store.removeValues('')).to.throw(errorMsg)
          await expect(() => store.removeValues({})).to.throw(errorMsg)
          await expect(() => store.removeValues(() => undefined)).to.throw(errorMsg)
          await expect(() => store.removeValues(true)).to.throw(errorMsg)
        })
      })

      describe('Is Member', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.isMember('testKey1')

          expect(request).to.deep.include({
            method: 'GET',
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}/contains`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when store created without key', async () => {
          store = Backendless.Hive(hiveName).SetStore()

          const errorMsg = 'Store must be created with store key.'

          await expect(() => store.isMember('keyValue')).to.throw(errorMsg)
        })

        it('fails with invalid value', async () => {
          const errorMsg = 'Value must be provided and must be a string.'

          await expect(() => store.isMember(undefined)).to.throw(errorMsg)
          await expect(() => store.isMember(null)).to.throw(errorMsg)
          await expect(() => store.isMember(false)).to.throw(errorMsg)
          await expect(() => store.isMember(0)).to.throw(errorMsg)
          await expect(() => store.isMember(123)).to.throw(errorMsg)
          await expect(() => store.isMember('')).to.throw(errorMsg)
          await expect(() => store.isMember({})).to.throw(errorMsg)
          await expect(() => store.isMember(() => undefined)).to.throw(errorMsg)
          await expect(() => store.isMember(true)).to.throw(errorMsg)
        })
      })

      describe('Length', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.length()

          expect(request).to.deep.include({
            method: 'GET',
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}/length`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when store created without key', async () => {
          store = Backendless.Hive(hiveName).SetStore()

          const errorMsg = 'Store must be created with store key.'

          await expect(() => store.length()).to.throw(errorMsg)
        })
      })

      describe('Difference', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.difference(['set1', 'set2'])

          expect(request).to.deep.include({
            method: 'POST',
            path  : `${APP_PATH}/hive/${hiveName}/set/action/difference`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when store keys argument is invalid', async () => {
          const errorMsg = 'Store keys must be provided and must be an array.'

          await expect(() => store.difference(undefined)).to.throw(errorMsg)
          await expect(() => store.difference(null)).to.throw(errorMsg)
          await expect(() => store.difference(false)).to.throw(errorMsg)
          await expect(() => store.difference(0)).to.throw(errorMsg)
          await expect(() => store.difference(123)).to.throw(errorMsg)
          await expect(() => store.difference('')).to.throw(errorMsg)
          await expect(() => store.difference({})).to.throw(errorMsg)
          await expect(() => store.difference(() => undefined)).to.throw(errorMsg)
          await expect(() => store.difference(true)).to.throw(errorMsg)
        })
      })

      describe('Intersection', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.intersection(['set1', 'set2'])

          expect(request).to.deep.include({
            method: 'POST',
            path  : `${APP_PATH}/hive/${hiveName}/set/action/intersection`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when store keys argument is invalid', async () => {
          const errorMsg = 'Store keys must be provided and must be an array.'

          await expect(() => store.intersection(undefined)).to.throw(errorMsg)
          await expect(() => store.intersection(null)).to.throw(errorMsg)
          await expect(() => store.intersection(false)).to.throw(errorMsg)
          await expect(() => store.intersection(0)).to.throw(errorMsg)
          await expect(() => store.intersection(123)).to.throw(errorMsg)
          await expect(() => store.intersection('')).to.throw(errorMsg)
          await expect(() => store.intersection({})).to.throw(errorMsg)
          await expect(() => store.intersection(() => undefined)).to.throw(errorMsg)
          await expect(() => store.intersection(true)).to.throw(errorMsg)
        })
      })

      describe('Union', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.union(['set1', 'set2'])

          expect(request).to.deep.include({
            method: 'POST',
            path  : `${APP_PATH}/hive/${hiveName}/set/action/union`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when store keys argument is invalid', async () => {
          const errorMsg = 'Store keys must be provided and must be an array.'

          await expect(() => store.union(undefined)).to.throw(errorMsg)
          await expect(() => store.union(null)).to.throw(errorMsg)
          await expect(() => store.union(false)).to.throw(errorMsg)
          await expect(() => store.union(0)).to.throw(errorMsg)
          await expect(() => store.union(123)).to.throw(errorMsg)
          await expect(() => store.union('')).to.throw(errorMsg)
          await expect(() => store.union({})).to.throw(errorMsg)
          await expect(() => store.union(() => undefined)).to.throw(errorMsg)
          await expect(() => store.union(true)).to.throw(errorMsg)
        })
      })
    })
  })
})
