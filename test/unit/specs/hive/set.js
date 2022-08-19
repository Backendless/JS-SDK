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
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.rename('testKey2')

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}/rename?newKey=testKey2`,
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
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}/rename-if-not-exists?newKey=testKey2`,
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
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}/get-expiration-ttl`,
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
            path  : `${APP_PATH}/hive/${hiveName}/set/${storeKey}/remove-expiration`,
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

    })
  })
})
