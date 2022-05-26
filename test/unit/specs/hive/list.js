import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forTest, prepareMockRequest } from '../../helpers/sandbox'
import { HiveTypes } from '../../../../src/hive/constants'

describe('List Store', function() {

  forTest(this)

  const hiveName = 'test'

  describe('Methods', () => {
    const fakeResult = { foo: true }

    const storeKey = 'testStoreKey'
    const baseUrl = `${APP_PATH}/hive/${hiveName}/${HiveTypes.LIST}/${storeKey}`

    let store

    beforeEach(() => {
      store = Backendless.Hive(hiveName).ListStore(storeKey)
    })

    describe('Get', () => {
      it('success', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.get()

        expect(req1).to.deep.include({
          method: 'GET',
          path  : `${baseUrl}`,
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('success with index', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.get(0)

        expect(req1).to.deep.include({
          method: 'GET',
          path  : `${baseUrl}/0`,
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('success with range', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.get(0, 3)

        expect(req1).to.deep.include({
          method: 'GET',
          path  : `${baseUrl}?from=0&to=3`,
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('fails when store created without key', async () => {
        store = Backendless.Hive(hiveName).ListStore()

        const errorMsg = 'Store must be created with store key.'

        await expect(() => store.get()).to.throw(errorMsg)
      })

      it('fails when arguments is invalid', async () => {
        const errorMsg1 = 'Index must be a number.'
        const errorMsg2 = 'Index To must be a number.'
        const errorMsg3 = 'Index From must be a number.'

        await expect(() => store.get(null)).to.throw(errorMsg1)
        await expect(() => store.get(NaN)).to.throw(errorMsg1)
        await expect(() => store.get(false)).to.throw(errorMsg1)
        await expect(() => store.get('')).to.throw(errorMsg1)
        await expect(() => store.get('qwe')).to.throw(errorMsg1)
        await expect(() => store.get(true)).to.throw(errorMsg1)
        await expect(() => store.get(() => undefined)).to.throw(errorMsg1)
        await expect(() => store.get({})).to.throw(errorMsg1)

        await expect(() => store.get(1, null)).to.throw(errorMsg2)
        await expect(() => store.get(1, NaN)).to.throw(errorMsg2)
        await expect(() => store.get(1, false)).to.throw(errorMsg2)
        await expect(() => store.get(1, '')).to.throw(errorMsg2)
        await expect(() => store.get(1, 'qwe')).to.throw(errorMsg2)
        await expect(() => store.get(1, true)).to.throw(errorMsg2)
        await expect(() => store.get(1, () => undefined)).to.throw(errorMsg2)
        await expect(() => store.get(1, {})).to.throw(errorMsg2)

        await expect(() => store.get(null, 1)).to.throw(errorMsg3)
        await expect(() => store.get(NaN, 1)).to.throw(errorMsg3)
        await expect(() => store.get(false, 1)).to.throw(errorMsg3)
        await expect(() => store.get('', 1)).to.throw(errorMsg3)
        await expect(() => store.get('qwe', 1)).to.throw(errorMsg3)
        await expect(() => store.get(true, 1)).to.throw(errorMsg3)
        await expect(() => store.get(() => undefined, 1)).to.throw(errorMsg3)
        await expect(() => store.get({}, 1)).to.throw(errorMsg3)
      })
    })

    describe('Set', async () => {
      it('success', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.set(['value1', 'value2'])

        expect(req1).to.deep.include({
          method: 'PUT',
          path  : `${baseUrl}`,
          body  : ['value1', 'value2']
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('success with index', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.set('value1', 0)

        expect(req1).to.deep.include({
          method : 'PUT',
          path   : `${baseUrl}/0`,
          headers: { 'Content-Type': 'text/plain' },
          body   : 'value1'
        })

        expect(result1).to.be.eql(fakeResult)
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
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.length()

        expect(req1).to.deep.include({
          method: 'GET',
          path  : `${baseUrl}/length`,
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('fails when store created without key', async () => {
        store = Backendless.Hive(hiveName).ListStore()

        const errorMsg = 'Store must be created with store key.'

        await expect(() => store.length()).to.throw(errorMsg)
      })
    })

    describe('Insert', async () => {
      it('success', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.insert('target', 'value')

        expect(req1).to.deep.include({
          method: 'PUT',
          path  : `${baseUrl}/insert`,
          body  : { 'targetValue': 'target', 'value': 'value', }
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('success with before argument', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.insert('target', 'value', false)

        expect(req1).to.deep.include({
          method: 'PUT',
          path  : `${baseUrl}/insert`,
          body  : { 'targetValue': 'target', 'value': 'value', 'before': false }
        })

        expect(result1).to.be.eql(fakeResult)
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
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.removeValue('value')

        expect(req1).to.deep.include({
          method: 'PUT',
          path  : `${baseUrl}/remove-value`,
          body  : 'value'
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('success with count', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.removeValue('value', 3)

        expect(req1).to.deep.include({
          method: 'PUT',
          path  : `${baseUrl}/remove-value?count=3`,
          body  : 'value'
        })

        expect(result1).to.be.eql(fakeResult)
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
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.addFirst('value')

        expect(req1).to.deep.include({
          method: 'PUT',
          path  : `${baseUrl}/add-first`,
          body  : ['value']
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('success with array of values', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.addFirst(['value1', 'value2'])

        expect(req1).to.deep.include({
          method: 'PUT',
          path  : `${baseUrl}/add-first`,
          body  : ['value1', 'value2']
        })

        expect(result1).to.be.eql(fakeResult)
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
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.addLast('value')

        expect(req1).to.deep.include({
          method: 'PUT',
          path  : `${baseUrl}/add-last`,
          body  : ['value']
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('success with array of values', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.addLast(['value1', 'value2'])

        expect(req1).to.deep.include({
          method: 'PUT',
          path  : `${baseUrl}/add-last`,
          body  : ['value1', 'value2']
        })

        expect(result1).to.be.eql(fakeResult)
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
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.removeFirst()

        expect(req1).to.deep.include({
          method: 'PUT',
          path  : `${baseUrl}/get-first-and-remove`,
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('success with count', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.removeFirst(3)

        expect(req1).to.deep.include({
          method: 'PUT',
          path  : `${baseUrl}/get-first-and-remove?count=3`,
        })

        expect(result1).to.be.eql(fakeResult)
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
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.removeLast()

        expect(req1).to.deep.include({
          method: 'PUT',
          path  : `${baseUrl}/get-last-and-remove`,
        })

        expect(result1).to.be.eql(fakeResult)
      })

      it('success with count', async () => {
        const req1 = prepareMockRequest(fakeResult)

        const result1 = await store.removeLast(3)

        expect(req1).to.deep.include({
          method: 'PUT',
          path  : `${baseUrl}/get-last-and-remove?count=3`,
        })

        expect(result1).to.be.eql(fakeResult)
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
