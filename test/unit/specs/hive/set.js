import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forTest, prepareMockRequest } from '../../helpers/sandbox'

describe('Hive - Set Store', function() {
  forTest(this)

  const hiveName = 'testHiveName'
  const storeKey = 'testStoreKey'

  const fakeResult = { foo: true }

  let store
  let Store

  beforeEach(() => {
    Store = Backendless.Hive(hiveName).SetStore
    store = Backendless.Hive(hiveName).SetStore(storeKey)
  })

  describe('General Methods', () => {
    describe('Static Methods', () => {
      describe('Keys', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await Store.keys()

          expect(request).to.deep.include({
            method: 'GET',
            path  : `${APP_PATH}/hive/${hiveName}/set/keys`,
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
            path  : `${APP_PATH}/hive/${hiveName}/set/keys?filterPattern=123&cursor=20&pageSize=30`,
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
            path   : `${APP_PATH}/hive/${hiveName}/set`,
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
            path   : `${APP_PATH}/hive/${hiveName}/set/action/exists`,
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
            path   : `${APP_PATH}/hive/${hiveName}/set/action/touch`,
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

        await expect(() => hive.SetStore()).to.throw(errorMsg)
        await expect(() => hive.SetStore('')).to.throw(errorMsg)
        await expect(() => hive.SetStore(null)).to.throw(errorMsg)
        await expect(() => hive.SetStore(0)).to.throw(errorMsg)
        await expect(() => hive.SetStore(false)).to.throw(errorMsg)
        await expect(() => hive.SetStore(true)).to.throw(errorMsg)
        await expect(() => hive.SetStore(123)).to.throw(errorMsg)
        await expect(() => hive.SetStore(() => undefined)).to.throw(errorMsg)
        await expect(() => hive.SetStore({})).to.throw(errorMsg)
      })

      describe('Delete', () => {
        it('success with single key', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.delete()

          expect(request).to.deep.include({
            method : 'DELETE',
            path   : `${APP_PATH}/hive/${hiveName}/set`,
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
            path   : `${APP_PATH}/hive/${hiveName}/set/action/exists`,
            headers: { 'Content-Type': 'application/json' },
            body   : [storeKey]
          })

          expect(req2).to.deep.include({
            method : 'POST',
            path   : `${APP_PATH}/hive/${hiveName}/set/action/exists`,
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
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}/rename?newKey=testKey2`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('rename with overwrite=true', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.rename('testKey2', true)

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}/rename?newKey=testKey2&overwrite=true`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('rename with overwrite=false', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.rename('testKey2', false)

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}/rename?newKey=testKey2&overwrite=false`,
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
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}/get-expiration-ttl`,
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
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}/clear-expiration`,
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
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}/expire?ttl=100`,
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
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}/expire-at?unixTime=100`,
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
            path   : `${APP_PATH}/hive/${hiveName}/set/action/touch`,
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
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}/seconds-since-last-operation`,
          })

          expect(result).to.be.eql(fakeResult)
        })
      })
    })
  })

  describe('Static Methods', () => {
    describe('Difference', async () => {
      it('success', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await Store.difference(['set1', 'set2'])

        expect(request).to.deep.include({
          method: 'POST',
          path  : `${APP_PATH}/hive/${hiveName}/set/action/difference`,
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('fails when store keys argument is invalid', async () => {
        const errorMsg = 'Store keys must be provided and must be an array.'

        await expect(() => Store.difference(undefined)).to.throw(errorMsg)
        await expect(() => Store.difference(null)).to.throw(errorMsg)
        await expect(() => Store.difference(false)).to.throw(errorMsg)
        await expect(() => Store.difference(0)).to.throw(errorMsg)
        await expect(() => Store.difference(123)).to.throw(errorMsg)
        await expect(() => Store.difference('')).to.throw(errorMsg)
        await expect(() => Store.difference({})).to.throw(errorMsg)
        await expect(() => Store.difference(() => undefined)).to.throw(errorMsg)
        await expect(() => Store.difference(true)).to.throw(errorMsg)
      })
    })

    describe('Intersection', async () => {
      it('success', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await Store.intersection(['set1', 'set2'])

        expect(request).to.deep.include({
          method: 'POST',
          path  : `${APP_PATH}/hive/${hiveName}/set/action/intersection`,
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('fails when store keys argument is invalid', async () => {
        const errorMsg = 'Store keys must be provided and must be an array.'

        await expect(() => Store.intersection(undefined)).to.throw(errorMsg)
        await expect(() => Store.intersection(null)).to.throw(errorMsg)
        await expect(() => Store.intersection(false)).to.throw(errorMsg)
        await expect(() => Store.intersection(0)).to.throw(errorMsg)
        await expect(() => Store.intersection(123)).to.throw(errorMsg)
        await expect(() => Store.intersection('')).to.throw(errorMsg)
        await expect(() => Store.intersection({})).to.throw(errorMsg)
        await expect(() => Store.intersection(() => undefined)).to.throw(errorMsg)
        await expect(() => Store.intersection(true)).to.throw(errorMsg)
      })
    })

    describe('Union', async () => {
      it('success', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await Store.union(['set1', 'set2'])

        expect(request).to.deep.include({
          method: 'POST',
          path  : `${APP_PATH}/hive/${hiveName}/set/action/union`,
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('fails when store keys argument is invalid', async () => {
        const errorMsg = 'Store keys must be provided and must be an array.'

        await expect(() => Store.union(undefined)).to.throw(errorMsg)
        await expect(() => Store.union(null)).to.throw(errorMsg)
        await expect(() => Store.union(false)).to.throw(errorMsg)
        await expect(() => Store.union(0)).to.throw(errorMsg)
        await expect(() => Store.union(123)).to.throw(errorMsg)
        await expect(() => Store.union('')).to.throw(errorMsg)
        await expect(() => Store.union({})).to.throw(errorMsg)
        await expect(() => Store.union(() => undefined)).to.throw(errorMsg)
        await expect(() => Store.union(true)).to.throw(errorMsg)
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
          path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}`,
        })

        expect(result).to.be.eql(fakeResult)
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

    describe('Set Value', async () => {
      it('success values', async () => {
        const composeRequest = async value => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.setValue(value)

          const payload = {
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}`,
            body  : [value]
          }

          return { request, result, payload }
        }

        const request1 = await composeRequest('string')
        const request2 = await composeRequest('')
        const request3 = await composeRequest(false)
        const request4 = await composeRequest(true)
        const request5 = await composeRequest([])
        const request6 = await composeRequest(123)
        const request7 = await composeRequest(0)
        const request8 = await composeRequest({ a: 1 })

        expect(request1.request).to.deep.include(request1.payload)
        expect(request2.request).to.deep.include(request2.payload)
        expect(request3.request).to.deep.include(request3.payload)
        expect(request4.request).to.deep.include(request4.payload)
        expect(request5.request).to.deep.include(request5.payload)
        expect(request6.request).to.deep.include(request6.payload)
        expect(request7.request).to.deep.include(request7.payload)
        expect(request8.request).to.deep.include(request8.payload)

        expect(request1.result).to.be.eql(fakeResult)
        expect(request2.result).to.be.eql(fakeResult)
        expect(request3.result).to.be.eql(fakeResult)
        expect(request4.result).to.be.eql(fakeResult)
        expect(request5.result).to.be.eql(fakeResult)
        expect(request6.result).to.be.eql(fakeResult)
        expect(request7.result).to.be.eql(fakeResult)
        expect(request8.result).to.be.eql(fakeResult)
      })

      it('fails with invalid value', async () => {
        const errorMsg = 'Value must be provided and must be one of types: string, number, boolean, object, array.'

        await expect(() => store.setValue(undefined)).to.throw(errorMsg)
        await expect(() => store.setValue(null)).to.throw(errorMsg)
        await expect(() => store.setValue(() => true)).to.throw(errorMsg)
        await expect(() => store.setValue(10n)).to.throw(errorMsg)
        await expect(() => store.setValue(Symbol('id'))).to.throw(errorMsg)
        await expect(() => store.setValue([10n])).to.throw(errorMsg)
      })
    })

    describe('Set Values', async () => {
      it('success values', async () => {
        const composeRequest = async values => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.setValues(values)

          const payload = {
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}`,
            body  : values
          }

          return { request, result, payload }
        }

        const request1 = await composeRequest(['string'])
        const request2 = await composeRequest([''])
        const request3 = await composeRequest([false])
        const request4 = await composeRequest([true])
        const request5 = await composeRequest([[]])
        const request6 = await composeRequest([123])
        const request7 = await composeRequest([{ a: 1 }])

        expect(request1.request).to.deep.include(request1.payload)
        expect(request2.request).to.deep.include(request2.payload)
        expect(request3.request).to.deep.include(request3.payload)
        expect(request4.request).to.deep.include(request4.payload)
        expect(request5.request).to.deep.include(request5.payload)
        expect(request6.request).to.deep.include(request6.payload)
        expect(request7.request).to.deep.include(request7.payload)

        expect(request1.result).to.be.eql(fakeResult)
        expect(request2.result).to.be.eql(fakeResult)
        expect(request3.result).to.be.eql(fakeResult)
        expect(request4.result).to.be.eql(fakeResult)
        expect(request5.result).to.be.eql(fakeResult)
        expect(request6.result).to.be.eql(fakeResult)
        expect(request7.result).to.be.eql(fakeResult)
      })

      it('fails with invalid value', async () => {
        const errorMsg = 'Value must be provided and must be a list of valid JSON items.'

        await expect(() => store.setValues(undefined)).to.throw(errorMsg)
        await expect(() => store.setValues(null)).to.throw(errorMsg)
        await expect(() => store.setValues([])).to.throw(errorMsg)
        await expect(() => store.setValues('string')).to.throw(errorMsg)
        await expect(() => store.setValues('')).to.throw(errorMsg)
        await expect(() => store.setValues(0)).to.throw(errorMsg)
        await expect(() => store.setValues(false)).to.throw(errorMsg)
        await expect(() => store.setValues('')).to.throw(errorMsg)
        await expect(() => store.setValues(true)).to.throw(errorMsg)
        await expect(() => store.setValues(123)).to.throw(errorMsg)
        await expect(() => store.setValues(() => undefined)).to.throw(errorMsg)
        await expect(() => store.setValues({})).to.throw(errorMsg)
        await expect(() => store.setValues(Symbol('id'))).to.throw(errorMsg)
        await expect(() => store.setValues(10n)).to.throw(errorMsg)
        await expect(() => store.setValues([])).to.throw(errorMsg)
        await expect(() => store.setValues([10n])).to.throw(errorMsg)
      })
    })

    describe('Add Value', async () => {
      it('success values', async () => {
        const composeRequest = async value => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.addValue(value)

          const payload = {
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}/add`,
            body  : [value]
          }

          return { request, result, payload }
        }

        const request1 = await composeRequest('string')
        const request2 = await composeRequest('')
        const request3 = await composeRequest(false)
        const request4 = await composeRequest(true)
        const request5 = await composeRequest([])
        const request6 = await composeRequest(123)
        const request7 = await composeRequest(0)
        const request8 = await composeRequest({ a: 1 })

        expect(request1.request).to.deep.include(request1.payload)
        expect(request2.request).to.deep.include(request2.payload)
        expect(request3.request).to.deep.include(request3.payload)
        expect(request4.request).to.deep.include(request4.payload)
        expect(request5.request).to.deep.include(request5.payload)
        expect(request6.request).to.deep.include(request6.payload)
        expect(request7.request).to.deep.include(request7.payload)
        expect(request8.request).to.deep.include(request8.payload)

        expect(request1.result).to.be.eql(fakeResult)
        expect(request2.result).to.be.eql(fakeResult)
        expect(request3.result).to.be.eql(fakeResult)
        expect(request4.result).to.be.eql(fakeResult)
        expect(request5.result).to.be.eql(fakeResult)
        expect(request6.result).to.be.eql(fakeResult)
        expect(request7.result).to.be.eql(fakeResult)
        expect(request8.result).to.be.eql(fakeResult)
      })

      it('fails with invalid value', async () => {
        const errorMsg = 'Value must be provided and must be one of types: string, number, boolean, object, array.'

        await expect(() => store.addValue(undefined)).to.throw(errorMsg)
        await expect(() => store.addValue(null)).to.throw(errorMsg)
        await expect(() => store.addValue(() => true)).to.throw(errorMsg)
        await expect(() => store.addValue(10n)).to.throw(errorMsg)
        await expect(() => store.addValue(Symbol('id'))).to.throw(errorMsg)
        await expect(() => store.addValue([10n])).to.throw(errorMsg)
      })
    })

    describe('Add Values', async () => {
      it('success values', async () => {
        const composeRequest = async values => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.addValues(values)

          const payload = {
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}/add`,
            body  : values
          }

          return { request, result, payload }
        }

        const request1 = await composeRequest(['string'])
        const request2 = await composeRequest([''])
        const request3 = await composeRequest([false])
        const request4 = await composeRequest([true])
        const request5 = await composeRequest([[]])
        const request6 = await composeRequest([123])
        const request7 = await composeRequest([{ a: 1 }])

        expect(request1.request).to.deep.include(request1.payload)
        expect(request2.request).to.deep.include(request2.payload)
        expect(request3.request).to.deep.include(request3.payload)
        expect(request4.request).to.deep.include(request4.payload)
        expect(request5.request).to.deep.include(request5.payload)
        expect(request6.request).to.deep.include(request6.payload)
        expect(request7.request).to.deep.include(request7.payload)

        expect(request1.result).to.be.eql(fakeResult)
        expect(request2.result).to.be.eql(fakeResult)
        expect(request3.result).to.be.eql(fakeResult)
        expect(request4.result).to.be.eql(fakeResult)
        expect(request5.result).to.be.eql(fakeResult)
        expect(request6.result).to.be.eql(fakeResult)
        expect(request7.result).to.be.eql(fakeResult)
      })

      it('fails with invalid value', async () => {
        const errorMsg = 'Value must be provided and must be a list of valid JSON items.'

        await expect(() => store.addValues(undefined)).to.throw(errorMsg)
        await expect(() => store.addValues(null)).to.throw(errorMsg)
        await expect(() => store.addValues([])).to.throw(errorMsg)
        await expect(() => store.addValues('string')).to.throw(errorMsg)
        await expect(() => store.addValues('')).to.throw(errorMsg)
        await expect(() => store.addValues(0)).to.throw(errorMsg)
        await expect(() => store.addValues(false)).to.throw(errorMsg)
        await expect(() => store.addValues('')).to.throw(errorMsg)
        await expect(() => store.addValues(true)).to.throw(errorMsg)
        await expect(() => store.addValues(123)).to.throw(errorMsg)
        await expect(() => store.addValues(() => undefined)).to.throw(errorMsg)
        await expect(() => store.addValues({})).to.throw(errorMsg)
        await expect(() => store.addValues(Symbol('id'))).to.throw(errorMsg)
        await expect(() => store.addValues(10n)).to.throw(errorMsg)
        await expect(() => store.addValues([])).to.throw(errorMsg)
        await expect(() => store.addValues([10n])).to.throw(errorMsg)
      })
    })

    describe('Delete Value', async () => {
      it('success values', async () => {
        const composeRequest = async value => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.deleteValue(value)

          const payload = {
            method: 'DELETE',
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}/values`,
            body  : [value]
          }

          return { request, result, payload }
        }

        const request1 = await composeRequest('string')
        const request2 = await composeRequest('')
        const request3 = await composeRequest(false)
        const request4 = await composeRequest(true)
        const request5 = await composeRequest([])
        const request6 = await composeRequest(123)
        const request7 = await composeRequest(0)
        const request8 = await composeRequest({ a: 1 })

        expect(request1.request).to.deep.include(request1.payload)
        expect(request2.request).to.deep.include(request2.payload)
        expect(request3.request).to.deep.include(request3.payload)
        expect(request4.request).to.deep.include(request4.payload)
        expect(request5.request).to.deep.include(request5.payload)
        expect(request6.request).to.deep.include(request6.payload)
        expect(request7.request).to.deep.include(request7.payload)
        expect(request8.request).to.deep.include(request8.payload)

        expect(request1.result).to.be.eql(fakeResult)
        expect(request2.result).to.be.eql(fakeResult)
        expect(request3.result).to.be.eql(fakeResult)
        expect(request4.result).to.be.eql(fakeResult)
        expect(request5.result).to.be.eql(fakeResult)
        expect(request6.result).to.be.eql(fakeResult)
        expect(request7.result).to.be.eql(fakeResult)
        expect(request8.result).to.be.eql(fakeResult)
      })

      it('fails with invalid value', async () => {
        const errorMsg = 'Value must be provided and must be one of types: string, number, boolean, object, array.'

        await expect(() => store.deleteValue(undefined)).to.throw(errorMsg)
        await expect(() => store.deleteValue(null)).to.throw(errorMsg)
        await expect(() => store.deleteValue(() => true)).to.throw(errorMsg)
        await expect(() => store.deleteValue(10n)).to.throw(errorMsg)
        await expect(() => store.deleteValue(Symbol('id'))).to.throw(errorMsg)
        await expect(() => store.deleteValue([10n])).to.throw(errorMsg)
      })
    })

    describe('Delete Values', async () => {
      it('success values', async () => {
        const composeRequest = async values => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.deleteValues(values)

          const payload = {
            method: 'DELETE',
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}/values`,
            body  : values
          }

          return { request, result, payload }
        }

        const request1 = await composeRequest(['string'])
        const request2 = await composeRequest([''])
        const request3 = await composeRequest([false])
        const request4 = await composeRequest([true])
        const request5 = await composeRequest([[]])
        const request6 = await composeRequest([123])
        const request7 = await composeRequest([{ a: 1 }])

        expect(request1.request).to.deep.include(request1.payload)
        expect(request2.request).to.deep.include(request2.payload)
        expect(request3.request).to.deep.include(request3.payload)
        expect(request4.request).to.deep.include(request4.payload)
        expect(request5.request).to.deep.include(request5.payload)
        expect(request6.request).to.deep.include(request6.payload)
        expect(request7.request).to.deep.include(request7.payload)

        expect(request1.result).to.be.eql(fakeResult)
        expect(request2.result).to.be.eql(fakeResult)
        expect(request3.result).to.be.eql(fakeResult)
        expect(request4.result).to.be.eql(fakeResult)
        expect(request5.result).to.be.eql(fakeResult)
        expect(request6.result).to.be.eql(fakeResult)
        expect(request7.result).to.be.eql(fakeResult)
      })

      it('fails with invalid value', async () => {
        const errorMsg = 'Value must be provided and must be a list of valid JSON items.'

        await expect(() => store.deleteValues(undefined)).to.throw(errorMsg)
        await expect(() => store.deleteValues(null)).to.throw(errorMsg)
        await expect(() => store.deleteValues([])).to.throw(errorMsg)
        await expect(() => store.deleteValues('string')).to.throw(errorMsg)
        await expect(() => store.deleteValues('')).to.throw(errorMsg)
        await expect(() => store.deleteValues(0)).to.throw(errorMsg)
        await expect(() => store.deleteValues(false)).to.throw(errorMsg)
        await expect(() => store.deleteValues('')).to.throw(errorMsg)
        await expect(() => store.deleteValues(true)).to.throw(errorMsg)
        await expect(() => store.deleteValues(123)).to.throw(errorMsg)
        await expect(() => store.deleteValues(() => undefined)).to.throw(errorMsg)
        await expect(() => store.deleteValues({})).to.throw(errorMsg)
        await expect(() => store.deleteValues(Symbol('id'))).to.throw(errorMsg)
        await expect(() => store.deleteValues(10n)).to.throw(errorMsg)
        await expect(() => store.deleteValues([])).to.throw(errorMsg)
        await expect(() => store.deleteValues([10n])).to.throw(errorMsg)
      })
    })

    describe('Is Value Member', async () => {
      it('success values', async () => {
        const composeRequest = async value => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.isValueMember(value)

          const payload = {
            method : 'POST',
            path   : `${APP_PATH}/hive/${hiveName}/set/${storeKey}/contains`,
            headers: { 'Content-Type': 'application/json' },
            body   : [value]
          }

          return { request, result, payload }
        }

        const request1 = await composeRequest('string')
        const request2 = await composeRequest('')
        const request3 = await composeRequest(false)
        const request4 = await composeRequest(true)
        const request5 = await composeRequest([])
        const request6 = await composeRequest(123)
        const request7 = await composeRequest(0)
        const request8 = await composeRequest({ a: 1 })

        expect(request1.request).to.deep.include(request1.payload)
        expect(request2.request).to.deep.include(request2.payload)
        expect(request3.request).to.deep.include(request3.payload)
        expect(request4.request).to.deep.include(request4.payload)
        expect(request5.request).to.deep.include(request5.payload)
        expect(request6.request).to.deep.include(request6.payload)
        expect(request7.request).to.deep.include(request7.payload)
        expect(request8.request).to.deep.include(request8.payload)

        expect(request1.result).to.be.eql(fakeResult)
        expect(request2.result).to.be.eql(fakeResult)
        expect(request3.result).to.be.eql(fakeResult)
        expect(request4.result).to.be.eql(fakeResult)
        expect(request5.result).to.be.eql(fakeResult)
        expect(request6.result).to.be.eql(fakeResult)
        expect(request7.result).to.be.eql(fakeResult)
        expect(request8.result).to.be.eql(fakeResult)
      })

      it('fails with invalid value', async () => {
        const errorMsg = 'Value must be provided and must be one of types: string, number, boolean, object, array.'

        await expect(() => store.isValueMember(undefined)).to.throw(errorMsg)
        await expect(() => store.isValueMember(null)).to.throw(errorMsg)
        await expect(() => store.isValueMember(() => true)).to.throw(errorMsg)
        await expect(() => store.isValueMember(10n)).to.throw(errorMsg)
        await expect(() => store.isValueMember(Symbol('id'))).to.throw(errorMsg)
        await expect(() => store.isValueMember([10n])).to.throw(errorMsg)
      })
    })

    describe('Is Values Members', async () => {
      it('success values', async () => {
        const composeRequest = async values => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.isValuesMembers(values)

          const payload = {
            method : 'POST',
            path   : `${APP_PATH}/hive/${hiveName}/set/${storeKey}/contains`,
            headers: { 'Content-Type': 'application/json' },
            body   : values
          }

          return { request, result, payload }
        }

        const request1 = await composeRequest(['string'])
        const request2 = await composeRequest([''])
        const request3 = await composeRequest([false])
        const request4 = await composeRequest([true])
        const request5 = await composeRequest([[]])
        const request6 = await composeRequest([123])
        const request7 = await composeRequest([{ a: 1 }])

        expect(request1.request).to.deep.include(request1.payload)
        expect(request2.request).to.deep.include(request2.payload)
        expect(request3.request).to.deep.include(request3.payload)
        expect(request4.request).to.deep.include(request4.payload)
        expect(request5.request).to.deep.include(request5.payload)
        expect(request6.request).to.deep.include(request6.payload)
        expect(request7.request).to.deep.include(request7.payload)

        expect(request1.result).to.be.eql(fakeResult)
        expect(request2.result).to.be.eql(fakeResult)
        expect(request3.result).to.be.eql(fakeResult)
        expect(request4.result).to.be.eql(fakeResult)
        expect(request5.result).to.be.eql(fakeResult)
        expect(request6.result).to.be.eql(fakeResult)
        expect(request7.result).to.be.eql(fakeResult)
      })

      it('fails with invalid value', async () => {
        const errorMsg = 'Value must be provided and must be a list of valid JSON items.'

        await expect(() => store.isValuesMembers(undefined)).to.throw(errorMsg)
        await expect(() => store.isValuesMembers(null)).to.throw(errorMsg)
        await expect(() => store.isValuesMembers([])).to.throw(errorMsg)
        await expect(() => store.isValuesMembers('string')).to.throw(errorMsg)
        await expect(() => store.isValuesMembers('')).to.throw(errorMsg)
        await expect(() => store.isValuesMembers(0)).to.throw(errorMsg)
        await expect(() => store.isValuesMembers(false)).to.throw(errorMsg)
        await expect(() => store.isValuesMembers('')).to.throw(errorMsg)
        await expect(() => store.isValuesMembers(true)).to.throw(errorMsg)
        await expect(() => store.isValuesMembers(123)).to.throw(errorMsg)
        await expect(() => store.isValuesMembers(() => undefined)).to.throw(errorMsg)
        await expect(() => store.isValuesMembers({})).to.throw(errorMsg)
        await expect(() => store.isValuesMembers(Symbol('id'))).to.throw(errorMsg)
        await expect(() => store.isValuesMembers(10n)).to.throw(errorMsg)
        await expect(() => store.isValuesMembers([])).to.throw(errorMsg)
        await expect(() => store.isValuesMembers([10n])).to.throw(errorMsg)
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

    })
  })
})
