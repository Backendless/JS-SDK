import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forTest, prepareMockRequest } from '../../helpers/sandbox'

describe('List Store', function() {
  forTest(this)

  const hiveName = 'testHiveName'
  const storeKey = 'testStoreKey'

  describe('Methods', () => {
    const fakeResult = { foo: true }

    let store

    describe('Basic', () => {
      beforeEach(() => {
        store = Backendless.Hive(hiveName).ListStore()
      })

      describe('Store Keys', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.storeKeys()

          expect(request).to.deep.include({
            method: 'GET',
            path  : `${APP_PATH}/hive/${hiveName}/list/keys`,
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
            path  : `${APP_PATH}/hive/${hiveName}/list/keys?filterPattern=123&cursor=20&pageSize=30`,
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
            path   : `${APP_PATH}/hive/${hiveName}/list`,
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
            path   : `${APP_PATH}/hive/${hiveName}/list`,
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
            path   : `${APP_PATH}/hive/${hiveName}/list/exists`,
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
            path   : `${APP_PATH}/hive/${hiveName}/list/exists`,
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
            path  : `${APP_PATH}/hive/${hiveName}/list/testKey1/rename?newKey=testKey2`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when new key name is invalid', async () => {
          const errorMsg = 'New key name must be provided and must be a string.'

          await expect(() => store.rename('test', undefined)).to.throw(errorMsg)
          await expect(() => store.rename('test', null)).to.throw(errorMsg)
          await expect(() => store.rename('test', false)).to.throw(errorMsg)
          await expect(() => store.rename('test', true)).to.throw(errorMsg)
          await expect(() => store.rename('test', 0)).to.throw(errorMsg)
          await expect(() => store.rename('test', 123)).to.throw(errorMsg)
          await expect(() => store.rename('test', () => undefined)).to.throw(errorMsg)
          await expect(() => store.rename('test', {})).to.throw(errorMsg)
        })

        it('fails when old key name is invalid', async () => {
          const errorMsg = 'Old key name must be provided and must be a string.'

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

      describe('Rename If Not Exists', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.renameIfNotExists('testKey1', 'testKey2')

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/list/testKey1/rename-if-not-exists?newKey=testKey2`,
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
            path  : `${APP_PATH}/hive/${hiveName}/list/testKey1/get-expiration-ttl`,
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
            path  : `${APP_PATH}/hive/${hiveName}/list/testKey1/remove-expiration`,
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
            path  : `${APP_PATH}/hive/${hiveName}/list/testKey1/expire?ttl=100`,
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
            path  : `${APP_PATH}/hive/${hiveName}/list/testKey1/expire-at?unixTime=100`,
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
            path   : `${APP_PATH}/hive/${hiveName}/list/touch`,
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
            path   : `${APP_PATH}/hive/${hiveName}/list/touch`,
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

    describe('Store related', ()=> {
      beforeEach(() => {
        store = Backendless.Hive(hiveName).ListStore(storeKey)
      })

      describe('Get', () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.get()

          expect(request).to.deep.include({
            method: 'GET',
            path  : `${APP_PATH}/hive/${hiveName}/list/${storeKey}`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('success with index', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.get(0)

          expect(request).to.deep.include({
            method: 'GET',
            path  : `${APP_PATH}/hive/${hiveName}/list/${storeKey}/0`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('success with range', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.get(0, 3)

          expect(request).to.deep.include({
            method: 'GET',
            path  : `${APP_PATH}/hive/${hiveName}/list/${storeKey}?from=0&to=3`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when store created without key', async () => {
          store = Backendless.Hive(hiveName).ListStore()

          const errorMsg = 'Store must be created with store key.'

          await expect(() => store.get()).to.throw(errorMsg)
        })

        it('fails when Index is invalid', async () => {
          const errorMsg = 'Index must be a number.'

          await expect(() => store.get(null)).to.throw(errorMsg)
          await expect(() => store.get(NaN)).to.throw(errorMsg)
          await expect(() => store.get(false)).to.throw(errorMsg)
          await expect(() => store.get('')).to.throw(errorMsg)
          await expect(() => store.get('qwe')).to.throw(errorMsg)
          await expect(() => store.get(true)).to.throw(errorMsg)
          await expect(() => store.get(() => undefined)).to.throw(errorMsg)
          await expect(() => store.get({})).to.throw(errorMsg)
        })

        it('fails when Index To is invalid', async () => {
          const errorMsg = 'Index To must be a number.'

          await expect(() => store.get(1, null)).to.throw(errorMsg)
          await expect(() => store.get(1, NaN)).to.throw(errorMsg)
          await expect(() => store.get(1, false)).to.throw(errorMsg)
          await expect(() => store.get(1, '')).to.throw(errorMsg)
          await expect(() => store.get(1, 'qwe')).to.throw(errorMsg)
          await expect(() => store.get(1, true)).to.throw(errorMsg)
          await expect(() => store.get(1, () => undefined)).to.throw(errorMsg)
          await expect(() => store.get(1, {})).to.throw(errorMsg)
        })

        it('fails when Index From is invalid', async () => {
          const errorMsg = 'Index From must be a number.'

          await expect(() => store.get(null, 1)).to.throw(errorMsg)
          await expect(() => store.get(NaN, 1)).to.throw(errorMsg)
          await expect(() => store.get(false, 1)).to.throw(errorMsg)
          await expect(() => store.get('', 1)).to.throw(errorMsg)
          await expect(() => store.get('qwe', 1)).to.throw(errorMsg)
          await expect(() => store.get(true, 1)).to.throw(errorMsg)
          await expect(() => store.get(() => undefined, 1)).to.throw(errorMsg)
          await expect(() => store.get({}, 1)).to.throw(errorMsg)
        })
      })

      describe('Set', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.set(['value1', 'value2'])

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/list/${storeKey}`,
            body  : ['value1', 'value2']
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('success with index', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.set('value1', 0)

          expect(request).to.deep.include({
            method : 'PUT',
            path   : `${APP_PATH}/hive/${hiveName}/list/${storeKey}/0`,
            headers: { 'Content-Type': 'text/plain' },
            body   : 'value1'
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when store created without key', async () => {
          store = Backendless.Hive(hiveName).ListStore()

          const errorMsg = 'Store must be created with store key.'

          await expect(() => store.set('value', 0)).to.throw(errorMsg)
        })

        it('fails with invalid index', async () => {
          store = Backendless.Hive(hiveName).ListStore(storeKey)

          const errorMsg = 'Index must be a number.'

          await expect(() => store.set('v', null)).to.throw(errorMsg)
          await expect(() => store.set('v', NaN)).to.throw(errorMsg)
          await expect(() => store.set('v', false)).to.throw(errorMsg)
          await expect(() => store.set('v', '')).to.throw(errorMsg)
          await expect(() => store.set('v', 'qwe')).to.throw(errorMsg)
          await expect(() => store.set('v', true)).to.throw(errorMsg)
          await expect(() => store.set('v', () => undefined)).to.throw(errorMsg)
          await expect(() => store.set('v', {})).to.throw(errorMsg)
        })
      })

      describe('Length', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.length()

          expect(request).to.deep.include({
            method: 'GET',
            path  : `${APP_PATH}/hive/${hiveName}/list/${storeKey}/length`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when store created without key', async () => {
          store = Backendless.Hive(hiveName).ListStore()

          const errorMsg = 'Store must be created with store key.'

          await expect(() => store.length()).to.throw(errorMsg)
        })
      })

      describe('Insert', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.insert('target', 'value')

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/list/${storeKey}/insert`,
            body  : { 'targetValue': 'target', 'value': 'value', }
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('success with before argument', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.insert('target', 'value', false)

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/list/${storeKey}/insert`,
            body  : { 'targetValue': 'target', 'value': 'value', 'before': false }
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when store created without key', async () => {
          store = Backendless.Hive(hiveName).ListStore()

          const errorMsg = 'Store must be created with store key.'

          await expect(() => store.insert('keyValue', 'newValue')).to.throw(errorMsg)
        })

        it('fails with invalid targetValue', async () => {
          const errorMsg = 'Target Value must be provided and must be a string.'

          await expect(() => store.insert(undefined, 'v')).to.throw(errorMsg)
          await expect(() => store.insert(null, 'v')).to.throw(errorMsg)
          await expect(() => store.insert(false, 'v')).to.throw(errorMsg)
          await expect(() => store.insert(true, 'v')).to.throw(errorMsg)
          await expect(() => store.insert(0, 'v')).to.throw(errorMsg)
          await expect(() => store.insert(123, 'v')).to.throw(errorMsg)
          await expect(() => store.insert('', 'v')).to.throw(errorMsg)
          await expect(() => store.insert({}, 'v')).to.throw(errorMsg)
          await expect(() => store.insert([], 'v')).to.throw(errorMsg)
          await expect(() => store.insert(() => undefined, 'v')).to.throw(errorMsg)
        })

        it('fails with invalid value', async () => {
          const errorMsg = 'Value must be provided and must be a string.'

          await expect(() => store.insert('v', undefined)).to.throw(errorMsg)
          await expect(() => store.insert('v', null)).to.throw(errorMsg)
          await expect(() => store.insert('v', false)).to.throw(errorMsg)
          await expect(() => store.insert('v', 0)).to.throw(errorMsg)
          await expect(() => store.insert('v', '')).to.throw(errorMsg)
          await expect(() => store.insert('v', true)).to.throw(errorMsg)
          await expect(() => store.insert('v', 123)).to.throw(errorMsg)
          await expect(() => store.insert('v', {})).to.throw(errorMsg)
          await expect(() => store.insert('v', [])).to.throw(errorMsg)
          await expect(() => store.insert('v', () => undefined)).to.throw(errorMsg)
        })

        it('fails with invalid before argument', async () => {
          const errorMsg = 'Argument Before must be a boolean.'

          await expect(() => store.insert('v', 'v', null)).to.throw(errorMsg)
          await expect(() => store.insert('v', 'v', {})).to.throw(errorMsg)
          await expect(() => store.insert('v', 'v', [])).to.throw(errorMsg)
          await expect(() => store.insert('v', 'v', 0)).to.throw(errorMsg)
          await expect(() => store.insert('v', 'v', 123)).to.throw(errorMsg)
          await expect(() => store.insert('v', 'v', '')).to.throw(errorMsg)
          await expect(() => store.insert('v', 'v', '123')).to.throw(errorMsg)
          await expect(() => store.insert('v', 'v', () => undefined)).to.throw(errorMsg)
        })
      })

      describe('Remove Value', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.removeValue('value')

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/list/${storeKey}/remove-value`,
            body  : 'value'
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('success with count', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.removeValue('value', 3)

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/list/${storeKey}/remove-value?count=3`,
            body  : 'value'
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when store created without key', async () => {
          store = Backendless.Hive(hiveName).ListStore()

          const errorMsg = 'Store must be created with store key.'

          await expect(() => store.removeValue('keyValue')).to.throw(errorMsg)
        })

        it('fails with invalid value', async () => {
          const errorMsg = 'Value must be provided and must be a string.'

          await expect(() => store.removeValue(undefined)).to.throw(errorMsg)
          await expect(() => store.removeValue(null)).to.throw(errorMsg)
          await expect(() => store.removeValue(false)).to.throw(errorMsg)
          await expect(() => store.removeValue(true)).to.throw(errorMsg)
          await expect(() => store.removeValue(0)).to.throw(errorMsg)
          await expect(() => store.removeValue(123)).to.throw(errorMsg)
          await expect(() => store.removeValue('')).to.throw(errorMsg)
          await expect(() => store.removeValue({})).to.throw(errorMsg)
          await expect(() => store.removeValue([])).to.throw(errorMsg)
          await expect(() => store.removeValue(() => undefined)).to.throw(errorMsg)
        })

        it('fails with invalid count', async () => {
          const errorMsg = 'Count must be a number.'

          await expect(() => store.removeValue('v', null)).to.throw(errorMsg)
          await expect(() => store.removeValue('v', NaN)).to.throw(errorMsg)
          await expect(() => store.removeValue('v', false)).to.throw(errorMsg)
          await expect(() => store.removeValue('v', '')).to.throw(errorMsg)
          await expect(() => store.removeValue('v', 'qwe')).to.throw(errorMsg)
          await expect(() => store.removeValue('v', true)).to.throw(errorMsg)
          await expect(() => store.removeValue('v', () => undefined)).to.throw(errorMsg)
          await expect(() => store.removeValue('v', {})).to.throw(errorMsg)
        })
      })

      describe('Add First', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.addFirst('value')

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/list/${storeKey}/add-first`,
            body  : ['value']
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('success with array of values', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.addFirst(['value1', 'value2'])

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/list/${storeKey}/add-first`,
            body  : ['value1', 'value2']
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when store created without key', async () => {
          store = Backendless.Hive(hiveName).ListStore()

          const errorMsg = 'Store must be created with store key.'

          await expect(() => store.addFirst('keyValue')).to.throw(errorMsg)
        })

        it('fails with invalid value', async () => {
          const errorMsg = 'Value(s) must be provided and must be a string or list of strings.'

          await expect(() => store.addFirst(undefined)).to.throw(errorMsg)
          await expect(() => store.addFirst(null)).to.throw(errorMsg)
          await expect(() => store.addFirst(false)).to.throw(errorMsg)
          await expect(() => store.addFirst(0)).to.throw(errorMsg)
          await expect(() => store.addFirst(123)).to.throw(errorMsg)
          await expect(() => store.addFirst('')).to.throw(errorMsg)
          await expect(() => store.addFirst({})).to.throw(errorMsg)
          await expect(() => store.addFirst(() => undefined)).to.throw(errorMsg)
          await expect(() => store.addFirst(true)).to.throw(errorMsg)
        })
      })

      describe('Add Last', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.addLast('value')

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/list/${storeKey}/add-last`,
            body  : ['value']
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('success with array of values', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.addLast(['value1', 'value2'])

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/list/${storeKey}/add-last`,
            body  : ['value1', 'value2']
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when store created without key', async () => {
          store = Backendless.Hive(hiveName).ListStore()

          const errorMsg = 'Store must be created with store key.'

          await expect(() => store.addLast('keyValue')).to.throw(errorMsg)
        })

        it('fails with invalid value', async () => {
          const errorMsg = 'Value(s) must be provided and must be a string or list of strings.'

          await expect(() => store.addLast(undefined)).to.throw(errorMsg)
          await expect(() => store.addLast(null)).to.throw(errorMsg)
          await expect(() => store.addLast(false)).to.throw(errorMsg)
          await expect(() => store.addLast(0)).to.throw(errorMsg)
          await expect(() => store.addLast(123)).to.throw(errorMsg)
          await expect(() => store.addLast('')).to.throw(errorMsg)
          await expect(() => store.addLast({})).to.throw(errorMsg)
          await expect(() => store.addLast(() => undefined)).to.throw(errorMsg)
          await expect(() => store.addLast(true)).to.throw(errorMsg)
        })
      })

      describe('Remove First', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.removeFirst()

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/list/${storeKey}/get-first-and-remove`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('success with count', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.removeFirst(3)

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/list/${storeKey}/get-first-and-remove?count=3`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when store created without key', async () => {
          store = Backendless.Hive(hiveName).ListStore()

          const errorMsg = 'Store must be created with store key.'

          await expect(() => store.removeFirst()).to.throw(errorMsg)
        })

        it('fails with invalid count', async () => {
          const errorMsg = 'Count must be a number.'

          await expect(() => store.removeFirst(null)).to.throw(errorMsg)
          await expect(() => store.removeFirst(NaN)).to.throw(errorMsg)
          await expect(() => store.removeFirst(false)).to.throw(errorMsg)
          await expect(() => store.removeFirst('')).to.throw(errorMsg)
          await expect(() => store.removeFirst('qwe')).to.throw(errorMsg)
          await expect(() => store.removeFirst(true)).to.throw(errorMsg)
          await expect(() => store.removeFirst(() => undefined)).to.throw(errorMsg)
          await expect(() => store.removeFirst({})).to.throw(errorMsg)
        })
      })

      describe('Remove Last', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.removeLast()

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/list/${storeKey}/get-last-and-remove`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('success with count', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.removeLast(3)

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/list/${storeKey}/get-last-and-remove?count=3`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when store created without key', async () => {
          store = Backendless.Hive(hiveName).ListStore()

          const errorMsg = 'Store must be created with store key.'

          await expect(() => store.removeLast()).to.throw(errorMsg)
        })

        it('fails with invalid count', async () => {
          const errorMsg = 'Count must be a number.'

          await expect(() => store.removeLast(null)).to.throw(errorMsg)
          await expect(() => store.removeLast(NaN)).to.throw(errorMsg)
          await expect(() => store.removeLast(false)).to.throw(errorMsg)
          await expect(() => store.removeLast('')).to.throw(errorMsg)
          await expect(() => store.removeLast('qwe')).to.throw(errorMsg)
          await expect(() => store.removeLast(true)).to.throw(errorMsg)
          await expect(() => store.removeLast(() => undefined)).to.throw(errorMsg)
          await expect(() => store.removeLast({})).to.throw(errorMsg)
        })
      })
    })
  })
})
