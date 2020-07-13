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

describe('<Transactions> Bulk Delete Operation', function() {

  forSuite(this)

  let uow

  beforeEach(() => {
    uow = new Backendless.UnitOfWork()
  })

  describe('Signatures', () => {

    it('bulkDelete(opResult: OpResult): OpResult', async () => {
      const results = {
        findPerson1: {
          result: {}
        },

        delete_bulkPerson1: {
          result: {}
        }
      }

      const req1 = prepareSuccessResponse(results)

      const findOpResult = uow.find(PERSONS_TABLE_NAME)
      const bulkUpdateOpResult = uow.bulkDelete(findOpResult)

      await uow.execute()

      expect(req1.body.operations).to.have.length(2)

      expect(req1.body.operations[0]).to.deep.include({
        opResultId   : 'findPerson1',
        operationType: 'FIND',
        table        : 'Person',
        payload      : {
          queryOptions: {}
        }
      })

      expect(req1.body.operations[1]).to.deep.include({
        opResultId   : 'delete_bulkPerson1',
        operationType: 'DELETE_BULK',
        table        : 'Person',
        payload      : {
          unconditional: {
            ___ref    : true,
            opResultId: 'findPerson1'
          }
        }
      })

      expect(bulkUpdateOpResult.result).to.equal(bulkUpdateOpResult.getResult()).to.equal(results.delete_bulkPerson1.result)
    })

    it('bulkDelete(objects: object[]): OpResult', async () => {
      const results = {
        delete_bulkPerson1: {
          result: {}
        },
        delete_bulkPerson2: {
          result: {}
        }
      }

      const req1 = prepareSuccessResponse(results)

      const obj1 = { ___class: PERSONS_TABLE_NAME, objectId: 'objectId-1' }
      const obj2 = new Person({ objectId: 'objectId-2' })

      const opResult1 = uow.bulkDelete([obj1])
      const opResult2 = uow.bulkDelete([obj2])

      await uow.execute()

      expect(req1.body.operations).to.have.length(2)

      expect(req1.body.operations[0]).to.deep.include({
        opResultId   : 'delete_bulkPerson1',
        operationType: 'DELETE_BULK',
        table        : 'Person',
        payload      : {
          unconditional: ['objectId-1']
        }
      })

      expect(req1.body.operations[1]).to.deep.include({
        opResultId   : 'delete_bulkPerson2',
        operationType: 'DELETE_BULK',
        table        : 'Person',
        payload      : {
          unconditional: ['objectId-2']
        }
      })

      expect(opResult1.result).to.equal(opResult1.getResult()).to.equal(results.delete_bulkPerson1.result)
      expect(opResult2.result).to.equal(opResult2.getResult()).to.equal(results.delete_bulkPerson2.result)
    })

    it('bulkDelete(tableName: string, objects: object[]): OpResult', async () => {
      const results = {
        delete_bulkPerson1: {
          result: {}
        },
        delete_bulkPerson2: {
          result: {}
        },
        delete_bulkPerson3: {
          result: {}
        }
      }

      const req1 = prepareSuccessResponse(results)

      const obj1 = { ___class: PERSONS_TABLE_NAME, objectId: 'objectId-1' }
      const obj2 = new Person({ objectId: 'objectId-2' })
      const obj3 = { objectId: 'objectId-3' }

      const opResult1 = uow.bulkDelete(PERSONS_TABLE_NAME, [obj1])
      const opResult2 = uow.bulkDelete(PERSONS_TABLE_NAME, [obj2])
      const opResult3 = uow.bulkDelete(PERSONS_TABLE_NAME, [obj3])

      await uow.execute()

      expect(req1.body.operations).to.have.length(3)

      expect(req1.body.operations[0]).to.deep.include({
        opResultId   : 'delete_bulkPerson1',
        operationType: 'DELETE_BULK',
        table        : 'Person',
        payload      : {
          unconditional: ['objectId-1']
        }
      })

      expect(req1.body.operations[1]).to.deep.include({
        opResultId   : 'delete_bulkPerson2',
        operationType: 'DELETE_BULK',
        table        : 'Person',
        payload      : {
          unconditional: ['objectId-2']
        }
      })

      expect(req1.body.operations[2]).to.deep.include({
        opResultId   : 'delete_bulkPerson3',
        operationType: 'DELETE_BULK',
        table        : 'Person',
        payload      : {
          unconditional: ['objectId-3']
        }
      })

      expect(opResult1.result).to.equal(opResult1.getResult()).to.equal(results.delete_bulkPerson1.result)
      expect(opResult2.result).to.equal(opResult2.getResult()).to.equal(results.delete_bulkPerson2.result)
      expect(opResult3.result).to.equal(opResult3.getResult()).to.equal(results.delete_bulkPerson3.result)
    })

    it('bulkDelete(tableName: string, objectIds: string[]): OpResult', async () => {
      const results = {
        delete_bulkPerson1: {
          result: {}
        },
        delete_bulkPerson2: {
          result: {}
        },
        delete_bulkPerson3: {
          result: {}
        }
      }

      const req1 = prepareSuccessResponse(results)

      const opResult1 = uow.bulkDelete(PERSONS_TABLE_NAME, ['objectId-1'])
      const opResult2 = uow.bulkDelete(PERSONS_TABLE_NAME, ['objectId-2'])
      const opResult3 = uow.bulkDelete(PERSONS_TABLE_NAME, ['objectId-3'])

      await uow.execute()

      expect(req1.body.operations).to.have.length(3)

      expect(req1.body.operations[0]).to.deep.include({
        opResultId   : 'delete_bulkPerson1',
        operationType: 'DELETE_BULK',
        table        : 'Person',
        payload      : {
          unconditional: ['objectId-1']
        }
      })

      expect(req1.body.operations[1]).to.deep.include({
        opResultId   : 'delete_bulkPerson2',
        operationType: 'DELETE_BULK',
        table        : 'Person',
        payload      : {
          unconditional: ['objectId-2']
        }
      })

      expect(req1.body.operations[2]).to.deep.include({
        opResultId   : 'delete_bulkPerson3',
        operationType: 'DELETE_BULK',
        table        : 'Person',
        payload      : {
          unconditional: ['objectId-3']
        }
      })

      expect(opResult1.result).to.equal(opResult1.getResult()).to.equal(results.delete_bulkPerson1.result)
      expect(opResult2.result).to.equal(opResult2.getResult()).to.equal(results.delete_bulkPerson2.result)
      expect(opResult3.result).to.equal(opResult3.getResult()).to.equal(results.delete_bulkPerson3.result)
    })

    it('bulkDelete(tableName: string, whereClause: string', async () => {
      const results = {
        delete_bulkPerson1: {
          result: {}
        }
      }

      const req1 = prepareSuccessResponse(results)

      const opResult1 = uow.bulkDelete(PERSONS_TABLE_NAME, 'foo > 123')

      await uow.execute()

      expect(req1.body.operations).to.have.length(1)

      expect(req1.body.operations[0]).to.deep.include({
        opResultId   : 'delete_bulkPerson1',
        operationType: 'DELETE_BULK',
        table        : 'Person',
        payload      : {
          conditional: 'foo > 123',
        }
      })

      expect(opResult1.result).to.equal(opResult1.getResult()).to.equal(results.delete_bulkPerson1.result)
    })

  })

  describe('Fails', () => {
    /**
     * bulkDelete(opResult: OpResult): OpResult;
     * bulkDelete(objects: object[]): OpResult;
     *
     * bulkDelete(tableName: string, objects: object[]): OpResult;
     * bulkDelete(tableName: string, objectIds: string[]): OpResult;
     * bulkDelete(tableName: string, whereClause: string): OpResult;
     * **/

    const invalidArgsError = 'Invalid arguments'

    it('has invalid parameters count', async () => {
      expect(() => uow.bulkDelete()).to.throw(invalidArgsError)
      expect(() => uow.bulkDelete('str')).to.throw(invalidArgsError)
      expect(() => uow.bulkDelete(PERSONS_TABLE_NAME, [], {}, {})).to.throw(invalidArgsError)
    })

    it('has invalid condition', async () => {
      expect(() => uow.bulkDelete(PERSONS_TABLE_NAME, 0)).to.throw(invalidArgsError)
      expect(() => uow.bulkDelete(PERSONS_TABLE_NAME, 123)).to.throw(invalidArgsError)
      expect(() => uow.bulkDelete(PERSONS_TABLE_NAME, true)).to.throw(invalidArgsError)
      expect(() => uow.bulkDelete(PERSONS_TABLE_NAME, false)).to.throw(invalidArgsError)
      expect(() => uow.bulkDelete(PERSONS_TABLE_NAME, null)).to.throw(invalidArgsError)
      expect(() => uow.bulkDelete(PERSONS_TABLE_NAME, {})).to.throw(invalidArgsError)
      expect(() => uow.bulkDelete(PERSONS_TABLE_NAME, () => ({}))).to.throw(invalidArgsError)
    })

    it('table name is not a string', async () => {
      const errorMsg = 'Table Name must be a string.'

      expect(() => uow.bulkDelete(undefined, [])).to.throw(errorMsg)
      expect(() => uow.bulkDelete(null, [])).to.throw(errorMsg)
      expect(() => uow.bulkDelete(true, [])).to.throw(errorMsg)
      expect(() => uow.bulkDelete(123, [])).to.throw(errorMsg)
      expect(() => uow.bulkDelete({}, [])).to.throw(errorMsg)
      expect(() => uow.bulkDelete([], [])).to.throw(errorMsg)
      expect(() => uow.bulkDelete(() => ({}), [])).to.throw(errorMsg)
    })
  })
})
