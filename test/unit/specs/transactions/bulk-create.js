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

describe('<Transactions> Bulk Create Operation', function() {

  forSuite(this)

  let uow

  beforeEach(() => {
    uow = new Backendless.UnitOfWork()
  })

  describe('Signatures', () => {

    it('bulkCreate(objects: object[]): OpResult', async () => {
      const results = {
        create_bulkPerson1: {
          result: {
            objectId: 'test-objectId'
          }
        },
        create_bulkPerson2: {
          result: {
            objectId: 'test-objectId'
          }
        }
      }

      const req1 = prepareSuccessResponse(results)

      const obj1 = { ___class: PERSONS_TABLE_NAME, name: 'p-name-1' }
      const obj2 = new Person({ name: 'p-name-2' })

      const opResult1 = uow.bulkCreate([obj1])
      const opResult2 = uow.bulkCreate([obj2])

      await uow.execute()

      expect(req1.body.operations).to.have.length(2)

      expect(req1.body.operations[0]).to.deep.include({
        opResultId   : 'create_bulkPerson1',
        operationType: 'CREATE_BULK',
        table        : 'Person',
        payload      : [
          {
            ___class: 'Person',
            name    : 'p-name-1',
          }
        ],
      })

      expect(req1.body.operations[1]).to.deep.include({
        opResultId   : 'create_bulkPerson2',
        operationType: 'CREATE_BULK',
        table        : 'Person',
        payload      : [
          {
            name: 'p-name-2',
          }
        ],
      })

      expect(opResult1.result).to.equal(opResult1.getResult()).to.equal(results.create_bulkPerson1.result)
      expect(opResult2.result).to.equal(opResult2.getResult()).to.equal(results.create_bulkPerson2.result)
    })

    it('bulkCreate(tableName: string, objects: object[]): OpResult', async () => {
      const results = {
        create_bulkPerson1: {
          result: {
            objectId: 'test-objectId'
          }
        },
        create_bulkPerson2: {
          result: {
            objectId: 'test-objectId'
          }
        },
        create_bulkPerson3: {
          result: {
            objectId: 'test-objectId'
          }
        }
      }

      const req1 = prepareSuccessResponse(results)

      const obj1 = { ___class: PERSONS_TABLE_NAME, name: 'p-name-1' }
      const obj2 = new Person({ name: 'p-name-2' })
      const obj3 = { name: 'p-name-3' }

      const opResult1 = uow.bulkCreate(PERSONS_TABLE_NAME, [obj1])
      const opResult2 = uow.bulkCreate(PERSONS_TABLE_NAME, [obj2])
      const opResult3 = uow.bulkCreate(PERSONS_TABLE_NAME, [obj3])

      await uow.execute()

      expect(req1.body.operations).to.have.length(3)

      expect(req1.body.operations[0]).to.deep.include({
        opResultId   : 'create_bulkPerson1',
        operationType: 'CREATE_BULK',
        table        : 'Person',
        payload      : [
          {
            ___class: 'Person',
            name    : 'p-name-1',
          }
        ],
      })

      expect(req1.body.operations[1]).to.deep.include({
        opResultId   : 'create_bulkPerson2',
        operationType: 'CREATE_BULK',
        table        : 'Person',
        payload      : [
          {
            name: 'p-name-2',
          }
        ],
      })

      expect(req1.body.operations[2]).to.deep.include({
        opResultId   : 'create_bulkPerson3',
        operationType: 'CREATE_BULK',
        table        : 'Person',
        payload      : [
          {
            name: 'p-name-3',
          }
        ],
      })

      expect(opResult1.result).to.equal(opResult1.getResult()).to.equal(results.create_bulkPerson1.result)
      expect(opResult2.result).to.equal(opResult2.getResult()).to.equal(results.create_bulkPerson2.result)
      expect(opResult3.result).to.equal(opResult3.getResult()).to.equal(results.create_bulkPerson3.result)
    })

  })

  describe('Fails', () => {
    it('objects is not a list', async () => {
      const errorMsg = 'Objects must be an array of objects.'

      expect(() => uow.bulkCreate()).to.throw(errorMsg)
      expect(() => uow.bulkCreate(null)).to.throw(errorMsg)
      expect(() => uow.bulkCreate(true)).to.throw(errorMsg)
      expect(() => uow.bulkCreate(123)).to.throw(errorMsg)
      expect(() => uow.bulkCreate({})).to.throw(errorMsg)
      expect(() => uow.bulkCreate(() => ({}))).to.throw(errorMsg)

      expect(() => uow.bulkCreate(PERSONS_TABLE_NAME)).to.throw(errorMsg)
      expect(() => uow.bulkCreate(PERSONS_TABLE_NAME, null)).to.throw(errorMsg)
      expect(() => uow.bulkCreate(PERSONS_TABLE_NAME, true)).to.throw(errorMsg)
      expect(() => uow.bulkCreate(PERSONS_TABLE_NAME, 123)).to.throw(errorMsg)
      expect(() => uow.bulkCreate(PERSONS_TABLE_NAME, {})).to.throw(errorMsg)
      expect(() => uow.bulkCreate(PERSONS_TABLE_NAME, () => ({}))).to.throw(errorMsg)
    })

    it('table name is not a string', async () => {
      const errorMsg = 'Table Name must be a string.'

      expect(() => uow.bulkCreate(undefined, [])).to.throw(errorMsg)
      expect(() => uow.bulkCreate(null, [])).to.throw(errorMsg)
      expect(() => uow.bulkCreate(true, [])).to.throw(errorMsg)
      expect(() => uow.bulkCreate(123, [])).to.throw(errorMsg)
      expect(() => uow.bulkCreate({}, [])).to.throw(errorMsg)
      expect(() => uow.bulkCreate([], [])).to.throw(errorMsg)
      expect(() => uow.bulkCreate(() => ({}), [])).to.throw(errorMsg)
    })
  })
})
