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

describe('<Transactions> Upsert Operation', function() {

  forSuite(this)

  let uow

  beforeEach(() => {
    uow = new Backendless.UnitOfWork()
  })

  it('upserts one map-object', async () => {
    const results = {
      upsertPerson1: {
        operationType: 'UPSERT',
        result       : {
          objectId: 'test-objectId'
        }
      }
    }

    const req1 = prepareSuccessResponse(results)

    const obj = { name: 'p-name' }

    const upsertOpResult = uow.upsert(PERSONS_TABLE_NAME, obj)

    await uow.execute()

    expect(req1.body).to.deep.include({
      operations: [
        {
          opResultId   : 'upsertPerson1',
          operationType: 'UPSERT',
          table        : 'Person',
          payload      : obj,
        }
      ]
    })

    expect(upsertOpResult.result).to.equal(upsertOpResult.getResult()).to.equal(results.upsertPerson1.result)
  })

  it('upserts one instance-object', async () => {
    const results = {
      upsertPerson1: {
        operationType: 'UPSERT',
        result       : {
          objectId: 'test-objectId'
        }
      }
    }

    const req1 = prepareSuccessResponse(results)

    const obj = new Person({ name: 'p-name' })

    const opResult = uow.upsert(obj)

    await uow.execute()

    expect(req1.body).to.deep.include({
      operations: [
        {
          opResultId   : 'upsertPerson1',
          operationType: 'UPSERT',
          table        : 'Person',
          payload      : JSON.parse(JSON.stringify(obj)),
        }
      ]
    })

    expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.upsertPerson1.result)
  })

  it('upserts several objects', async () => {
    const req1 = prepareSuccessResponse()

    const obj1 = { name: 'p-1' }
    const obj2 = { name: 'p-2' }
    const obj3 = { name: 'p-3' }

    uow.upsert(PERSONS_TABLE_NAME, obj1)
    uow.upsert(PERSONS_TABLE_NAME, obj2)
    uow.upsert(PERSONS_TABLE_NAME, obj3)

    await uow.execute()

    expect(req1.body).to.deep.include({
      operations: [
        {
          opResultId   : 'upsertPerson1',
          operationType: 'UPSERT',
          payload      : obj1,
          table        : 'Person',
        },
        {
          opResultId   : 'upsertPerson2',
          operationType: 'UPSERT',
          payload      : obj2,
          table        : 'Person',
        },
        {
          opResultId   : 'upsertPerson3',
          operationType: 'UPSERT',
          payload      : obj3,
          table        : 'Person',
        }
      ]
    })

  })

  describe('Signatures', () => {

    it('upsert(object: object): OpResult', async () => {
      const results = {
        upsertPerson1: {
          operationType: 'UPSERT',
          result       : {
            objectId: 'test-objectId'
          }
        },
        upsertPerson2: {
          operationType: 'UPSERT',
          result       : {
            objectId: 'test-objectId'
          }
        }
      }

      const req1 = prepareSuccessResponse(results)

      const obj1 = { ___class: PERSONS_TABLE_NAME, name: 'p-name' }
      const obj2 = new Person({ name: 'p-name' })

      const opResult1 = uow.upsert(obj1)
      const opResult2 = uow.upsert(obj2)

      await uow.execute()

      expect(req1.body).to.deep.include({
        operations: [
          {
            opResultId   : 'upsertPerson1',
            operationType: 'UPSERT',
            table        : 'Person',
            payload      : obj1,
          },
          {
            opResultId   : 'upsertPerson2',
            operationType: 'UPSERT',
            table        : 'Person',
            payload      : obj2,
          }
        ]
      })

      expect(opResult1.result).to.equal(opResult1.getResult()).to.equal(results.upsertPerson1.result)
      expect(opResult2.result).to.equal(opResult2.getResult()).to.equal(results.upsertPerson2.result)
    })

    it('upsert(tableName: string, object: object): OpResult', async () => {
      const results = {
        upsertPerson1: {
          operationType: 'UPSERT',
          result       : {
            objectId: 'test-objectId'
          }
        },
        upsertPerson2: {
          operationType: 'UPSERT',
          result       : {
            objectId: 'test-objectId'
          }
        }
      }

      const req1 = prepareSuccessResponse(results)

      const obj1 = { name: 'p-name' }
      const obj2 = new Person({ name: 'p-name' })

      const opResult1 = uow.upsert(PERSONS_TABLE_NAME, obj1)
      const opResult2 = uow.upsert(PERSONS_TABLE_NAME, obj2)

      await uow.execute()

      expect(req1.body).to.deep.include({
        operations: [
          {
            opResultId   : 'upsertPerson1',
            operationType: 'UPSERT',
            table        : 'Person',
            payload      : obj1,
          },
          {
            opResultId   : 'upsertPerson2',
            operationType: 'UPSERT',
            table        : 'Person',
            payload      : obj2,
          }
        ]
      })

      expect(opResult1.result).to.equal(opResult1.getResult()).to.equal(results.upsertPerson1.result)
      expect(opResult2.result).to.equal(opResult2.getResult()).to.equal(results.upsertPerson2.result)
    })
  })

  describe('Fails', () => {
    const invalidArgsError = 'Invalid arguments'

    it('has invalid parameters count', async () => {
      expect(() => uow.upsert('tableName', {}, {})).to.throw(invalidArgsError)
    })

    it('table name is not a string', async () => {
      expect(() => uow.upsert()).to.throw(invalidArgsError)
      expect(() => uow.upsert(null)).to.throw(invalidArgsError)
      expect(() => uow.upsert(true)).to.throw(invalidArgsError)
      expect(() => uow.upsert(123)).to.throw(invalidArgsError)
      expect(() => uow.upsert({})).to.throw(invalidArgsError)
      expect(() => uow.upsert([])).to.throw(invalidArgsError)
      expect(() => uow.upsert(() => ({}))).to.throw(invalidArgsError)
    })

    it('object changes is not an object', async () => {
      expect(() => uow.upsert(PERSONS_TABLE_NAME)).to.throw(invalidArgsError)
      expect(() => uow.upsert(PERSONS_TABLE_NAME, null)).to.throw(invalidArgsError)
      expect(() => uow.upsert(PERSONS_TABLE_NAME, true)).to.throw(invalidArgsError)
      expect(() => uow.upsert(PERSONS_TABLE_NAME, 123)).to.throw(invalidArgsError)
      expect(() => uow.upsert(PERSONS_TABLE_NAME, [])).to.throw(invalidArgsError)
      expect(() => uow.upsert(PERSONS_TABLE_NAME, () => ({}))).to.throw(invalidArgsError)
    })
  })
})
