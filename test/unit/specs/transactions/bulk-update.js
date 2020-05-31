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

describe('<Transactions> Bulk Update Operation', function() {

  forSuite(this)

  let uow

  beforeEach(() => {
    uow = new Backendless.UnitOfWork()
  })

  describe('Signatures', () => {

    it('bulkUpdate(opResult: OpResult, changes: object): OpResult', async () => {
      const results = {
        findPerson1       : {
          result: {}
        },
        update_bulkPerson1: {
          result: {}
        }
      }

      const req1 = prepareSuccessResponse(results)

      const findOpResult = uow.find(PERSONS_TABLE_NAME)
      const bulkUpdateOpResult = uow.bulkUpdate(findOpResult, { foo: 333 })

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
        opResultId   : 'update_bulkPerson1',
        operationType: 'UPDATE_BULK',
        table        : 'Person',
        payload      : {
          changes      : {
            foo: 333,
          },
          unconditional: {
            ___ref    : true,
            opResultId: 'findPerson1'
          }
        }
      })

      expect(bulkUpdateOpResult.result).to.equal(bulkUpdateOpResult.getResult()).to.equal(results.update_bulkPerson1.result)
    })

    it('bulkUpdate(whereClause: string, changes: object): OpResult', async () => {
      const results = {
        update_bulkPerson1: {
          result: {}
        },
        update_bulkPerson2: {
          result: {}
        }
      }

      const req1 = prepareSuccessResponse(results)

      const obj1 = { ___class: PERSONS_TABLE_NAME, name: 'p-name-1' }
      const obj2 = new Person({ name: 'p-name-2' })

      const opResult1 = uow.bulkUpdate('foo > 123', obj1)
      const opResult2 = uow.bulkUpdate('foo > 123', obj2)

      await uow.execute()

      expect(req1.body.operations).to.have.length(2)

      expect(req1.body.operations[0]).to.deep.include({
        opResultId   : 'update_bulkPerson1',
        operationType: 'UPDATE_BULK',
        table        : 'Person',
        payload      : {
          conditional: 'foo > 123',
          changes    : {
            ___class: 'Person',
            name    : 'p-name-1',
          }
        }
      })

      expect(req1.body.operations[1]).to.deep.include({
        opResultId   : 'update_bulkPerson2',
        operationType: 'UPDATE_BULK',
        table        : 'Person',
        payload      : {
          conditional: 'foo > 123',
          changes    : {
            name: 'p-name-2',
          }
        }
      })

      expect(opResult1.result).to.equal(opResult1.getResult()).to.equal(results.update_bulkPerson1.result)
      expect(opResult2.result).to.equal(opResult2.getResult()).to.equal(results.update_bulkPerson2.result)
    })

    it('bulkUpdate(tableName: string, whereClause: string, changes: object): OpResult', async () => {
      const results = {
        update_bulkPerson1: {
          result: {}
        }
      }

      const req1 = prepareSuccessResponse(results)

      const opResult1 = uow.bulkUpdate(PERSONS_TABLE_NAME, 'foo > 123', { foo: 222 })

      await uow.execute()

      expect(req1.body.operations).to.have.length(1)

      expect(req1.body.operations[0]).to.deep.include({
        opResultId   : 'update_bulkPerson1',
        operationType: 'UPDATE_BULK',
        table        : 'Person',
        payload      : {
          conditional: 'foo > 123',
          changes    : {
            foo: 222,
          }
        }
      })

      expect(opResult1.result).to.equal(opResult1.getResult()).to.equal(results.update_bulkPerson1.result)
    })

    it('bulkUpdate(tableName: string, objectIds: string[], changes: object): OpResult', async () => {
      const results = {
        update_bulkPerson1: {
          result: {}
        }
      }

      const req1 = prepareSuccessResponse(results)

      const opResult1 = uow.bulkUpdate(PERSONS_TABLE_NAME, ['objectId-1', 'objectId-2'], { foo: 111 })

      await uow.execute()

      expect(req1.body.operations).to.have.length(1)

      expect(req1.body.operations[0]).to.deep.include({
        opResultId   : 'update_bulkPerson1',
        operationType: 'UPDATE_BULK',
        table        : 'Person',
        payload      : {
          unconditional: ['objectId-1', 'objectId-2'],
          changes      : {
            foo: 111
          },
        }
      })

      expect(opResult1.result).to.equal(opResult1.getResult()).to.equal(results.update_bulkPerson1.result)
    })

    it('bulkUpdate(tableName: string, objects: object[], changes: object): OpResult', async () => {
      const results = {
        update_bulkPerson1: {
          result: {}
        }
      }

      const req1 = prepareSuccessResponse(results)

      const opResult1 = uow.bulkUpdate(PERSONS_TABLE_NAME, [{ objectId: 'objectId-1' }, { objectId: 'objectId-2' }], { foo: 111 })

      await uow.execute()

      expect(req1.body.operations).to.have.length(1)

      expect(req1.body.operations[0]).to.deep.include({
        opResultId   : 'update_bulkPerson1',
        operationType: 'UPDATE_BULK',
        table        : 'Person',
        payload      : {
          unconditional: ['objectId-1', 'objectId-2'],
          changes      : {
            foo: 111
          },
        }
      })

      expect(opResult1.result).to.equal(opResult1.getResult()).to.equal(results.update_bulkPerson1.result)
    })

  })

  describe('Fails', () => {

    const invalidArgsError = 'Invalid arguments'

    it('has invalid parameters count', async () => {
      expect(() => uow.bulkUpdate('foo > 0', {}, {})).to.throw(invalidArgsError)
      expect(() => uow.bulkUpdate(PERSONS_TABLE_NAME, [], {}, {})).to.throw(invalidArgsError)
    })

    it('has invalid condition', async () => {
      expect(() => uow.bulkUpdate(PERSONS_TABLE_NAME, 0, {})).to.throw(invalidArgsError)
      expect(() => uow.bulkUpdate(PERSONS_TABLE_NAME, 123, {})).to.throw(invalidArgsError)
      expect(() => uow.bulkUpdate(PERSONS_TABLE_NAME, true, {})).to.throw(invalidArgsError)
      expect(() => uow.bulkUpdate(PERSONS_TABLE_NAME, false, {})).to.throw(invalidArgsError)
      expect(() => uow.bulkUpdate(PERSONS_TABLE_NAME, null, {})).to.throw(invalidArgsError)
      expect(() => uow.bulkUpdate(PERSONS_TABLE_NAME, {}, {})).to.throw(invalidArgsError)
      expect(() => uow.bulkUpdate(PERSONS_TABLE_NAME, () => ({}), {})).to.throw(invalidArgsError)
    })

    it('table name is not a string', async () => {
      const errorMsg = 'Table Name must be a string.'

      expect(() => uow.bulkUpdate(undefined, [])).to.throw(errorMsg)
      expect(() => uow.bulkUpdate(null, [])).to.throw(errorMsg)
      expect(() => uow.bulkUpdate(true, [])).to.throw(errorMsg)
      expect(() => uow.bulkUpdate(123, [])).to.throw(errorMsg)
      expect(() => uow.bulkUpdate({}, [])).to.throw(errorMsg)
      expect(() => uow.bulkUpdate([], [])).to.throw(errorMsg)
      expect(() => uow.bulkUpdate(() => ({}), [])).to.throw(errorMsg)
    })
  })
})
