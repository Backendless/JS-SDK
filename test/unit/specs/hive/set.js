import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forTest, prepareMockRequest } from '../../helpers/sandbox'

describe('Set Store', function() {
  forTest(this)

  const hiveName = 'test'

  describe('Methods', () => {
    const fakeResult = { foo: true }

    let store

    describe('Basic', () => {
      beforeEach(() => {
        store = Backendless.Hive(hiveName).SetStore()
      })

      describe('Store Keys', async () => {
        it('success', async () => {
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.storeKeys()

          expect(req1).to.deep.include({
            method: 'GET',
            path  : `${APP_PATH}/hive/${hiveName}/set/keys`,
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
            path  : `${APP_PATH}/hive/${hiveName}/set/keys?filterPattern=123&cursor=20&pageSize=30`,
          })

          expect(result1).to.be.eql(fakeResult)
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
          const req1 = prepareMockRequest(fakeResult)

          const result1 = await store.delete('testKey')

          expect(req1).to.deep.include({
            method : 'DELETE',
            path   : `${APP_PATH}/hive/${hiveName}/set`,
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
            path   : `${APP_PATH}/hive/${hiveName}/set`,
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
            path   : `${APP_PATH}/hive/${hiveName}/set/exists`,
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
            path   : `${APP_PATH}/hive/${hiveName}/set/exists`,
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
            path  : `${APP_PATH}/hive/${hiveName}/set/testKey1/rename?newKey=testKey2`,
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
            path  : `${APP_PATH}/hive/${hiveName}/set/testKey1/rename-if-not-exists?newKey=testKey2`,
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
            path  : `${APP_PATH}/hive/${hiveName}/set/testKey1/get-expiration-ttl`,
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
            path  : `${APP_PATH}/hive/${hiveName}/set/testKey1/remove-expiration`,
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
            path  : `${APP_PATH}/hive/${hiveName}/set/testKey1/expire?ttl=100`,
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
            path  : `${APP_PATH}/hive/${hiveName}/set/testKey1/expire-at?unixTime=100`,
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
            path   : `${APP_PATH}/hive/${hiveName}/set/touch`,
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
            path   : `${APP_PATH}/hive/${hiveName}/set/touch`,
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
