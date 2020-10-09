import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forSuite } from '../../../helpers/sandbox'
import { prepareSuccessResponse } from '../utils'

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

  describe('bulk-update-operation', function() {

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

      const uow = Backendless.UnitOfWork.initFromJSON({
        ...commonSuiteRequestBody,
        operations: [
          {
            "___jsonclass": "com.backendless.transaction.OperationFind",
            "payload": {
              "queryOptions": {}
            },
            "opResultId": "findPerson1",
            "operationType": "FIND",
            "table": "Person"
          },
          {
            "___jsonclass": "com.backendless.transaction.OperationUpdateBulk",
            "payload": {
              "___jsonclass": "com.backendless.transaction.payload.UpdateBulkPayload",
              "conditional": null,
              "unconditional": {
                "___ref": true,
                "opResultId": "findPerson1"
              },
              "query": null,
              "changes": {
                "foo": 333
              }
            },
            "opResultId": "update_bulkPerson1",
            "operationType": "UPDATE_BULK",
            "table": "Person"
          }
        ]
      })

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
    })

    it('bulkUpdate(tableName: string, objects: object[], changes: object): OpResult', async () => {
      const results = {
        update_bulkPerson1: {
          result: {}
        }
      }

      const req1 = prepareSuccessResponse(results)

      const uow = Backendless.UnitOfWork.initFromJSON({
        ...commonSuiteRequestBody,
        operations: [
          {
            "___jsonclass": "com.backendless.transaction.OperationUpdateBulk",
            "payload": {
              "___jsonclass": "com.backendless.transaction.payload.UpdateBulkPayload",
              "conditional": null,
              "unconditional": [
                "objectId-1",
                "objectId-2"
              ],
              "query": null,
              "changes": {
                "foo": 111
              }
            },
            "opResultId": "update_bulkPerson1",
            "operationType": "UPDATE_BULK",
            "table": "Person"
          }
        ]
      })

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
    })

    it('bulkUpdate(tableName: string, whereClause: string, changes: object): OpResult', async () => {
      const results = {
        update_bulkPerson1: {
          result: {}
        }
      }

      const req1 = prepareSuccessResponse(results)

      const uow = Backendless.UnitOfWork.initFromJSON({
        ...commonSuiteRequestBody,
        operations: [
          {
            "___jsonclass": "com.backendless.transaction.OperationUpdateBulk",
            "payload": {
              "___jsonclass": "com.backendless.transaction.payload.UpdateBulkPayload",
              "conditional": "foo > 123",
              "unconditional": null,
              "query": null,
              "changes": {
                "foo": 222
              }
            },
            "opResultId": "update_bulkPerson1",
            "operationType": "UPDATE_BULK",
            "table": "Person"
          }
        ]
      })

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
    })
  })
})