import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forTest, prepareMockRequest } from '../../helpers/sandbox'

describe('<Data> Bulk Operations', function() {

  forTest(this)

  const fakeResult = { foo: 123 }

  const tableName = 'Person'

  let dataStore

  beforeEach(() => {
    dataStore = Backendless.Data.of(tableName)
  })

  describe('Create', () => {
    it('creates objects', async () => {
      const req1 = prepareMockRequest(fakeResult)

      const result1 = await dataStore.bulkCreate([{ foo: '1' }, { foo: '2' }, { foo: '3' }])

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/bulk/${tableName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : [
          { foo: '1' },
          { foo: '2' },
          { foo: '3' }
        ]
      })

      expect(result1).to.be.equal(fakeResult)
    })

    it('fails when objects list is invalid', async () => {
      const errorMsg = 'Objects must be provided and must be an array of objects.'

      await expect(dataStore.bulkCreate()).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkCreate('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkCreate('str')).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkCreate(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkCreate(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkCreate(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkCreate(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkCreate(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkCreate(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkCreate({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkCreate(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when at least one item is invalid', async () => {
      const errorMsg = 'Objects must be provided and must be an array of objects.'

      await expect(dataStore.bulkCreate([{}, ''])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkCreate([{}, 'str'])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkCreate([{}, false])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkCreate([{}, true])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkCreate([{}, null])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkCreate([{}, undefined])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkCreate([{}, 0])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkCreate([{}, 123])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkCreate([{}, []])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkCreate([{}, () => ({})])).to.eventually.be.rejectedWith(errorMsg)
    })
  })

  describe('Update', () => {
    it('updates objects', async () => {
      const req1 = prepareMockRequest(fakeResult)

      const result1 = await dataStore.bulkUpdate('foo>123', { foo: 333 })

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/bulk/${tableName}?where=foo%3E123`,
        headers: { 'Content-Type': 'application/json' },
        body   : { foo: 333 }
      })

      expect(result1).to.be.equal(fakeResult)
    })

    it('updates objects with expression', async () => {
      const req1 = prepareMockRequest(fakeResult)

      const result1 = await dataStore.bulkUpdate('foo>123', { foo: 333, age: new Backendless.Expression('age + 1') })

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/bulk/${tableName}?where=foo%3E123`,
        headers: { 'Content-Type': 'application/json' },
        body   : { foo: 333, age: { ___class: 'BackendlessExpression', value: 'age + 1' } }
      })

      expect(result1).to.be.equal(fakeResult)
    })

    it('fails when condition is invalid', async () => {
      const errorMsg = 'Condition must be provided and must be a string.'

      await expect(dataStore.bulkUpdate()).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpdate('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpdate(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpdate(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpdate(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpdate(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpdate(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpdate(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpdate({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpdate([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpdate(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when changes object is invalid', async () => {
      const errorMsg = 'Changes must be provided and must be an object.'

      await expect(dataStore.bulkUpdate('foo=1')).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpdate('foo=1', '')).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpdate('foo=1', 'str')).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpdate('foo=1', false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpdate('foo=1', true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpdate('foo=1', null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpdate('foo=1', undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpdate('foo=1', 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpdate('foo=1', 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpdate('foo=1', [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpdate('foo=1', () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })
  })

  describe('Upsert', () => {
    it('updates objects', async () => {
      const req1 = prepareMockRequest(fakeResult)

      const result1 = await dataStore.bulkUpsert([{ foo: 333 }, { foo: 111 }])

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/bulkupsert/${tableName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : [{ foo: 333 }, { foo: 111 }]
      })

      expect(result1).to.be.equal(fakeResult)
    })

    it('fails when objects list is invalid', async () => {
      const errorMsg = 'Objects must be provided and must be an array of objects.'

      await expect(dataStore.bulkUpsert()).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpsert('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpsert('str')).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpsert(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpsert(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpsert(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpsert(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpsert(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpsert(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpsert({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpsert(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when at least one item is invalid', async () => {
      const errorMsg = 'Objects must be provided and must be an array of objects.'

      await expect(dataStore.bulkUpsert([{}, ''])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpsert([{}, 'str'])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpsert([{}, false])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpsert([{}, true])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpsert([{}, null])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpsert([{}, undefined])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpsert([{}, 0])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpsert([{}, 123])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpsert([{}, []])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkUpsert([{}, () => ({})])).to.eventually.be.rejectedWith(errorMsg)
    })
  })

  describe('Delete', () => {
    it('deletes objects with condition', async () => {
      const req1 = prepareMockRequest(fakeResult)

      const result1 = await dataStore.bulkDelete('foo>123')

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/bulk/${tableName}/delete`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          where: 'foo>123'
        }
      })

      expect(result1).to.be.equal(fakeResult)
    })

    it('deletes objects with object ids', async () => {
      const req1 = prepareMockRequest(fakeResult)

      const result1 = await dataStore.bulkDelete([{ objectId: 'object-1' }, 'object-2', { objectId: 111 }, 222])

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/bulk/${tableName}/delete`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          where: 'objectId in (\'object-1\',\'object-2\',\'111\',\'222\')'
        }
      })

      expect(result1).to.be.equal(fakeResult)
    })

    it('fails when condition is invalid', async () => {
      const errorMsg = 'Condition must be provided and must be a string or a list of objects.'

      await expect(dataStore.bulkDelete()).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkDelete('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkDelete(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkDelete(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkDelete(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkDelete(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkDelete(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkDelete(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkDelete({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkDelete(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when at least on objectId is invalid', async () => {
      const errorMsg = (
        'Can not transform "objects" to "whereClause". ' +
        'Item must be a string or number or an object with property "objectId" as string.'
      )

      await expect(dataStore.bulkDelete(['object-id', ''])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkDelete(['object-id', false])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkDelete(['object-id', true])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkDelete(['object-id', null])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkDelete(['object-id', undefined])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkDelete(['object-id', {}])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkDelete(['object-id', []])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkDelete(['object-id', () => ({})])).to.eventually.be.rejectedWith(errorMsg)

      await expect(dataStore.bulkDelete(['object-id', { objectId: '' }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkDelete(['object-id', { objectId: false }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkDelete(['object-id', { objectId: true }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkDelete(['object-id', { objectId: null }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkDelete(['object-id', { objectId: undefined }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkDelete(['object-id', { objectId: {} }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkDelete(['object-id', { objectId: [] }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.bulkDelete(['object-id', { objectId: () => ({}) }])).to.eventually.be.rejectedWith(errorMsg)
    })
  })

})
