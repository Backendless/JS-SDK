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

describe('<Transactions> Create Operation', () => {

  forSuite()

  let uow

  beforeEach(() => {
    uow = new Backendless.UnitOfWork()
  })

  it('creates one map-object', async () => {
    const results = {
      createPerson1: {
        operationType: 'CREATE',
        result       : {
          objectId: 'test-objectId'
        }
      }
    }

    const req1 = prepareSuccessResponse(results)

    const obj = { name: 'p-name' }

    const createOpResult = uow.create(PERSONS_TABLE_NAME, obj)

    await uow.execute()

    expect(req1.body).to.deep.include({
      operations: [
        {
          opResultId   : 'createPerson1',
          operationType: 'CREATE',
          table        : 'Person',
          payload      : obj,
        }
      ]
    })

    expect(createOpResult.result).to.equal(createOpResult.getResult()).to.equal(results.createPerson1.result)
  })

  it('creates one instance-object', async () => {
    const results = {
      createPerson1: {
        operationType: 'CREATE',
        result       : {
          objectId: 'test-objectId'
        }
      }
    }

    const req1 = prepareSuccessResponse(results)

    const obj = new Person({ name: 'p-name' })

    const opResult = uow.create(obj)

    await uow.execute()

    expect(req1.body).to.deep.include({
      operations: [
        {
          opResultId   : 'createPerson1',
          operationType: 'CREATE',
          table        : 'Person',
          payload      : JSON.parse(JSON.stringify(obj)),
        }
      ]
    })

    expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.createPerson1.result)
  })

  it('creates several objects', async () => {
    const req1 = prepareSuccessResponse()

    const obj1 = { name: 'p-1' }
    const obj2 = { name: 'p-2' }
    const obj3 = { name: 'p-3' }

    uow.create(PERSONS_TABLE_NAME, obj1)
    uow.create(PERSONS_TABLE_NAME, obj2)
    uow.create(PERSONS_TABLE_NAME, obj3)

    await uow.execute()

    expect(req1.body).to.deep.include({
      operations: [
        {
          opResultId   : 'createPerson1',
          operationType: 'CREATE',
          payload      : obj1,
          table        : 'Person',
        },
        {
          opResultId   : 'createPerson2',
          operationType: 'CREATE',
          payload      : obj2,
          table        : 'Person',
        },
        {
          opResultId   : 'createPerson3',
          operationType: 'CREATE',
          payload      : obj3,
          table        : 'Person',
        }
      ]
    })

  })

  describe('Signatures', () => {

    it('create(object: object): OpResult', async () => {
      const results = {
        createPerson1: {
          operationType: 'CREATE',
          result       : {
            objectId: 'test-objectId'
          }
        },
        createPerson2: {
          operationType: 'CREATE',
          result       : {
            objectId: 'test-objectId'
          }
        }
      }

      const req1 = prepareSuccessResponse(results)

      const obj1 = { ___class: PERSONS_TABLE_NAME, name: 'p-name' }
      const obj2 = new Person({ name: 'p-name' })

      const opResult1 = uow.create(obj1)
      const opResult2 = uow.create(obj2)

      await uow.execute()

      expect(req1.body).to.deep.include({
        operations: [
          {
            opResultId   : 'createPerson1',
            operationType: 'CREATE',
            table        : 'Person',
            payload      : obj1,
          },
          {
            opResultId   : 'createPerson2',
            operationType: 'CREATE',
            table        : 'Person',
            payload      : obj2,
          }
        ]
      })

      expect(opResult1.result).to.equal(opResult1.getResult()).to.equal(results.createPerson1.result)
      expect(opResult2.result).to.equal(opResult2.getResult()).to.equal(results.createPerson2.result)
    })

    it('create(tableName: string, object: object): OpResult', async () => {
      const results = {
        createPerson1: {
          operationType: 'CREATE',
          result       : {
            objectId: 'test-objectId'
          }
        },
        createPerson2: {
          operationType: 'CREATE',
          result       : {
            objectId: 'test-objectId'
          }
        }
      }

      const req1 = prepareSuccessResponse(results)

      const obj1 = { name: 'p-name' }
      const obj2 = new Person({ name: 'p-name' })

      const opResult1 = uow.create(PERSONS_TABLE_NAME, obj1)
      const opResult2 = uow.create(PERSONS_TABLE_NAME, obj2)

      await uow.execute()

      expect(req1.body).to.deep.include({
        operations: [
          {
            opResultId   : 'createPerson1',
            operationType: 'CREATE',
            table        : 'Person',
            payload      : obj1,
          },
          {
            opResultId   : 'createPerson2',
            operationType: 'CREATE',
            table        : 'Person',
            payload      : obj2,
          }
        ]
      })

      expect(opResult1.result).to.equal(opResult1.getResult()).to.equal(results.createPerson1.result)
      expect(opResult2.result).to.equal(opResult2.getResult()).to.equal(results.createPerson2.result)
    })
  })

  describe('Fails', () => {
    const invalidArgsError = 'Invalid arguments'

    it('has invalid parameters count', async () => {
      expect(() => uow.create('tableName', {}, {})).to.throw(invalidArgsError)
    })

    it('table name is not a string', async () => {
      expect(() => uow.create()).to.throw(invalidArgsError)
      expect(() => uow.create(null)).to.throw(invalidArgsError)
      expect(() => uow.create(true)).to.throw(invalidArgsError)
      expect(() => uow.create(123)).to.throw(invalidArgsError)
      expect(() => uow.create({})).to.throw(invalidArgsError)
      expect(() => uow.create([])).to.throw(invalidArgsError)
      expect(() => uow.create(() => ({}))).to.throw(invalidArgsError)
    })

    it('object changes is not an object', async () => {
      expect(() => uow.create(PERSONS_TABLE_NAME)).to.throw(invalidArgsError)
      expect(() => uow.create(PERSONS_TABLE_NAME, null)).to.throw(invalidArgsError)
      expect(() => uow.create(PERSONS_TABLE_NAME, true)).to.throw(invalidArgsError)
      expect(() => uow.create(PERSONS_TABLE_NAME, 123)).to.throw(invalidArgsError)
      expect(() => uow.create(PERSONS_TABLE_NAME, [])).to.throw(invalidArgsError)
      expect(() => uow.create(PERSONS_TABLE_NAME, () => ({}))).to.throw(invalidArgsError)
    })
  })
})
