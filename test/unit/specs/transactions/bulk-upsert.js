import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forSuite } from '../../helpers/sandbox'
import { prepareSuccessResponse } from './utils'

const PERSONS_TABLE_NAME = 'Person'

class Person {
  constructor(data) {
    data = data || {}

    if (data.objectId) {
      this.objectId = data.objectId
    }

    if (data.name) {
      this.name = data.name
    }

    if (data.age) {
      this.age = data.age
    }
  }
}

describe('<Transactions> Bulk Upsert Operation', function() {

  forSuite(this)

  let uow

  beforeEach(() => {
    uow = new Backendless.UnitOfWork()
  })

  describe('Signatures', () => {

    it('bulkUpsert(objects: object[]): OpResult', async () => {
      const results = {
        upsert_bulkPerson1: {
          result: {
            objectId: 'test-objectId'
          }
        },
        upsert_bulkPerson2: {
          result: {
            objectId: 'test-objectId'
          }
        }
      }

      const req1 = prepareSuccessResponse(results)

      const obj1 = { ___class: PERSONS_TABLE_NAME, name: 'p-name-1' }
      const obj2 = new Person({ name: 'p-name-2' })

      const opResult1 = uow.bulkUpsert([obj1])
      const opResult2 = uow.bulkUpsert([obj2])

      await uow.execute()

      expect(req1.body.operations).to.have.length(2)

      expect(req1.body.operations[0]).to.deep.include({
        opResultId   : 'upsert_bulkPerson1',
        operationType: 'UPSERT_BULK',
        table        : 'Person',
        payload      : [
          {
            ___class: 'Person',
            name    : 'p-name-1',
          }
        ],
      })

      expect(req1.body.operations[1]).to.deep.include({
        opResultId   : 'upsert_bulkPerson2',
        operationType: 'UPSERT_BULK',
        table        : 'Person',
        payload      : [
          {
            name: 'p-name-2',
          }
        ],
      })

      expect(opResult1.result).to.equal(opResult1.getResult()).to.equal(results.upsert_bulkPerson1.result)
      expect(opResult2.result).to.equal(opResult2.getResult()).to.equal(results.upsert_bulkPerson2.result)
    })

    it('bulkUpsert(tableName: string, objects: object[]): OpResult', async () => {
      const results = {
        upsert_bulkPerson1: {
          result: {
            objectId: 'test-objectId'
          }
        },
        upsert_bulkPerson2: {
          result: {
            objectId: 'test-objectId'
          }
        },
        upsert_bulkPerson3: {
          result: {
            objectId: 'test-objectId'
          }
        }
      }

      const req1 = prepareSuccessResponse(results)

      const obj1 = { ___class: PERSONS_TABLE_NAME, name: 'p-name-1' }
      const obj2 = new Person({ name: 'p-name-2' })
      const obj3 = { name: 'p-name-3' }

      const opResult1 = uow.bulkUpsert(PERSONS_TABLE_NAME, [obj1])
      const opResult2 = uow.bulkUpsert(PERSONS_TABLE_NAME, [obj2])
      const opResult3 = uow.bulkUpsert(PERSONS_TABLE_NAME, [obj3])

      await uow.execute()

      expect(req1.body.operations).to.have.length(3)

      expect(req1.body.operations[0]).to.deep.include({
        opResultId   : 'upsert_bulkPerson1',
        operationType: 'UPSERT_BULK',
        table        : 'Person',
        payload      : [
          {
            ___class: 'Person',
            name    : 'p-name-1',
          }
        ],
      })

      expect(req1.body.operations[1]).to.deep.include({
        opResultId   : 'upsert_bulkPerson2',
        operationType: 'UPSERT_BULK',
        table        : 'Person',
        payload      : [
          {
            name: 'p-name-2',
          }
        ],
      })

      expect(req1.body.operations[2]).to.deep.include({
        opResultId   : 'upsert_bulkPerson3',
        operationType: 'UPSERT_BULK',
        table        : 'Person',
        payload      : [
          {
            name: 'p-name-3',
          }
        ],
      })

      expect(opResult1.result).to.equal(opResult1.getResult()).to.equal(results.upsert_bulkPerson1.result)
      expect(opResult2.result).to.equal(opResult2.getResult()).to.equal(results.upsert_bulkPerson2.result)
      expect(opResult3.result).to.equal(opResult3.getResult()).to.equal(results.upsert_bulkPerson3.result)
    })

  })

  describe('Fails', () => {
    it('objects is not a list', async () => {
      const errorMsg = 'Objects must be an array of objects.'

      expect(() => uow.bulkUpsert()).to.throw(errorMsg)
      expect(() => uow.bulkUpsert(null)).to.throw(errorMsg)
      expect(() => uow.bulkUpsert(true)).to.throw(errorMsg)
      expect(() => uow.bulkUpsert(123)).to.throw(errorMsg)
      expect(() => uow.bulkUpsert({})).to.throw(errorMsg)
      expect(() => uow.bulkUpsert(() => ({}))).to.throw(errorMsg)

      expect(() => uow.bulkUpsert(PERSONS_TABLE_NAME)).to.throw(errorMsg)
      expect(() => uow.bulkUpsert(PERSONS_TABLE_NAME, null)).to.throw(errorMsg)
      expect(() => uow.bulkUpsert(PERSONS_TABLE_NAME, true)).to.throw(errorMsg)
      expect(() => uow.bulkUpsert(PERSONS_TABLE_NAME, 123)).to.throw(errorMsg)
      expect(() => uow.bulkUpsert(PERSONS_TABLE_NAME, {})).to.throw(errorMsg)
      expect(() => uow.bulkUpsert(PERSONS_TABLE_NAME, () => ({}))).to.throw(errorMsg)
    })

    it('table name is not a string', async () => {
      const errorMsg = 'Table Name must be a string.'

      expect(() => uow.bulkUpsert(undefined, [])).to.throw(errorMsg)
      expect(() => uow.bulkUpsert(null, [])).to.throw(errorMsg)
      expect(() => uow.bulkUpsert(true, [])).to.throw(errorMsg)
      expect(() => uow.bulkUpsert(123, [])).to.throw(errorMsg)
      expect(() => uow.bulkUpsert({}, [])).to.throw(errorMsg)
      expect(() => uow.bulkUpsert([], [])).to.throw(errorMsg)
      expect(() => uow.bulkUpsert(() => ({}), [])).to.throw(errorMsg)
    })
  })
})
