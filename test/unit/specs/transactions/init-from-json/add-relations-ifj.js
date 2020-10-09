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

  describe('add-relations-operation', function() {

    const commonSuiteRequestBody = {
      opResultId   : 'add_relationPerson1',
      operationType: 'ADD_RELATION',
      table        : 'Person',
    }

    describe('3 arguments;', () => {

      describe('parent:<Create>', () => {
        let results
        let req1

        const commonRequestBody = {
          ...commonSuiteRequestBody,

          payload: {
            relationColumn: ORDER_COLUMN,
            parentObject  : {
              ___ref    : true,
              opResultId: 'createPerson1',
              propName  : 'objectId',
            }
          }
        }

        beforeEach(() => {
          results = {
            add_relationPerson1: {
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
              "___jsonclass": "com.backendless.transaction.OperationCreate",
              "payload": {
                "name": "person"
              },
              "opResultId": "createPerson1",
              "operationType": "CREATE",
              "table": "Person"
            },
            {
              "___jsonclass": "com.backendless.transaction.OperationAddRelation",
              "payload": {
                "___jsonclass": "com.backendless.transaction.payload.Relation",
                "columnUnique": false,
                "conditional": "foo > 123",
                "parentObject": {
                  "___ref": true,
                  "opResultId": "createPerson1",
                  "propName": "objectId"
                },
                "unconditional": null,
                "relationTableName": null,
                "relationColumn": "order",
                "objectIds": null
              },
              "opResultId": "add_relationPerson1",
              "operationType": "ADD_RELATION",
              "table": "Person"
            }
          ])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              conditional: 'foo > 123',
            }
          })
        })

        it('children:HashMap', async () => {
          await callUowInitFromJson([
            {
              "___jsonclass": "com.backendless.transaction.OperationCreate",
              "payload": {
                "name": "person"
              },
              "opResultId": "createPerson1",
              "operationType": "CREATE",
              "table": "Person"
            },
            {
              "___jsonclass": "com.backendless.transaction.OperationAddRelation",
              "payload": {
                "___jsonclass": "com.backendless.transaction.payload.Relation",
                "columnUnique": false,
                "conditional": null,
                "parentObject": {
                  "___ref": true,
                  "opResultId": "createPerson1",
                  "propName": "objectId"
                },
                "unconditional": [
                  "objectId-1"
                ],
                "relationTableName": null,
                "relationColumn": "order",
                "objectIds": null
              },
              "opResultId": "add_relationPerson1",
              "operationType": "ADD_RELATION",
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

        it('children:List<String>', async () => {
          await callUowInitFromJson([
            {
              "___jsonclass": "com.backendless.transaction.OperationCreate",
              "payload": {
                "name": "person"
              },
              "opResultId": "createPerson1",
              "operationType": "CREATE",
              "table": "Person"
            },
            {
              "___jsonclass": "com.backendless.transaction.OperationAddRelation",
              "payload": {
                "___jsonclass": "com.backendless.transaction.payload.Relation",
                "columnUnique": false,
                "conditional": null,
                "parentObject": {
                  "___ref": true,
                  "opResultId": "createPerson1",
                  "propName": "objectId"
                },
                "unconditional": [
                  "objectId-1"
                ],
                "relationTableName": null,
                "relationColumn": "order",
                "objectIds": null
              },
              "opResultId": "add_relationPerson1",
              "operationType": "ADD_RELATION",
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

        it('children:<Update.OpResult>', async () => {


          await callUowInitFromJson([
            {
              "___jsonclass": "com.backendless.transaction.OperationCreate",
              "payload": {
                "name": "person"
              },
              "opResultId": "createPerson1",
              "operationType": "CREATE",
              "table": "Person"
            },
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
              "___jsonclass": "com.backendless.transaction.OperationAddRelation",
              "payload": {
                "___jsonclass": "com.backendless.transaction.payload.Relation",
                "columnUnique": false,
                "conditional": null,
                "parentObject": {
                  "___ref": true,
                  "opResultId": "createPerson1",
                  "propName": "objectId"
                },
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
              "opResultId": "add_relationPerson1",
              "operationType": "ADD_RELATION",
              "table": "Person"
            }
          ])

          expect(req1.body.operations).to.have.length(3)

          expect(req1.body.operations[2]).to.deep.include({
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

      })

      describe('parent:<HashMap>', () => {
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
            add_relationPerson1: {
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
              "___jsonclass": "com.backendless.transaction.OperationAddRelation",
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
              "opResultId": "add_relationPerson1",
              "operationType": "ADD_RELATION",
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

        it('children:List<Class>', async () => {
          await callUowInitFromJson([
            {
              "___jsonclass": "com.backendless.transaction.OperationAddRelation",
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
              "opResultId": "add_relationPerson1",
              "operationType": "ADD_RELATION",
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
      })

    })

    describe('4 arguments;', () => {
      describe('parent:<ObjectId>', () => {
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
            add_relationPerson1: {
              result: {}
            }
          }

          req1 = prepareSuccessResponse(results)
        })

        async function callUowInitFromJson(data){
          const uow = Backendless.UnitOfWork.initFromJSON({
            ...commonSuiteRequestBody,
            operations: data
          })

          await uow.execute()
        }

        it('children:String', async () => {
          await callUowInitFromJson([
            {
              "___jsonclass": "com.backendless.transaction.OperationAddRelation",
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
              "opResultId": "add_relationPerson1",
              "operationType": "ADD_RELATION",
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

        it('children:List<HashMap>', async () => {
          await callUowInitFromJson([
            {
              "___jsonclass": "com.backendless.transaction.OperationAddRelation",
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
              "opResultId": "add_relationPerson1",
              "operationType": "ADD_RELATION",
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

        it('children:<BulkCreate.OpResult>', async () => {

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
              "___jsonclass": "com.backendless.transaction.OperationAddRelation",
              "payload": {
                "___jsonclass": "com.backendless.transaction.payload.Relation",
                "columnUnique": false,
                "conditional": null,
                "parentObject": "parent-objectId",
                "unconditional": {
                  "___ref": true,
                  "opResultId": "create_bulkOrder1"
                },
                "relationTableName": null,
                "relationColumn": "order",
                "objectIds": null
              },
              "opResultId": "add_relationPerson1",
              "operationType": "ADD_RELATION",
              "table": "Person"
            }
          ])

          expect(req1.body.operations).to.have.length(2)

          expect(req1.body.operations[1]).to.deep.include({
            ...commonRequestBody,
            payload: {
              ...commonRequestBody.payload,
              unconditional: {
                ___ref    : true,
                opResultId: 'create_bulkOrder1',
              },
            }
          })
        })

      })

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
            add_relationPerson1: {
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

        it('children:HashMap', async () => {
          await callUowInitFromJson([
            {
              "___jsonclass": "com.backendless.transaction.OperationAddRelation",
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
              "opResultId": "add_relationPerson1",
              "operationType": "ADD_RELATION",
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
              "___jsonclass": "com.backendless.transaction.OperationAddRelation",
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
              "opResultId": "add_relationPerson1",
              "operationType": "ADD_RELATION",
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
              "___jsonclass": "com.backendless.transaction.OperationAddRelation",
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
              "opResultId": "add_relationPerson1",
              "operationType": "ADD_RELATION",
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

      })

    })
  })
})