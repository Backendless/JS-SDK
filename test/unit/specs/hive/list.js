import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forTest, prepareMockRequest } from '../../helpers/sandbox'

describe('Hive - List Store', function() {
  forTest(this)

  const hiveName = 'testHiveName'
  const storeKey = 'testStoreKey'

  const fakeResult = { foo: true }

  let store
  let Store

  beforeEach(() => {
    Store = Backendless.Hive(hiveName).ListStore
    store = Backendless.Hive(hiveName).ListStore(storeKey)
  })

  describe('General Methods', () => {
    describe('Static Methods', () => {

      describe('Keys', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await Store.keys()

          expect(request).to.deep.include({
            method: 'GET',
            path  : `${APP_PATH}/hive/${hiveName}/list/keys`,
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
            path  : `${APP_PATH}/hive/${hiveName}/list/keys?filterPattern=123&cursor=20&pageSize=30`,
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
            path   : `${APP_PATH}/hive/${hiveName}/list`,
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
            path   : `${APP_PATH}/hive/${hiveName}/list/action/exists`,
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
            path   : `${APP_PATH}/hive/${hiveName}/list/action/touch`,
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

        await expect(() => hive.ListStore()).to.throw(errorMsg)
        await expect(() => hive.ListStore('')).to.throw(errorMsg)
        await expect(() => hive.ListStore(null)).to.throw(errorMsg)
        await expect(() => hive.ListStore(0)).to.throw(errorMsg)
        await expect(() => hive.ListStore(false)).to.throw(errorMsg)
        await expect(() => hive.ListStore(true)).to.throw(errorMsg)
        await expect(() => hive.ListStore(123)).to.throw(errorMsg)
        await expect(() => hive.ListStore(() => undefined)).to.throw(errorMsg)
        await expect(() => hive.ListStore({})).to.throw(errorMsg)
      })

      describe('Delete', () => {
        it('success with single key', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.delete()

          expect(request).to.deep.include({
            method : 'DELETE',
            path   : `${APP_PATH}/hive/${hiveName}/list`,
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
            path   : `${APP_PATH}/hive/${hiveName}/list/action/exists`,
            headers: { 'Content-Type': 'application/json' },
            body   : [storeKey]
          })

          expect(req2).to.deep.include({
            method : 'POST',
            path   : `${APP_PATH}/hive/${hiveName}/list/action/exists`,
            headers: { 'Content-Type': 'application/json' },
            body   : [storeKey]
          })

          expect(result1).to.be.eql(true)
          expect(result2).to.be.eql(false)
        })
      })

      describe('Rename', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.rename('testKey2')

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/list/${storeKey}/rename?newKey=testKey2`,
          })

          expect(result).to.be.eql(fakeResult)
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

      describe('Rename If Not Exists', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.renameIfNotExists('testKey2')

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/list/${storeKey}/rename-if-not-exists?newKey=testKey2`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when new key name is invalid', async () => {
          const errorMsg = 'New key name must be provided and must be a string.'

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

          const result = await store.getExpiration()

          expect(request).to.deep.include({
            method: 'GET',
            path  : `${APP_PATH}/hive/${hiveName}/list/${storeKey}/get-expiration-ttl`,
          })

          expect(result).to.be.eql(fakeResult)
        })

      })

      describe('Remove Expiration', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.removeExpiration()

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/list/${storeKey}/remove-expiration`,
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
            path  : `${APP_PATH}/hive/${hiveName}/list/${storeKey}/expire?ttl=100`,
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
            path  : `${APP_PATH}/hive/${hiveName}/list/${storeKey}/expire-at?unixTime=100`,
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
            path   : `${APP_PATH}/hive/${hiveName}/list/action/touch`,
            headers: { 'Content-Type': 'application/json' },
            body   : [storeKey]
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
          method: 'PUT',
          path  : `${APP_PATH}/hive/${hiveName}/list/${storeKey}/0`,
          body  : {
            value: 'value1'
          }
        })

        expect(result).to.be.eql(fakeResult)
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

    })

    describe('Insert Before', async () => {
      it('success', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.insertBefore('valueToInsert1', 'anchorValue1')

        expect(request).to.deep.include({
          method : 'PUT',
          path   : `${APP_PATH}/hive/${hiveName}/list/${storeKey}/insert/before`,
          headers: { 'Content-Type': 'application/json' },
          body   : {
            valueToInsert: 'valueToInsert1',
            anchorValue  : 'anchorValue1',
          }
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('fails with invalid ValueToInsert', async () => {
        const errorMsg = 'ValueToInsert must be provided and must be a string.'

        await expect(() => store.insertBefore(undefined, 'v')).to.throw(errorMsg)
        await expect(() => store.insertBefore(null, 'v')).to.throw(errorMsg)
        await expect(() => store.insertBefore(false, 'v')).to.throw(errorMsg)
        await expect(() => store.insertBefore(true, 'v')).to.throw(errorMsg)
        await expect(() => store.insertBefore(0, 'v')).to.throw(errorMsg)
        await expect(() => store.insertBefore(123, 'v')).to.throw(errorMsg)
        await expect(() => store.insertBefore('', 'v')).to.throw(errorMsg)
        await expect(() => store.insertBefore({}, 'v')).to.throw(errorMsg)
        await expect(() => store.insertBefore([], 'v')).to.throw(errorMsg)
        await expect(() => store.insertBefore(() => undefined, 'v')).to.throw(errorMsg)
      })

      it('fails with invalid AnchorValue', async () => {
        const errorMsg = 'AnchorValue must be provided and must be a string.'

        await expect(() => store.insertBefore('v', undefined)).to.throw(errorMsg)
        await expect(() => store.insertBefore('v', null)).to.throw(errorMsg)
        await expect(() => store.insertBefore('v', false)).to.throw(errorMsg)
        await expect(() => store.insertBefore('v', 0)).to.throw(errorMsg)
        await expect(() => store.insertBefore('v', '')).to.throw(errorMsg)
        await expect(() => store.insertBefore('v', true)).to.throw(errorMsg)
        await expect(() => store.insertBefore('v', 123)).to.throw(errorMsg)
        await expect(() => store.insertBefore('v', {})).to.throw(errorMsg)
        await expect(() => store.insertBefore('v', [])).to.throw(errorMsg)
        await expect(() => store.insertBefore('v', () => undefined)).to.throw(errorMsg)
      })
    })

    describe('Insert After', async () => {
      it('success', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.insertAfter('valueToInsert1', 'anchorValue1')

        expect(request).to.deep.include({
          method : 'PUT',
          path   : `${APP_PATH}/hive/${hiveName}/list/${storeKey}/insert/after`,
          headers: { 'Content-Type': 'application/json' },
          body   : {
            valueToInsert: 'valueToInsert1',
            anchorValue  : 'anchorValue1',
          }
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('fails with invalid ValueToInsert', async () => {
        const errorMsg = 'ValueToInsert must be provided and must be a string.'

        await expect(() => store.insertAfter(undefined, 'v')).to.throw(errorMsg)
        await expect(() => store.insertAfter(null, 'v')).to.throw(errorMsg)
        await expect(() => store.insertAfter(false, 'v')).to.throw(errorMsg)
        await expect(() => store.insertAfter(true, 'v')).to.throw(errorMsg)
        await expect(() => store.insertAfter(0, 'v')).to.throw(errorMsg)
        await expect(() => store.insertAfter(123, 'v')).to.throw(errorMsg)
        await expect(() => store.insertAfter('', 'v')).to.throw(errorMsg)
        await expect(() => store.insertAfter({}, 'v')).to.throw(errorMsg)
        await expect(() => store.insertAfter([], 'v')).to.throw(errorMsg)
        await expect(() => store.insertAfter(() => undefined, 'v')).to.throw(errorMsg)
      })

      it('fails with invalid AnchorValue', async () => {
        const errorMsg = 'AnchorValue must be provided and must be a string.'

        await expect(() => store.insertAfter('v', undefined)).to.throw(errorMsg)
        await expect(() => store.insertAfter('v', null)).to.throw(errorMsg)
        await expect(() => store.insertAfter('v', false)).to.throw(errorMsg)
        await expect(() => store.insertAfter('v', 0)).to.throw(errorMsg)
        await expect(() => store.insertAfter('v', '')).to.throw(errorMsg)
        await expect(() => store.insertAfter('v', true)).to.throw(errorMsg)
        await expect(() => store.insertAfter('v', 123)).to.throw(errorMsg)
        await expect(() => store.insertAfter('v', {})).to.throw(errorMsg)
        await expect(() => store.insertAfter('v', [])).to.throw(errorMsg)
        await expect(() => store.insertAfter('v', () => undefined)).to.throw(errorMsg)
      })
    })

    describe('Remove Value', async () => {
      it('success', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.removeValue('value1')

        expect(request).to.deep.include({
          method: 'PUT',
          path  : `${APP_PATH}/hive/${hiveName}/list/${storeKey}/remove-value`,
          body  : {
            value: 'value1'
          }
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('success with count', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.removeValue('value1', 3)

        expect(request).to.deep.include({
          method: 'PUT',
          path  : `${APP_PATH}/hive/${hiveName}/list/${storeKey}/remove-value`,
          body  : {
            value: 'value1',
            count: 3,
          }
        })

        expect(result).to.be.eql(fakeResult)
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
