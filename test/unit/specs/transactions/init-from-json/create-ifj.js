import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forSuite } from '../../../helpers/sandbox'
import { prepareSuccessResponse } from '../utils'

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

describe('<Transactions> Init from JSON', function() {

  forSuite(this)

  const commonSuiteRequestBody = {
    ___jsonclass        : 'com.backendless.transaction.UnitOfWork',
    OP_RESULT_ID        : 'opResultId',
    opResultIdStrings   : [],
    transactionIsolation: 'REPEATABLE_READ',
    PROP_NAME           : 'propName',
    REFERENCE_MARKER    : '___ref',
    opResultIdMaps      : {},
    RESULT_INDEX        : 'resultIndex'
  }

  describe('create-operation', function() {

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

      const obj = {
        name: 'bob'
      }

      const uow = Backendless.UnitOfWork.initFromJSON({
        ...commonSuiteRequestBody,
        operations: [
          {
            payload      : obj,
            opResultId   : 'createPerson1',
            operationType: 'CREATE',
            table        : 'Person'
          }
        ]
      })

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
    })

    it('creates instance-object', async () => {
      const results = {
        createPerson1: {
          operationType: 'CREATE',
          result       : {
            objectId: 'test-objectId'
          }
        }
      }

      const obj = new Person({ name: 'bob' })

      const req = prepareSuccessResponse(results)

      const uow = Backendless.UnitOfWork.initFromJSON({
        ...commonSuiteRequestBody,
        operations: [
          {
            payload      : obj,
            opResultId   : 'createPerson1',
            operationType: 'CREATE',
            table        : 'Person'
          }
        ]
      })

      await uow.execute()

      expect(req.body).to.deep.include({
        operations: [
          {
            opResultId   : 'createPerson1',
            operationType: 'CREATE',
            table        : 'Person',
            payload      : JSON.parse(JSON.stringify(obj)),
          }
        ]
      })
    })

    describe('Signatures', () => {

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

        const uow = Backendless.UnitOfWork.initFromJSON({
          ...commonSuiteRequestBody,
          operations: [
            {
              "___jsonclass": "com.backendless.transaction.OperationCreate",
              "payload": {
                "name": "p-name"
              },
              "opResultId": "createPerson1",
              "operationType": "CREATE",
              "table": "Person"
            },
            {
              "___jsonclass": "com.backendless.transaction.OperationCreate",
              "payload": {
                "name": "p-name"
              },
              "opResultId": "createPerson2",
              "operationType": "CREATE",
              "table": "Person"
            }
          ]
        })

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
      })
    })
  })
})