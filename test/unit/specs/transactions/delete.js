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

describe('<Transactions> Delete Operation', () => {

  forSuite()

  let uow

  beforeEach(() => {
    uow = new Backendless.UnitOfWork()
  })

  it('deletes one map-object', async () => {
    const obj = { objectId: 'test-objectId', name: 'p-name' }

    const results = {
      deletePerson1: {
        operationType: 'DELETE',
        result       : obj
      }
    }

    const req1 = prepareSuccessResponse(results)

    const opResult = uow.delete(PERSONS_TABLE_NAME, obj)

    await uow.execute()

    expect(req1.body).to.deep.include({
      operations: [
        {
          opResultId   : 'deletePerson1',
          operationType: 'DELETE',
          table        : 'Person',
          payload      : obj.objectId,
        }
      ]
    })

    expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.deletePerson1.result)
  })

  it('deletes one instance-object', async () => {
    const obj = new Person({ objectId: 'test-objectId', name: 'p-name' })

    const results = {
      deletePerson1: {
        operationType: 'UPDATE',
        result       : {}
      }
    }

    const req1 = prepareSuccessResponse(results)

    const opResult = uow.delete(obj)

    await uow.execute()

    expect(req1.body).to.deep.include({
      operations: [
        {
          opResultId   : 'deletePerson1',
          operationType: 'DELETE',
          table        : 'Person',
          payload      : obj.objectId,
        }
      ]
    })

    expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.deletePerson1.result)
  })

  it('deletes several objects', async () => {
    const obj1 = { objectId: 'test-objectId-1', name: 'p-1' }
    const obj2 = { objectId: 'test-objectId-2', name: 'p-2' }
    const obj3 = { objectId: 'test-objectId-3', name: 'p-3' }

    const results = {
      deletePerson1: {
        operationType: 'UPDATE',
      },
      deletePerson2: {
        operationType: 'UPDATE',
      },
      deletePerson3: {
        operationType: 'UPDATE',
      }
    }

    const req1 = prepareSuccessResponse(results)

    const opResult1 = uow.delete(PERSONS_TABLE_NAME, obj1)
    const opResult2 = uow.delete(PERSONS_TABLE_NAME, obj2)
    const opResult3 = uow.delete(PERSONS_TABLE_NAME, obj3)

    await uow.execute()

    expect(req1.body).to.deep.include({
      operations: [
        {
          opResultId   : 'deletePerson1',
          operationType: 'DELETE',
          table        : 'Person',
          payload      : obj1.objectId,
        },
        {
          opResultId   : 'deletePerson2',
          operationType: 'DELETE',
          table        : 'Person',
          payload      : obj2.objectId,
        },
        {
          opResultId   : 'deletePerson3',
          operationType: 'DELETE',
          table        : 'Person',
          payload      : obj3.objectId,
        }
      ]
    })

    expect(opResult1.result).to.equal(opResult1.getResult()).to.equal(results.deletePerson1.result)
    expect(opResult2.result).to.equal(opResult2.getResult()).to.equal(results.deletePerson2.result)
    expect(opResult3.result).to.equal(opResult3.getResult()).to.equal(results.deletePerson3.result)
  })

  it('creates object and deletes using OpResult', async () => {
    const newPerson = new Person({ name: 'p-1', age: 777 })

    const results = {
      createPerson1: {
        operationType: 'CREATE',
      },
      deletePerson1: {
        operationType: 'DELETE',
      }
    }

    const req1 = prepareSuccessResponse(results)

    const createOpResult = uow.create(newPerson)

    uow.delete(createOpResult)

    await uow.execute()

    expect(req1.body).to.deep.include({
      operations: [
        {
          opResultId   : 'createPerson1',
          operationType: 'CREATE',
          table        : 'Person',
          payload      : {
            age : 777,
            name: 'p-1'
          }
        },
        {
          opResultId   : 'deletePerson1',
          operationType: 'DELETE',
          table        : 'Person',
          payload      : {
            ___ref    : true,
            opResultId: 'createPerson1',
            propName  : 'objectId'
          }
        }
      ]
    })
  })

  describe('Signatures', () => {

    it('delete(object: object): OpResult', async () => {
      const obj1 = { ___class: PERSONS_TABLE_NAME, objectId: 'test-objectId', name: 'p-name' }
      const obj2 = new Person({ objectId: 'test-objectId', name: 'p-name' })

      const results = {
        deletePerson1: {
          operationType: 'DELETE',
          result       : {}
        },
        deletePerson2: {
          operationType: 'DELETE',
          result       : {}
        }
      }

      const req1 = prepareSuccessResponse(results)

      const opResult1 = uow.delete(obj1)
      const opResult2 = uow.delete(obj2)

      await uow.execute()

      expect(req1.body).to.deep.include({
        operations: [
          {
            opResultId   : 'deletePerson1',
            operationType: 'DELETE',
            table        : 'Person',
            payload      : obj1.objectId,
          },
          {
            opResultId   : 'deletePerson2',
            operationType: 'DELETE',
            table        : 'Person',
            payload      : obj2.objectId,
          }
        ]
      })

      expect(opResult1.result).to.equal(opResult1.getResult()).to.equal(results.deletePerson1.result)
      expect(opResult2.result).to.equal(opResult2.getResult()).to.equal(results.deletePerson2.result)
    })

    it('delete(tableName: string, object: object): OpResult', async () => {
      const obj1 = { objectId: 'test-objectId', name: 'p-name' }
      const obj2 = new Person({ objectId: 'test-objectId', name: 'p-name' })

      const results = {
        deletePerson1: {
          operationType: 'DELETE',
          result       : {}
        },
        deletePerson2: {
          operationType: 'DELETE',
          result       : {}
        }
      }

      const req1 = prepareSuccessResponse(results)

      const opResult1 = uow.delete(PERSONS_TABLE_NAME, obj1)
      const opResult2 = uow.delete(PERSONS_TABLE_NAME, obj2)

      await uow.execute()

      expect(req1.body).to.deep.include({
        operations: [
          {
            opResultId   : 'deletePerson1',
            operationType: 'DELETE',
            table        : 'Person',
            payload      : obj1.objectId,
          },
          {
            opResultId   : 'deletePerson2',
            operationType: 'DELETE',
            table        : 'Person',
            payload      : obj2.objectId,
          }
        ]
      })

      expect(opResult1.result).to.equal(opResult1.getResult()).to.equal(results.deletePerson1.result)
      expect(opResult2.result).to.equal(opResult2.getResult()).to.equal(results.deletePerson2.result)
    })

    it('delete(tableName: string, objectId: string): OpResult', async () => {
      const objectId1 = 'test-objectId-1'
      const objectId2 = 'test-objectId-2'

      const results = {
        deletePerson1: {
          operationType: 'DELETE',
          result       : {}
        },
        deletePerson2: {
          operationType: 'DELETE',
          result       : {}
        }
      }

      const req1 = prepareSuccessResponse(results)

      const opResult1 = uow.delete(PERSONS_TABLE_NAME, objectId1)
      const opResult2 = uow.delete(PERSONS_TABLE_NAME, objectId2)

      await uow.execute()

      expect(req1.body).to.deep.include({
        operations: [
          {
            opResultId   : 'deletePerson1',
            operationType: 'DELETE',
            table        : 'Person',
            payload      : objectId1,
          },
          {
            opResultId   : 'deletePerson2',
            operationType: 'DELETE',
            table        : 'Person',
            payload      : objectId2,
          }
        ]
      })

      expect(opResult1.result).to.equal(opResult1.getResult()).to.equal(results.deletePerson1.result)
      expect(opResult2.result).to.equal(opResult2.getResult()).to.equal(results.deletePerson2.result)
    })

    it('delete(opResult: OpResult | OpResultValueReference): OpResult', async () => {
      const newPerson = new Person({ name: 'p-1', age: 777 })

      const results = {
        findPerson1  : {
          operationType: 'FIND',
          result       : []
        },
        createPerson1: {
          operationType: 'CREATE',
          result       : {}
        },
        deletePerson1: {
          operationType: 'DELETE',
          result       : {}
        },
        deletePerson2: {
          operationType: 'DELETE',
          result       : {}
        }
      }

      const req1 = prepareSuccessResponse(results)

      const findOpResult = uow.find(PERSONS_TABLE_NAME, {})
      const createOpResult = uow.create(newPerson)
      const opResult1 = uow.delete(findOpResult.resolveTo(1))
      const opResult2 = uow.delete(createOpResult)

      await uow.execute()

      expect(req1.body).to.deep.include({
        operations: [
          {
            opResultId   : 'findPerson1',
            operationType: 'FIND',
            table        : 'Person',
            payload      : {
              queryOptions: {}
            },
          },
          {
            opResultId   : 'createPerson1',
            operationType: 'CREATE',
            table        : 'Person',
            payload      : {
              age : 777,
              name: 'p-1'
            }
          },
          {
            opResultId   : 'deletePerson1',
            operationType: 'DELETE',
            table        : 'Person',
            payload      : {
              ___ref     : true,
              opResultId : 'findPerson1',
              propName   : 'objectId',
              resultIndex: 1,
            }
          },
          {
            opResultId   : 'deletePerson2',
            operationType: 'DELETE',
            table        : 'Person',
            payload      : {
              ___ref    : true,
              opResultId: 'createPerson1',
              propName  : 'objectId',
            }
          }
        ]
      })

      expect(opResult1.result).to.equal(opResult1.getResult()).to.equal(results.deletePerson1.result)
      expect(opResult2.result).to.equal(opResult2.getResult()).to.equal(results.deletePerson2.result)
    })

  })

  describe('Fails', () => {
    const invalidArgsError = 'Invalid arguments'

    it('when there is invalid parameters count', async () => {
      const createOpResult = uow.create(PERSONS_TABLE_NAME, {})

      expect(() => uow.delete('tableName', {}, {})).to.throw(invalidArgsError)
      expect(() => uow.delete(createOpResult, {}, {})).to.throw(invalidArgsError)
    })

    it('table name is not a string', async () => {
      expect(() => uow.delete()).to.throw(invalidArgsError)
      expect(() => uow.delete(null)).to.throw(invalidArgsError)
      expect(() => uow.delete(true)).to.throw(invalidArgsError)
      expect(() => uow.delete(123)).to.throw(invalidArgsError)
      expect(() => uow.delete({})).to.throw(invalidArgsError)
      expect(() => uow.delete([])).to.throw(invalidArgsError)
      expect(() => uow.delete(() => ({}))).to.throw(invalidArgsError)

      const noTableNameError = 'Table Name must be a string'

      expect(() => uow.delete(undefined, {})).to.throw(noTableNameError)
      expect(() => uow.delete(null, {})).to.throw(noTableNameError)
      expect(() => uow.delete(true, {})).to.throw(noTableNameError)
      expect(() => uow.delete(123, {})).to.throw(noTableNameError)
      expect(() => uow.delete({}, {})).to.throw(noTableNameError)
      expect(() => uow.delete([], {})).to.throw(noTableNameError)
      expect(() => uow.delete(() => ({}), {})).to.throw(noTableNameError)
    })

    it('object is not specified', async () => {
      expect(() => uow.delete(PERSONS_TABLE_NAME)).to.throw(invalidArgsError)
      expect(() => uow.delete(PERSONS_TABLE_NAME, null)).to.throw(invalidArgsError)
      expect(() => uow.delete(PERSONS_TABLE_NAME, true)).to.throw(invalidArgsError)
      expect(() => uow.delete(PERSONS_TABLE_NAME, 123)).to.throw(invalidArgsError)
      expect(() => uow.delete(PERSONS_TABLE_NAME, [])).to.throw(invalidArgsError)
      expect(() => uow.delete(PERSONS_TABLE_NAME, () => ({}))).to.throw(invalidArgsError)
    })

  })

})
