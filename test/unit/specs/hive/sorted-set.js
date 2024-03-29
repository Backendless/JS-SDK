import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forTest, prepareMockRequest } from '../../helpers/sandbox'

describe('Hive - Sorted Set Store', function() {
  forTest(this)

  const hiveName = 'testHiveName'
  const storeKey = 'testStoreKey'

  const fakeResult = { foo: true }

  let store
  let Store

  beforeEach(() => {
    Store = Backendless.Hive(hiveName).SortedSetStore
    store = Backendless.Hive(hiveName).SortedSetStore(storeKey)
  })

  describe('General Methods', () => {
    describe('Static Methods', () => {
      describe('Keys', async () => {
        it('success', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await Store.keys()

          expect(request).to.deep.include({
            method: 'GET',
            path  : `${APP_PATH}/hive/${hiveName}/sorted-set/keys`,
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
            path  : `${APP_PATH}/hive/${hiveName}/sorted-set/keys?filterPattern=123&cursor=20&pageSize=30`,
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
            path   : `${APP_PATH}/hive/${hiveName}/sorted-set`,
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

          const result = await Store.exist(['testKey1', 'testKey1'])

          expect(request).to.deep.include({
            method : 'POST',
            path   : `${APP_PATH}/hive/${hiveName}/sorted-set/action/exist`,
            headers: { 'Content-Type': 'application/json' },
            body   : ['testKey1', 'testKey1']
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('fails when key(s) is invalid', async () => {
          const errorMsg = 'Keys must be provided and must be a list of strings.'

          await expect(() => Store.exist(undefined)).to.throw(errorMsg)
          await expect(() => Store.exist(null)).to.throw(errorMsg)
          await expect(() => Store.exist(false)).to.throw(errorMsg)
          await expect(() => Store.exist(true)).to.throw(errorMsg)
          await expect(() => Store.exist('')).to.throw(errorMsg)
          await expect(() => Store.exist('key')).to.throw(errorMsg)
          await expect(() => Store.exist(0)).to.throw(errorMsg)
          await expect(() => Store.exist(123)).to.throw(errorMsg)
          await expect(() => Store.exist(() => undefined)).to.throw(errorMsg)
          await expect(() => Store.exist({})).to.throw(errorMsg)
        })
      })

      describe('Touch', async () => {
        it('success with multi keys', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await Store.touch(['testKey1', 'testKey1'])

          expect(request).to.deep.include({
            method : 'PUT',
            path   : `${APP_PATH}/hive/${hiveName}/sorted-set/action/touch`,
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

        await expect(() => hive.SortedSetStore()).to.throw(errorMsg)
        await expect(() => hive.SortedSetStore('')).to.throw(errorMsg)
        await expect(() => hive.SortedSetStore(null)).to.throw(errorMsg)
        await expect(() => hive.SortedSetStore(0)).to.throw(errorMsg)
        await expect(() => hive.SortedSetStore(false)).to.throw(errorMsg)
        await expect(() => hive.SortedSetStore(true)).to.throw(errorMsg)
        await expect(() => hive.SortedSetStore(123)).to.throw(errorMsg)
        await expect(() => hive.SortedSetStore(() => undefined)).to.throw(errorMsg)
        await expect(() => hive.SortedSetStore({})).to.throw(errorMsg)
      })

      describe('Delete', () => {
        it('success with single key', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.delete()

          expect(request).to.deep.include({
            method : 'DELETE',
            path   : `${APP_PATH}/hive/${hiveName}/sorted-set`,
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

          const result1 = await store.exist(storeKey)
          const result2 = await store.exist(storeKey)

          expect(req1).to.deep.include({
            method : 'POST',
            path   : `${APP_PATH}/hive/${hiveName}/sorted-set/action/exist`,
            headers: { 'Content-Type': 'application/json' },
            body   : [storeKey]
          })

          expect(req2).to.deep.include({
            method : 'POST',
            path   : `${APP_PATH}/hive/${hiveName}/sorted-set/action/exist`,
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
            path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/rename?newKey=testKey2`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('rename with overwrite=true', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.rename('testKey2', true)

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/rename?newKey=testKey2&overwrite=true`,
          })

          expect(result).to.be.eql(fakeResult)
        })

        it('rename with overwrite=false', async () => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.rename('testKey2', false)

          expect(request).to.deep.include({
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/rename?newKey=testKey2&overwrite=false`,
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
            path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/get-expiration-ttl`,
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
            path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/clear-expiration`,
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
            path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/expire?ttl=100`,
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
            path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/expire-at?unixTime=100`,
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
            path   : `${APP_PATH}/hive/${hiveName}/sorted-set/action/touch`,
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
            path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/seconds-since-last-operation`,
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
          path  : `${APP_PATH}/hive/${hiveName}/sorted-set/action/difference`,
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
          path  : `${APP_PATH}/hive/${hiveName}/sorted-set/action/intersection`,
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
          path  : `${APP_PATH}/hive/${hiveName}/sorted-set/action/union`,
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

  describe('Instance Methods', () => {

    describe('Add', async () => {
      it('success', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.add([[1, 'key1'], [2, 'key2']])

        expect(request).to.deep.include({
          method: 'PUT',
          path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/add`,
          body  : { 'items': [[1, 'key1'], [2, 'key2']] }
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('success with options', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.add([[1, 'key1'], [2, 'key2']], {
          duplicateBehaviour: 'OnlyUpdate',
          scoreUpdateMode   : 'Greater',
          resultType        : 'NewAdded'
        })

        expect(request).to.deep.include({
          method: 'PUT',
          path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/add`,
          body  : {
            items             : [[1, 'key1'], [2, 'key2']],
            duplicateBehaviour: 'OnlyUpdate',
            scoreUpdateMode   : 'Greater',
            resultType        : 'NewAdded'
          }
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('fails when items is invalid', async () => {
        const errorMsg = 'Items must be provided and must be an array.'

        await expect(() => store.add(undefined)).to.throw(errorMsg)
        await expect(() => store.add(null)).to.throw(errorMsg)
        await expect(() => store.add(NaN)).to.throw(errorMsg)
        await expect(() => store.add(0)).to.throw(errorMsg)
        await expect(() => store.add(123)).to.throw(errorMsg)
        await expect(() => store.add('')).to.throw(errorMsg)
        await expect(() => store.add('foo')).to.throw(errorMsg)
        await expect(() => store.add(true)).to.throw(errorMsg)
        await expect(() => store.add(false)).to.throw(errorMsg)
      })

      it('fails when options is invalid', async () => {
        const errorMsg = 'Options must be an object.'

        await expect(() => store.add([], null)).to.throw(errorMsg)
        await expect(() => store.add([], NaN)).to.throw(errorMsg)
        await expect(() => store.add([], '')).to.throw(errorMsg)
        await expect(() => store.add([], '123')).to.throw(errorMsg)
        await expect(() => store.add([], 123)).to.throw(errorMsg)
        await expect(() => store.add([], 0)).to.throw(errorMsg)
        await expect(() => store.add([], [])).to.throw(errorMsg)
        await expect(() => store.add([], () => undefined)).to.throw(errorMsg)
        await expect(() => store.add([], true)).to.throw(errorMsg)
        await expect(() => store.add([], false)).to.throw(errorMsg)
      })

      it('fails when Duplicate Behaviour Seconds is invalid', async () => {
        const errorMsg = 'Duplicate Behaviour argument must be one of this values: OnlyUpdate, AlwaysAdd.'

        await expect(() => store.add([], { duplicateBehaviour: null })).to.throw(errorMsg)
        await expect(() => store.add([], { duplicateBehaviour: false })).to.throw(errorMsg)
        await expect(() => store.add([], { duplicateBehaviour: true })).to.throw(errorMsg)
        await expect(() => store.add([], { duplicateBehaviour: '' })).to.throw(errorMsg)
        await expect(() => store.add([], { duplicateBehaviour: 'foo' })).to.throw(errorMsg)
        await expect(() => store.add([], { duplicateBehaviour: NaN })).to.throw(errorMsg)
        await expect(() => store.add([], { duplicateBehaviour: () => undefined })).to.throw(errorMsg)
      })

      it('fails when Score Update Mode is invalid', async () => {
        const errorMsg = 'Score Update Mode argument must be one of this values: Greater, Less.'

        await expect(() => store.add([], { scoreUpdateMode: null })).to.throw(errorMsg)
        await expect(() => store.add([], { scoreUpdateMode: false })).to.throw(errorMsg)
        await expect(() => store.add([], { scoreUpdateMode: true })).to.throw(errorMsg)
        await expect(() => store.add([], { scoreUpdateMode: '' })).to.throw(errorMsg)
        await expect(() => store.add([], { scoreUpdateMode: 'foo' })).to.throw(errorMsg)
        await expect(() => store.add([], { scoreUpdateMode: NaN })).to.throw(errorMsg)
        await expect(() => store.add([], { scoreUpdateMode: () => undefined })).to.throw(errorMsg)
      })

      it('fails when Result Type is invalid', async () => {
        const errorMsg = 'Result Type must be one of this values: NewAdded, TotalChanged.'

        await expect(() => store.add([], { resultType: null })).to.throw(errorMsg)
        await expect(() => store.add([], { resultType: false })).to.throw(errorMsg)
        await expect(() => store.add([], { resultType: true })).to.throw(errorMsg)
        await expect(() => store.add([], { resultType: '' })).to.throw(errorMsg)
        await expect(() => store.add([], { resultType: 'foo' })).to.throw(errorMsg)
        await expect(() => store.add([], { resultType: NaN })).to.throw(errorMsg)
        await expect(() => store.add([], { resultType: () => undefined })).to.throw(errorMsg)
      })
    })

    describe('Get Random', () => {
      it('success', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.getRandom()

        expect(request).to.deep.include({
          method: 'GET',
          path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/get-random`,
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('success with count', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.getRandom({ count: 3 })

        expect(request).to.deep.include({
          method: 'GET',
          path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/get-random?count=3`,
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('success with scores', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.getRandom({ count: 3, withScores: true })

        expect(request).to.deep.include({
          method: 'GET',
          path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/get-random?count=3&withScores=true`,
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('fails when options is invalid', async () => {
        const errorMsg = 'Options must be an object.'

        await expect(() => store.getRandom(null)).to.throw(errorMsg)
        await expect(() => store.getRandom(NaN)).to.throw(errorMsg)
        await expect(() => store.getRandom('')).to.throw(errorMsg)
        await expect(() => store.getRandom('123')).to.throw(errorMsg)
        await expect(() => store.getRandom(123)).to.throw(errorMsg)
        await expect(() => store.getRandom(0)).to.throw(errorMsg)
        await expect(() => store.getRandom([])).to.throw(errorMsg)
        await expect(() => store.getRandom(() => undefined)).to.throw(errorMsg)
        await expect(() => store.getRandom(true)).to.throw(errorMsg)
        await expect(() => store.getRandom(false)).to.throw(errorMsg)
      })

      it('fails when count is invalid', async () => {
        const errorMsg = 'Count must be a number.'

        await expect(() => store.getRandom({ count: null })).to.throw(errorMsg)
        await expect(() => store.getRandom({ count: false })).to.throw(errorMsg)
        await expect(() => store.getRandom({ count: true })).to.throw(errorMsg)
        await expect(() => store.getRandom({ count: '' })).to.throw(errorMsg)
        await expect(() => store.getRandom({ count: 'foo' })).to.throw(errorMsg)
        await expect(() => store.getRandom({ count: NaN })).to.throw(errorMsg)
        await expect(() => store.getRandom({ count: {} })).to.throw(errorMsg)
        await expect(() => store.getRandom({ count: [] })).to.throw(errorMsg)
        await expect(() => store.getRandom({ count: () => undefined })).to.throw(errorMsg)
      })

      it('fails when withScores argument is invalid', async () => {
        const errorMsg = 'With Scores argument must be a boolean.'

        await expect(() => store.getRandom({ withScores: null })).to.throw(errorMsg)
        await expect(() => store.getRandom({ withScores: 0 })).to.throw(errorMsg)
        await expect(() => store.getRandom({ withScores: 123 })).to.throw(errorMsg)
        await expect(() => store.getRandom({ withScores: '' })).to.throw(errorMsg)
        await expect(() => store.getRandom({ withScores: 'foo' })).to.throw(errorMsg)
        await expect(() => store.getRandom({ withScores: NaN })).to.throw(errorMsg)
        await expect(() => store.getRandom({ withScores: {} })).to.throw(errorMsg)
        await expect(() => store.getRandom({ withScores: [] })).to.throw(errorMsg)
        await expect(() => store.getRandom({ withScores: () => undefined })).to.throw(errorMsg)
      })
    })

    describe('Get Score', async () => {
      it('success keys', async () => {
        const composeRequest = async value => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.getScore(value)

          const payload = {
            method : 'POST',
            path   : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/get-score`,
            headers: { 'Content-Type': 'application/json' },
            body   : {
              value: value
            }
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

      it('fails when values is invalid', async () => {
        const errorMsg = 'Value must be provided and must be one of types: string, number, boolean, object, array.'

        await expect(() => store.getScore(undefined)).to.throw(errorMsg)
        await expect(() => store.getScore(null)).to.throw(errorMsg)
        await expect(() => store.getScore(() => true)).to.throw(errorMsg)
        await expect(() => store.getScore(10n)).to.throw(errorMsg)
        await expect(() => store.getScore(Symbol('id'))).to.throw(errorMsg)
        await expect(() => store.getScore([10n])).to.throw(errorMsg)
      })
    })

    describe('Increment Score', () => {
      it('success values', async () => {
        const composeRequest = async value => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.incrementScore(value, 10)

          const payload = {
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/increment`,
            body  : { value, scoreValue: 10 }
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

      it('fails when value is invalid', async () => {
        store = Backendless.Hive(hiveName).SortedSetStore(storeKey)

        const errorMsg = 'Value must be provided and must be one of types: string, number, boolean, object, array.'

        await expect(() => store.incrementScore(undefined)).to.throw(errorMsg)
        await expect(() => store.incrementScore(null)).to.throw(errorMsg)
        await expect(() => store.incrementScore(() => true)).to.throw(errorMsg)
        await expect(() => store.incrementScore(10n)).to.throw(errorMsg)
        await expect(() => store.incrementScore(Symbol('id'))).to.throw(errorMsg)
        await expect(() => store.incrementScore([10n])).to.throw(errorMsg)
      })

      it('fails when increment count is invalid', async () => {
        const errorMsg = 'ScoreValue must be provided and must be a number.'

        await expect(() => store.incrementScore('foo', undefined)).to.throw(errorMsg)
        await expect(() => store.incrementScore('foo', null)).to.throw(errorMsg)
        await expect(() => store.incrementScore('foo', false)).to.throw(errorMsg)
        await expect(() => store.incrementScore('foo', '')).to.throw(errorMsg)
        await expect(() => store.incrementScore('foo', '123')).to.throw(errorMsg)
        await expect(() => store.incrementScore('foo', NaN)).to.throw(errorMsg)
        await expect(() => store.incrementScore('foo', true)).to.throw(errorMsg)
        await expect(() => store.incrementScore('foo', () => undefined)).to.throw(errorMsg)
        await expect(() => store.incrementScore('foo', {})).to.throw(errorMsg)
      })
    })

    describe('Decrement Score', () => {
      it('success values', async () => {
        const composeRequest = async value => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.decrementScore(value, 10)

          const payload = {
            method: 'PUT',
            path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/decrement`,
            body  : { value, scoreValue: 10 }
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

      it('fails when value is invalid', async () => {
        store = Backendless.Hive(hiveName).SortedSetStore(storeKey)

        const errorMsg = 'Value must be provided and must be one of types: string, number, boolean, object, array.'

        await expect(() => store.decrementScore(undefined)).to.throw(errorMsg)
        await expect(() => store.decrementScore(null)).to.throw(errorMsg)
        await expect(() => store.decrementScore(() => true)).to.throw(errorMsg)
        await expect(() => store.decrementScore(10n)).to.throw(errorMsg)
        await expect(() => store.decrementScore(Symbol('id'))).to.throw(errorMsg)
        await expect(() => store.decrementScore([10n])).to.throw(errorMsg)
      })

      it('fails when increment count is invalid', async () => {
        const errorMsg = 'ScoreValue must be provided and must be a number.'

        await expect(() => store.decrementScore('foo', undefined)).to.throw(errorMsg)
        await expect(() => store.decrementScore('foo', null)).to.throw(errorMsg)
        await expect(() => store.decrementScore('foo', false)).to.throw(errorMsg)
        await expect(() => store.decrementScore('foo', '')).to.throw(errorMsg)
        await expect(() => store.decrementScore('foo', '123')).to.throw(errorMsg)
        await expect(() => store.decrementScore('foo', NaN)).to.throw(errorMsg)
        await expect(() => store.decrementScore('foo', true)).to.throw(errorMsg)
        await expect(() => store.decrementScore('foo', () => undefined)).to.throw(errorMsg)
        await expect(() => store.decrementScore('foo', {})).to.throw(errorMsg)
      })
    })

    describe('Get and Remove Max Score', () => {
      it('success', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.getAndDeleteMaxScore()

        expect(request).to.deep.include({
          method: 'PUT',
          path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/get-with-max-score-and-delete`,
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('success with count', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.getAndDeleteMaxScore(3)

        expect(request).to.deep.include({
          method: 'PUT',
          path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/get-with-max-score-and-delete?count=3`,
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('fails when count is invalid', async () => {
        const errorMsg = 'Count must be a number.'

        await expect(() => store.getAndDeleteMaxScore(null)).to.throw(errorMsg)
        await expect(() => store.getAndDeleteMaxScore(false)).to.throw(errorMsg)
        await expect(() => store.getAndDeleteMaxScore(true)).to.throw(errorMsg)
        await expect(() => store.getAndDeleteMaxScore('')).to.throw(errorMsg)
        await expect(() => store.getAndDeleteMaxScore('foo')).to.throw(errorMsg)
        await expect(() => store.getAndDeleteMaxScore(NaN)).to.throw(errorMsg)
        await expect(() => store.getAndDeleteMaxScore({})).to.throw(errorMsg)
        await expect(() => store.getAndDeleteMaxScore([])).to.throw(errorMsg)
        await expect(() => store.getAndDeleteMaxScore(() => undefined)).to.throw(errorMsg)
      })
    })

    describe('Get and Remove Min Score', () => {
      it('success', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.getAndDeleteMinScore()

        expect(request).to.deep.include({
          method: 'PUT',
          path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/get-with-min-score-and-delete`,
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('success with count', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.getAndDeleteMinScore(3)

        expect(request).to.deep.include({
          method: 'PUT',
          path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/get-with-min-score-and-delete?count=3`,
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('fails when count is invalid', async () => {
        const errorMsg = 'Count must be a number.'

        await expect(() => store.getAndDeleteMinScore(null)).to.throw(errorMsg)
        await expect(() => store.getAndDeleteMinScore(false)).to.throw(errorMsg)
        await expect(() => store.getAndDeleteMinScore(true)).to.throw(errorMsg)
        await expect(() => store.getAndDeleteMinScore('')).to.throw(errorMsg)
        await expect(() => store.getAndDeleteMinScore('foo')).to.throw(errorMsg)
        await expect(() => store.getAndDeleteMinScore(NaN)).to.throw(errorMsg)
        await expect(() => store.getAndDeleteMinScore({})).to.throw(errorMsg)
        await expect(() => store.getAndDeleteMinScore([])).to.throw(errorMsg)
        await expect(() => store.getAndDeleteMinScore(() => undefined)).to.throw(errorMsg)
      })
    })

    describe('Get Rank', () => {
      it('success', async () => {
        const composeRequest = async value => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.getRank(value)

          const payload = {
            method : 'POST',
            path   : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/get-rank`,
            headers: { 'Content-Type': 'application/json' },
            body   : {
              value: value
            }
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

      it('success with reverse', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.getRank('foo', true)

        expect(request).to.deep.include({
          method : 'POST',
          path   : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/get-rank`,
          headers: { 'Content-Type': 'application/json' },
          body   : {
            value  : 'foo',
            reverse: true
          }
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('fails when values is invalid', async () => {
        const errorMsg = 'Value must be provided and must be one of types: string, number, boolean, object, array.'

        await expect(() => store.getRank(undefined)).to.throw(errorMsg)
        await expect(() => store.getRank(null)).to.throw(errorMsg)
        await expect(() => store.getRank(() => true)).to.throw(errorMsg)
        await expect(() => store.getRank(10n)).to.throw(errorMsg)
        await expect(() => store.getRank(Symbol('id'))).to.throw(errorMsg)
        await expect(() => store.getRank([10n])).to.throw(errorMsg)
      })

      it('fails when Reverse argument is invalid', async () => {
        const errorMsg = 'Reverse argument must be a boolean.'

        await expect(() => store.getRank('foo', null)).to.throw(errorMsg)
        await expect(() => store.getRank('foo', '')).to.throw(errorMsg)
        await expect(() => store.getRank('foo', 'foo')).to.throw(errorMsg)
        await expect(() => store.getRank('foo', NaN)).to.throw(errorMsg)
        await expect(() => store.getRank('foo', {})).to.throw(errorMsg)
        await expect(() => store.getRank('foo', [])).to.throw(errorMsg)
        await expect(() => store.getRank('foo', () => undefined)).to.throw(errorMsg)
      })
    })

    describe('Delete Value', () => {
      it('success values', async () => {
        const composeRequest = async value => {
          const request = prepareMockRequest(fakeResult)

          const result = await store.deleteValue(value)

          const payload = {
            method : 'DELETE',
            path   : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/values`,
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

      it('fails when value is invalid', async () => {
        const errorMsg = 'Value must be provided and must be one of types: string, number, boolean, object, array.'

        await expect(() => store.deleteValue(undefined)).to.throw(errorMsg)
        await expect(() => store.deleteValue(null)).to.throw(errorMsg)
        await expect(() => store.deleteValue(() => true)).to.throw(errorMsg)
        await expect(() => store.deleteValue(10n)).to.throw(errorMsg)
        await expect(() => store.deleteValue(Symbol('id'))).to.throw(errorMsg)
        await expect(() => store.deleteValue([10n])).to.throw(errorMsg)
      })
    })

    describe('Delete Values', () => {
      it('success value', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.deleteValues(['testKey1', 'testKey2'])

        expect(request).to.deep.include({
          method : 'DELETE',
          path   : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/values`,
          headers: { 'Content-Type': 'application/json' },
          body   : ['testKey1', 'testKey2']
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('fails when values is invalid', async () => {
        const errorMsg = 'Value must be provided and must be a list of JSON items.'

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
        await expect(() => store.deleteValues([10n])).to.throw(errorMsg)
      })
    })

    describe('Get Range by Rank', async () => {
      it('success', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.getRangeByRank(1, 2)

        expect(request).to.deep.include({
          method: 'GET',
          path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/get-range-by-rank?startRank=1&stopRank=2`,
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('success with options', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.getRangeByRank(1, 2, {
          withScores: true,
          reverse   : true,
        })

        expect(request).to.deep.include({
          method: 'GET',
          path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/get-range-by-rank?startRank=1&stopRank=2&withScores=true&reverse=true`,
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('fails when Start Rank is invalid', async () => {
        const errorMsg = 'Start Rank must be provided and must be a number.'

        await expect(() => store.getRangeByRank(null)).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(false)).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(true)).to.throw(errorMsg)
        await expect(() => store.getRangeByRank('')).to.throw(errorMsg)
        await expect(() => store.getRangeByRank('foo')).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(NaN)).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(() => undefined)).to.throw(errorMsg)
      })

      it('fails when Stop Rank is invalid', async () => {
        const errorMsg = 'Stop Rank must be provided and must be a number.'

        await expect(() => store.getRangeByRank(1, null)).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, false)).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, true)).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, '')).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, 'foo')).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, NaN)).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, () => undefined)).to.throw(errorMsg)
      })

      it('fails when options is invalid', async () => {
        const errorMsg = 'Options must be an object.'

        await expect(() => store.getRangeByRank(1, 2, null)).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, 2, NaN)).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, 2, '')).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, 2, '123')).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, 2, 123)).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, 2, 0)).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, 2, [])).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, 2, () => undefined)).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, 2, true)).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, 2, false)).to.throw(errorMsg)
      })

      it('fails when With Scores is invalid', async () => {
        const errorMsg = 'With Scores argument must be a boolean.'

        await expect(() => store.getRangeByRank(1, 2, { withScores: null })).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, 2, { withScores: '' })).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, 2, { withScores: 'foo' })).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, 2, { withScores: NaN })).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, 2, { withScores: {} })).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, 2, { withScores: [] })).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, 2, { withScores: 0 })).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, 2, { withScores: 123 })).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, 2, { withScores: () => undefined })).to.throw(errorMsg)
      })

      it('fails when Reverse is invalid', async () => {
        const errorMsg = 'Reverse argument must be a boolean.'

        await expect(() => store.getRangeByRank(1, 2, { reverse: null })).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, 2, { reverse: '' })).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, 2, { reverse: 'foo' })).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, 2, { reverse: NaN })).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, 2, { reverse: {} })).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, 2, { reverse: [] })).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, 2, { reverse: 0 })).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, 2, { reverse: 123 })).to.throw(errorMsg)
        await expect(() => store.getRangeByRank(1, 2, { reverse: () => undefined })).to.throw(errorMsg)
      })
    })

    describe('Get Range by Score', async () => {
      it('success', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.getRangeByScore()

        expect(request).to.deep.include({
          method: 'GET',
          path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/get-range-by-score`,
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('success with options', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.getRangeByScore({
          minScore: 1,
          maxScore: 2,
          minBound: 'Include',
          maxBound: 'Exclude',
          offset  : 123,
          count   : 4,
        })

        expect(request).to.deep.include({
          method: 'GET',
          path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/get-range-by-score?minScore=1&maxScore=2&minBound=Include&maxBound=Exclude&offset=123&count=4`,
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('fails when options is invalid', async () => {
        const errorMsg = 'Options must be an object.'

        await expect(() => store.getRangeByScore(null)).to.throw(errorMsg)
        await expect(() => store.getRangeByScore(NaN)).to.throw(errorMsg)
        await expect(() => store.getRangeByScore('')).to.throw(errorMsg)
        await expect(() => store.getRangeByScore('123')).to.throw(errorMsg)
        await expect(() => store.getRangeByScore(123)).to.throw(errorMsg)
        await expect(() => store.getRangeByScore(0)).to.throw(errorMsg)
        await expect(() => store.getRangeByScore([])).to.throw(errorMsg)
        await expect(() => store.getRangeByScore(() => undefined)).to.throw(errorMsg)
        await expect(() => store.getRangeByScore(true)).to.throw(errorMsg)
        await expect(() => store.getRangeByScore(false)).to.throw(errorMsg)
      })

      it('fails when Minimal Score is invalid', async () => {
        const errorMsg = 'Minimal Score must be a number.'

        await expect(() => store.getRangeByScore({ minScore: null })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ minScore: false })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ minScore: true })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ minScore: '' })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ minScore: 'foo' })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ minScore: NaN })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ minScore: {} })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ minScore: [] })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ minScore: () => undefined })).to.throw(errorMsg)
      })

      it('fails when Maximal Score is invalid', async () => {
        const errorMsg = 'Maximal Score must be a number.'

        await expect(() => store.getRangeByScore({ maxScore: null })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ maxScore: false })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ maxScore: true })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ maxScore: '' })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ maxScore: 'foo' })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ maxScore: NaN })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ maxScore: {} })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ maxScore: [] })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ maxScore: () => undefined })).to.throw(errorMsg)
      })

      it('fails when Minimal Bound is invalid', async () => {
        const errorMsg = 'Minimal bound must be one of this values: Include, Exclude, Infinity.'

        await expect(() => store.getRangeByScore({ minBound: null })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ minBound: '' })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ minBound: 'foo' })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ minBound: NaN })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ minBound: {} })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ minBound: 0 })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ minBound: 123 })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ minBound: [] })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ minBound: true })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ minBound: false })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ minBound: () => undefined })).to.throw(errorMsg)
      })

      it('fails when Maximal Bound is invalid', async () => {
        const errorMsg = 'Maximal bound must be one of this values: Include, Exclude, Infinity.'

        await expect(() => store.getRangeByScore({ maxBound: null })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ maxBound: '' })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ maxBound: 'foo' })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ maxBound: NaN })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ maxBound: {} })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ maxBound: 0 })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ maxBound: 123 })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ maxBound: [] })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ maxBound: true })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ maxBound: false })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ maxBound: () => undefined })).to.throw(errorMsg)
      })

      it('fails when PageSize is invalid', async () => {
        const errorMsg = 'Page Size must be a number.'

        await expect(() => store.getRangeByScore({ pageSize: null })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ pageSize: '' })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ pageSize: 'foo' })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ pageSize: NaN })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ pageSize: {} })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ pageSize: [] })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ pageSize: true })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ pageSize: false })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ pageSize: () => undefined })).to.throw(errorMsg)
      })

      it('fails when Offset is invalid', async () => {
        const errorMsg = 'Offset must be a number.'

        await expect(() => store.getRangeByScore({ offset: null })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ offset: '' })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ offset: 'foo' })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ offset: NaN })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ offset: {} })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ offset: [] })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ offset: false })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ offset: true })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ offset: () => undefined })).to.throw(errorMsg)
      })

      it('fails when With Scores is invalid', async () => {
        const errorMsg = 'With Scores argument must be a boolean.'

        await expect(() => store.getRangeByScore({ withScores: null })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ withScores: '' })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ withScores: 'foo' })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ withScores: NaN })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ withScores: {} })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ withScores: [] })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ withScores: 0 })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ withScores: 123 })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ withScores: () => undefined })).to.throw(errorMsg)
      })

      it('fails when Reverse is invalid', async () => {
        const errorMsg = 'Reverse argument must be a boolean.'

        await expect(() => store.getRangeByScore({ reverse: null })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ reverse: '' })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ reverse: 'foo' })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ reverse: NaN })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ reverse: {} })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ reverse: [] })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ reverse: 0 })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ reverse: 123 })).to.throw(errorMsg)
        await expect(() => store.getRangeByScore({ reverse: () => undefined })).to.throw(errorMsg)
      })
    })

    describe('Delete values by Rank', async () => {
      it('success', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.deleteValuesByRank(1, 2)

        expect(request).to.deep.include({
          method: 'DELETE',
          path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/delete-by-rank?startRank=1&stopRank=2`,
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('fails when Start Rank is invalid', async () => {
        const errorMsg = 'Start Rank must be provided and must be a number.'

        await expect(() => store.deleteValuesByRank(null)).to.throw(errorMsg)
        await expect(() => store.deleteValuesByRank(false)).to.throw(errorMsg)
        await expect(() => store.deleteValuesByRank(true)).to.throw(errorMsg)
        await expect(() => store.deleteValuesByRank('')).to.throw(errorMsg)
        await expect(() => store.deleteValuesByRank('foo')).to.throw(errorMsg)
        await expect(() => store.deleteValuesByRank(NaN)).to.throw(errorMsg)
        await expect(() => store.deleteValuesByRank(() => undefined)).to.throw(errorMsg)
      })

      it('fails when Stop Rank is invalid', async () => {
        const errorMsg = 'Stop Rank must be provided and must be a number.'

        await expect(() => store.deleteValuesByRank(1, null)).to.throw(errorMsg)
        await expect(() => store.deleteValuesByRank(1, false)).to.throw(errorMsg)
        await expect(() => store.deleteValuesByRank(1, true)).to.throw(errorMsg)
        await expect(() => store.deleteValuesByRank(1, '')).to.throw(errorMsg)
        await expect(() => store.deleteValuesByRank(1, 'foo')).to.throw(errorMsg)
        await expect(() => store.deleteValuesByRank(1, NaN)).to.throw(errorMsg)
        await expect(() => store.deleteValuesByRank(1, () => undefined)).to.throw(errorMsg)
      })
    })

    describe('Delete values by Score', async () => {
      it('success', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.deleteValuesByScore()

        expect(request).to.deep.include({
          method: 'DELETE',
          path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/delete-by-score`,
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('success with options', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.deleteValuesByScore({
          minScore: 1,
          maxScore: 2,
          minBound: 'Include',
          maxBound: 'Exclude'
        })

        expect(request).to.deep.include({
          method: 'DELETE',
          path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/delete-by-score?minScore=1&maxScore=2&minBound=Include&maxBound=Exclude`,
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('fails when options is invalid', async () => {
        const errorMsg = 'Options must be an object.'

        await expect(() => store.deleteValuesByScore(null)).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore(NaN)).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore('')).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore('123')).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore(123)).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore(0)).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore([])).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore(() => undefined)).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore(true)).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore(false)).to.throw(errorMsg)
      })

      it('fails when Minimal Score is invalid', async () => {
        const errorMsg = 'Minimal Score must be a number.'

        await expect(() => store.deleteValuesByScore({ minScore: null })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ minScore: false })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ minScore: true })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ minScore: '' })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ minScore: 'foo' })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ minScore: NaN })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ minScore: [] })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ minScore: {} })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ minScore: () => undefined })).to.throw(errorMsg)
      })

      it('fails when Maximal Score is invalid', async () => {
        const errorMsg = 'Maximal Score must be a number.'

        await expect(() => store.deleteValuesByScore({ maxScore: null })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ maxScore: false })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ maxScore: true })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ maxScore: '' })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ maxScore: 'foo' })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ maxScore: NaN })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ maxScore: [] })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ maxScore: {} })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ maxScore: () => undefined })).to.throw(errorMsg)

      })

      it('fails when Minimal Bound is invalid', async () => {
        const errorMsg = 'Minimal bound must be one of this values: Include, Exclude, Infinity.'

        await expect(() => store.deleteValuesByScore({ minBound: null })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ minBound: '' })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ minBound: 'foo' })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ minBound: NaN })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ minBound: {} })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ minBound: 0 })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ minBound: 123 })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ minBound: [] })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ minBound: true })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ minBound: false })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ minBound: () => undefined })).to.throw(errorMsg)
      })

      it('fails when Maximal Bound is invalid', async () => {
        const errorMsg = 'Maximal bound must be one of this values: Include, Exclude, Infinity.'

        await expect(() => store.deleteValuesByScore({ maxBound: null })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ maxBound: '' })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ maxBound: 'foo' })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ maxBound: NaN })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ maxBound: {} })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ maxBound: 0 })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ maxBound: 123 })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ maxBound: [] })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ maxBound: true })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ maxBound: false })).to.throw(errorMsg)
        await expect(() => store.deleteValuesByScore({ maxBound: () => undefined })).to.throw(errorMsg)
      })
    })

    describe('Length', async () => {
      it('success', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.length()

        expect(request).to.deep.include({
          method: 'GET',
          path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/length`,
        })

        expect(result).to.be.eql(fakeResult)
      })

    })

    describe('Count between Scores', async () => {
      it('success', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.countBetweenScores()

        expect(request).to.deep.include({
          method: 'GET',
          path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/count`,
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('success with options', async () => {
        const request = prepareMockRequest(fakeResult)

        const result = await store.countBetweenScores({
          minScore: 1,
          maxScore: 2,
          minBound: 'Include',
          maxBound: 'Exclude'
        })

        expect(request).to.deep.include({
          method: 'GET',
          path  : `${APP_PATH}/hive/${hiveName}/sorted-set/${storeKey}/count?minScore=1&maxScore=2&minBound=Include&maxBound=Exclude`,
        })

        expect(result).to.be.eql(fakeResult)
      })

      it('fails when Minimal Score is invalid', async () => {
        const errorMsg = 'Minimal Score must be a number.'

        await expect(() => store.countBetweenScores({ minScore: null })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ minScore: false })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ minScore: true })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ minScore: '' })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ minScore: 'foo' })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ minScore: [] })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ minScore: {} })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ minScore: NaN })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ minScore: () => undefined })).to.throw(errorMsg)
      })

      it('fails when Maximal Score is invalid', async () => {
        const errorMsg = 'Maximal Score must be a number.'

        await expect(() => store.countBetweenScores({ maxScore: null })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ maxScore: false })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ maxScore: true })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ maxScore: '' })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ maxScore: 'foo' })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ maxScore: [] })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ maxScore: {} })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ maxScore: NaN })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ maxScore: () => undefined })).to.throw(errorMsg)
      })

      it('fails when options is invalid', async () => {
        const errorMsg = 'Options must be an object.'

        await expect(() => store.countBetweenScores(null)).to.throw(errorMsg)
        await expect(() => store.countBetweenScores(NaN)).to.throw(errorMsg)
        await expect(() => store.countBetweenScores('')).to.throw(errorMsg)
        await expect(() => store.countBetweenScores('123')).to.throw(errorMsg)
        await expect(() => store.countBetweenScores(123)).to.throw(errorMsg)
        await expect(() => store.countBetweenScores(0)).to.throw(errorMsg)
        await expect(() => store.countBetweenScores([])).to.throw(errorMsg)
        await expect(() => store.countBetweenScores(() => undefined)).to.throw(errorMsg)
        await expect(() => store.countBetweenScores(true)).to.throw(errorMsg)
        await expect(() => store.countBetweenScores(false)).to.throw(errorMsg)
      })

      it('fails when Minimal Bound is invalid', async () => {
        const errorMsg = 'Minimal bound must be one of this values: Include, Exclude, Infinity.'

        await expect(() => store.countBetweenScores({ minBound: null })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ minBound: '' })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ minBound: 'foo' })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ minBound: NaN })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ minBound: {} })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ minBound: 0 })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ minBound: 123 })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ minBound: [] })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ minBound: true })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ minBound: false })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ minBound: () => undefined })).to.throw(errorMsg)
      })

      it('fails when Maximal Bound is invalid', async () => {
        const errorMsg = 'Maximal bound must be one of this values: Include, Exclude, Infinity.'

        await expect(() => store.countBetweenScores({ maxBound: null })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ maxBound: '' })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ maxBound: 'foo' })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ maxBound: NaN })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ maxBound: {} })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ maxBound: 0 })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ maxBound: 123 })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ maxBound: [] })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ maxBound: true })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ maxBound: false })).to.throw(errorMsg)
        await expect(() => store.countBetweenScores({ maxBound: () => undefined })).to.throw(errorMsg)
      })
    })

  })
})
