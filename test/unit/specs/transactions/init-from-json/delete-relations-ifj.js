import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forSuite } from '../../../helpers/sandbox'
import { prepareSuccessResponse } from '../utils'

const ORDER_COLUMN = 'order'

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

  describe('delete-relations-operation', function() {
    forSuite(this)

    const commonSuiteRequestBody = {
      opResultId   : 'delete_relationPerson1',
      operationType: 'DELETE_RELATION',
      table        : 'Person',
    }

    describe('Signatures', () => {
      describe('3 arguments;', () => {

        describe('parent:<Class>', () => {
          let results
          let req1

          const commonRequestBody = {
            ...commonSuiteRequestBody,

            payload: {
              relationColumn: ORDER_COLUMN,
              parentObject  : 'parent-objectId',
            }
          }

          beforeEach(() => {
            results = {
              delete_relationPerson1: {
                result: {}
              }
            }

            req1 = prepareSuccessResponse(results)
          })

          async function callUowInitFromJson(data) {
            const uow = Backendless.UnitOfWork.initFromJSON({
              ...commonSuiteRequestBody,
              operations: data
            })

            await uow.execute()
          }

          it('children:String', async () => {
            await callUowInitFromJson([
              {
                "___jsonclass": "com.backendless.transaction.OperationDeleteRelation",
                "payload": {
                  "___jsonclass": "com.backendless.transaction.payload.Relation",
                  "columnUnique": false,
                  "conditional": "foo > 123",
                  "parentObject": "parent-objectId",
                  "unconditional": null,
                  "relationTableName": null,
                  "relationColumn": "order",
                  "objectIds": null
                },
                "opResultId": "delete_relationPerson1",
                "operationType": "DELETE_RELATION",
                "table": "Person"
              }
            ])

            expect(req1.body.operations).to.have.length(1)

            expect(req1.body.operations[0]).to.deep.include({
              ...commonRequestBody,
              payload: {
                ...commonRequestBody.payload,
                conditional: 'foo > 123',
              }
            })
          })

          it('children:List<Update.OpResult>', async () => {

            await callUowInitFromJson([
              {
                "___jsonclass": "com.backendless.transaction.OperationUpdate",
                "payload": {
                  "objectId": "objectId-1",
                  "label": "person-2"
                },
                "opResultId": "updateOrder1",
                "operationType": "UPDATE",
                "table": "Order"
              },
              {
                "___jsonclass": "com.backendless.transaction.OperationDeleteRelation",
                "payload": {
                  "___jsonclass": "com.backendless.transaction.payload.Relation",
                  "columnUnique": false,
                  "conditional": null,
                  "parentObject": "parent-objectId",
                  "unconditional": [
                    {
                      "___ref": true,
                      "opResultId": "updateOrder1",
                      "propName": "objectId"
                    }
                  ],
                  "relationTableName": null,
                  "relationColumn": "order",
                  "objectIds": null
                },
                "opResultId": "delete_relationPerson1",
                "operationType": "DELETE_RELATION",
                "table": "Person"
              }
            ])

            expect(req1.body.operations).to.have.length(2)

            expect(req1.body.operations[1]).to.deep.include({
              ...commonRequestBody,
              payload: {
                ...commonRequestBody.payload,
                unconditional: [{
                  ___ref    : true,
                  opResultId: 'updateOrder1',
                  propName  : 'objectId',
                }],
              }
            })
          })

          it('children:List<Class>', async () => {
            await callUowInitFromJson([
              {
                "___jsonclass": "com.backendless.transaction.OperationDeleteRelation",
                "payload": {
                  "___jsonclass": "com.backendless.transaction.payload.Relation",
                  "columnUnique": false,
                  "conditional": null,
                  "parentObject": "parent-objectId",
                  "unconditional": [
                    "objectId-1"
                  ],
                  "relationTableName": null,
                  "relationColumn": "order",
                  "objectIds": null
                },
                "opResultId": "delete_relationPerson1",
                "operationType": "DELETE_RELATION",
                "table": "Person"
              }
            ])

            expect(req1.body.operations).to.have.length(1)

            expect(req1.body.operations[0]).to.deep.include({
              ...commonRequestBody,
              payload: {
                ...commonRequestBody.payload,
                unconditional: ['objectId-1'],
              }
            })
          })

          it('children:<Find.OpResultValue>', async () => {

            await callUowInitFromJson([
              {
                "___jsonclass": "com.backendless.transaction.OperationFind",
                "payload": {
                  "queryOptions": {}
                },
                "opResultId": "findOrder1",
                "operationType": "FIND",
                "table": "Order"
              },
              {
                "___jsonclass": "com.backendless.transaction.OperationDeleteRelation",
                "payload": {
                  "___jsonclass": "com.backendless.transaction.payload.Relation",
                  "columnUnique": false,
                  "conditional": null,
                  "parentObject": "parent-objectId",
                  "unconditional": [
                    {
                      "___ref": true,
                      "opResultId": "findOrder1",
                      "resultIndex": 3,
                      "propName": "objectId"
                    }
                  ],
                  "relationTableName": null,
                  "relationColumn": "order",
                  "objectIds": null
                },
                "opResultId": "delete_relationPerson1",
                "operationType": "DELETE_RELATION",
                "table": "Person"
              }
            ])

            expect(req1.body.operations).to.have.length(2)

            expect(req1.body.operations[1]).to.deep.include({
              ...commonRequestBody,
              payload: {
                ...commonRequestBody.payload,
                unconditional: [{
                  ___ref     : true,
                  opResultId : 'findOrder1',
                  propName   : 'objectId',
                  resultIndex: 3,
                }],
              }
            })
          })

          it('children:<BulkCreate.OpResultValue>', async () => {

            await callUowInitFromJson([
              {
                "___jsonclass": "com.backendless.transaction.OperationCreateBulk",
                "payload": [
                  {}
                ],
                "opResultId": "create_bulkOrder1",
                "operationType": "CREATE_BULK",
                "table": "Order"
              },
              {
                "___jsonclass": "com.backendless.transaction.OperationDeleteRelation",
                "payload": {
                  "___jsonclass": "com.backendless.transaction.payload.Relation",
                  "columnUnique": false,
                  "conditional": null,
                  "parentObject": "parent-objectId",
                  "unconditional": [
                    {
                      "___ref": true,
                      "opResultId": "create_bulkOrder1",
                      "resultIndex": 3
                    }
                  ],
                  "relationTableName": null,
                  "relationColumn": "order",
                  "objectIds": null
                },
                "opResultId": "delete_relationPerson1",
                "operationType": "DELETE_RELATION",
                "table": "Person"
              }
            ])

            expect(req1.body.operations).to.have.length(2)

            expect(req1.body.operations[1]).to.deep.include({
              ...commonRequestBody,
              payload: {
                ...commonRequestBody.payload,
                unconditional: [{
                  ___ref     : true,
                  opResultId : 'create_bulkOrder1',
                  resultIndex: 3,
                }],
              }
            })
          })
        })

        describe('parent:<BulkCreate.OpResultValue>', () => {
          let results
          let req1

          const commonRequestBody = {
            ...commonSuiteRequestBody,

            payload: {
              relationColumn: ORDER_COLUMN,
              parentObject  : {
                ___ref     : true,
                opResultId : 'create_bulkPerson1',
                resultIndex: 3,
              }
            }
          }

          beforeEach(() => {
            results = {
              delete_relationPerson1: {
                result: {}
              }
            }

            req1 = prepareSuccessResponse(results)

          })

          async function callUowInitFromJson(data) {
            const uow = Backendless.UnitOfWork.initFromJSON({
              ...commonSuiteRequestBody,
              operations: data
            })

            await uow.execute()
          }

          it('children:List<Class>', async () => {
            await callUowInitFromJson([
              {
                "___jsonclass": "com.backendless.transaction.OperationCreateBulk",
                "payload": [
                  {}
                ],
                "opResultId": "create_bulkPerson1",
                "operationType": "CREATE_BULK",
                "table": "Person"
              },
              {
                "___jsonclass": "com.backendless.transaction.OperationDeleteRelation",
                "payload": {
                  "___jsonclass": "com.backendless.transaction.payload.Relation",
                  "columnUnique": false,
                  "conditional": null,
                  "parentObject": {
                    "___ref": true,
                    "opResultId": "create_bulkPerson1",
                    "resultIndex": 3
                  },
                  "unconditional": [
                    "objectId-1"
                  ],
                  "relationTableName": null,
                  "relationColumn": "order",
                  "objectIds": null
                },
                "opResultId": "delete_relationPerson1",
                "operationType": "DELETE_RELATION",
                "table": "Person"
              }
            ])

            expect(req1.body.operations).to.have.length(2)

            expect(req1.body.operations[1]).to.deep.include({
              ...commonRequestBody,
              payload: {
                ...commonRequestBody.payload,
                unconditional: ['objectId-1'],
              }
            })
          })

          it('children:List<BulkCreate.OpResultValue>', async () => {

            await callUowInitFromJson([
              {
                "___jsonclass": "com.backendless.transaction.OperationCreateBulk",
                "payload": [
                  {}
                ],
                "opResultId": "create_bulkPerson1",
                "operationType": "CREATE_BULK",
                "table": "Person"
              },
              {
                "___jsonclass": "com.backendless.transaction.OperationCreateBulk",
                "payload": [
                  {}
                ],
                "opResultId": "create_bulkOrder1",
                "operationType": "CREATE_BULK",
                "table": "Order"
              },
              {
                "___jsonclass": "com.backendless.transaction.OperationDeleteRelation",
                "payload": {
                  "___jsonclass": "com.backendless.transaction.payload.Relation",
                  "columnUnique": false,
                  "conditional": null,
                  "parentObject": {
                    "___ref": true,
                    "opResultId": "create_bulkPerson1",
                    "resultIndex": 3
                  },
                  "unconditional": [
                    {
                      "___ref": true,
                      "opResultId": "create_bulkOrder1",
                      "resultIndex": 3
                    }
                  ],
                  "relationTableName": null,
                  "relationColumn": "order",
                  "objectIds": null
                },
                "opResultId": "delete_relationPerson1",
                "operationType": "DELETE_RELATION",
                "table": "Person"
              }
            ])

            expect(req1.body.operations).to.have.length(3)

            expect(req1.body.operations[2]).to.deep.include({
              ...commonRequestBody,
              payload: {
                ...commonRequestBody.payload,
                unconditional: [{
                  ___ref     : true,
                  opResultId : 'create_bulkOrder1',
                  resultIndex: 3,
                }],
              }
            })
          })

          it('children:<Find.OpResult>', async () => {

            await callUowInitFromJson([
              {
                "___jsonclass": "com.backendless.transaction.OperationCreateBulk",
                "payload": [
                  {}
                ],
                "opResultId": "create_bulkPerson1",
                "operationType": "CREATE_BULK",
                "table": "Person"
              },
              {
                "___jsonclass": "com.backendless.transaction.OperationFind",
                "payload": {
                  "queryOptions": {}
                },
                "opResultId": "findOrder1",
                "operationType": "FIND",
                "table": "Order"
              },
              {
                "___jsonclass": "com.backendless.transaction.OperationDeleteRelation",
                "payload": {
                  "___jsonclass": "com.backendless.transaction.payload.Relation",
                  "columnUnique": false,
                  "conditional": null,
                  "parentObject": {
                    "___ref": true,
                    "opResultId": "create_bulkPerson1",
                    "resultIndex": 3
                  },
                  "unconditional": {
                    "___ref": true,
                    "opResultId": "findOrder1"
                  },
                  "relationTableName": null,
                  "relationColumn": "order",
                  "objectIds": null
                },
                "opResultId": "delete_relationPerson1",
                "operationType": "DELETE_RELATION",
                "table": "Person"
              }
            ])

            expect(req1.body.operations).to.have.length(3)

            expect(req1.body.operations[2]).to.deep.include({
              ...commonRequestBody,
              payload: {
                ...commonRequestBody.payload,
                unconditional: {
                  ___ref    : true,
                  opResultId: 'findOrder1',
                },
              }
            })
          })
        })

      })
    })
  })
})