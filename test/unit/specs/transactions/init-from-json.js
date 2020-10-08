import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forSuite } from '../../helpers/sandbox'
import { prepareSuccessResponse } from './utils'

const ORDER_COLUMN = 'order'

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

  describe('basic', function() {

    it('has correct request data', async () => {
      const uow = Backendless.UnitOfWork.initFromJSON({
          ...commonSuiteRequestBody,
          'operations': [
            {
              '___jsonclass' : 'com.backendless.transaction.OperationCreate',
              'payload'      : {},
              'opResultId'   : 'createPerson1',
              'operationType': 'CREATE',
              'table'        : 'Person'
            }
          ]
        }
      )

      const req1 = prepareSuccessResponse()

      await uow.execute()

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/transaction/unit-of-work`,
        headers: { 'Content-Type': 'application/json' },
      })
    })

    it('returns UnitOfWorkResult', async () => {
      const results = {
        createPerson1: {
          operationType: 'CREATE',
          result       : {
            objectId: 'objectId'
          }
        }
      }

      prepareSuccessResponse(results)

      const uow = Backendless.UnitOfWork.initFromJSON({
          ...commonSuiteRequestBody,
          operations: [
            {
              "___jsonclass": "com.backendless.transaction.OperationFind",
              "payload": {
                "queryOptions": {
                  "related": [
                    "rel1",
                    "rel2",
                    "rel3"
                  ],
                  "relationsDepth": 3,
                  "relationsPageSize": 25
                },
                "pageSize": 50,
                "offset": 15,
                "properties": [
                  "foo",
                  "bar",
                  "prop1",
                  "prop2",
                  "prop3",
                  "prop4",
                  "prop5",
                  "prop6",
                  "prop7",
                  "prop8",
                  "prop9",
                  "*"
                ],
                "excludeProps": [
                  "ex-foo",
                  "ex-bar",
                  "ex-prop1",
                  "ex-prop2",
                  "ex-prop3",
                  "ex-prop4",
                  "ex-prop5",
                  "ex-prop6",
                  "ex-prop7",
                  "ex-prop8"
                ],
                "whereClause": "age >= 100",
                "havingClause": "age >= 200"
              },
              "opResultId": "findPerson1",
              "operationType": "FIND",
              "table": "Person"
            }
          ]
        }
      )

      const uowResult = await uow.execute()

      expect(uowResult.error).to.equal(uowResult.getError()).to.equal(null)
      expect(uowResult.success).to.equal(uowResult.isSuccess()).to.equal(true)
      expect(uowResult.results).to.equal(uowResult.getResults()).to.equal(results)
    })
  })

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

  describe('update-operation', function() {

    it('creates object and updates using OpResult and propertyName', async () => {
      const results = {
        createPerson1: {
          operationType: 'CREATE',
          result       : { name: 'p-1', age: 777 }
        },
        updatePerson1: {
          operationType: 'UPDATE',
          result       : { name: 'p-1', age: 123 }
        }
      }

      const req1 = prepareSuccessResponse(results)

      const uow = Backendless.UnitOfWork.initFromJSON({
        ...commonSuiteRequestBody,
        operations: [
          {
            "___jsonclass": "com.backendless.transaction.OperationCreate",
            "payload": {
              "name": "p-1",
              "age": 777
            },
            "opResultId": "createPerson1",
            "operationType": "CREATE",
            "table": "Person"
          },
          {
            "___jsonclass": "com.backendless.transaction.OperationUpdate",
            "payload": {
              "objectId": {
                "___ref": true,
                "opResultId": "createPerson1",
                "propName": "objectId"
              },
              "age": 123
            },
            "opResultId": "updatePerson1",
            "operationType": "UPDATE",
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
            payload      : {
              age : 777,
              name: 'p-1'
            }
          },
          {
            opResultId   : 'updatePerson1',
            operationType: 'UPDATE',
            table        : 'Person',
            payload      : {
              age     : 123,
              objectId: {
                ___ref    : true,
                opResultId: 'createPerson1',
                propName  : 'objectId',
              }
            }
          }
        ]
      })
    })

    it('updates one map-object', async () => {
      const obj = { objectId: 'test-objectId', name: 'p-name' }

      const results = {
        updatePerson1: {
          operationType: 'UPDATE',
          result       : obj
        }
      }

      const req1 = prepareSuccessResponse(results)

      const uow = Backendless.UnitOfWork.initFromJSON({
        ...commonSuiteRequestBody,
        operations: [
          {
            "___jsonclass": "com.backendless.transaction.OperationUpdate",
            "payload": {
              "objectId": "test-objectId",
              "name": "p-name"
            },
            "opResultId": "updatePerson1",
            "operationType": "UPDATE",
            "table": "Person"
          }
        ]
      })

      await uow.execute()

      expect(req1.body).to.deep.include({
        operations: [
          {
            opResultId   : 'updatePerson1',
            operationType: 'UPDATE',
            table        : 'Person',
            payload      : obj,
          }
        ]
      })
    })

    it('updates several objects', async () => {
      const obj1 = { objectId: 'test-objectId-1', name: 'p-1' }
      const obj2 = { objectId: 'test-objectId-2', name: 'p-2' }
      const obj3 = { objectId: 'test-objectId-3', name: 'p-3' }

      const results = {
        updatePerson1: {
          operationType: 'UPDATE',
          result       : obj1
        },
        updatePerson2: {
          operationType: 'UPDATE',
          result       : obj2
        },
        updatePerson3: {
          operationType: 'UPDATE',
          result       : obj3
        }
      }

      const req1 = prepareSuccessResponse(results)

      const uow = Backendless.UnitOfWork.initFromJSON({
        ...commonSuiteRequestBody,
        operations: [
          {
            "___jsonclass": "com.backendless.transaction.OperationUpdate",
            "payload": {
              "objectId": "test-objectId-1",
              "name": "p-1"
            },
            "opResultId": "updatePerson1",
            "operationType": "UPDATE",
            "table": "Person"
          },
          {
            "___jsonclass": "com.backendless.transaction.OperationUpdate",
            "payload": {
              "objectId": "test-objectId-2",
              "name": "p-2"
            },
            "opResultId": "updatePerson2",
            "operationType": "UPDATE",
            "table": "Person"
          },
          {
            "___jsonclass": "com.backendless.transaction.OperationUpdate",
            "payload": {
              "objectId": "test-objectId-3",
              "name": "p-3"
            },
            "opResultId": "updatePerson3",
            "operationType": "UPDATE",
            "table": "Person"
          }
        ]
      })

      await uow.execute()

      expect(req1.body).to.deep.include({
        operations: [
          {
            opResultId   : 'updatePerson1',
            operationType: 'UPDATE',
            table        : 'Person',
            payload      : obj1,
          },
          {
            opResultId   : 'updatePerson2',
            operationType: 'UPDATE',
            table        : 'Person',
            payload      : obj2,
          },
          {
            opResultId   : 'updatePerson3',
            operationType: 'UPDATE',
            table        : 'Person',
            payload      : obj3,
          }
        ]
      })
    })

    it('creates object and updates using OpResult and changes object', async () => {
      const results = {
        createPerson1: {
          operationType: 'CREATE',
          result       : { name: 'p-1', age: 777 }
        },
        updatePerson1: {
          operationType: 'UPDATE',
          result       : { name: 'p-1', age: 123 }
        }
      }

      const req1 = prepareSuccessResponse(results)

      const uow = Backendless.UnitOfWork.initFromJSON({
        ...commonSuiteRequestBody,
        operations: [
          {
            "___jsonclass": "com.backendless.transaction.OperationCreate",
            "payload": {
              "name": "p-1",
              "age": 777
            },
            "opResultId": "createPerson1",
            "operationType": "CREATE",
            "table": "Person"
          },
          {
            "___jsonclass": "com.backendless.transaction.OperationUpdate",
            "payload": {
              "objectId": {
                "___ref": true,
                "opResultId": "createPerson1",
                "propName": "objectId"
              },
              "age": 123
            },
            "opResultId": "updatePerson1",
            "operationType": "UPDATE",
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
            payload      : {
              age : 777,
              name: 'p-1'
            }
          },
          {
            opResultId   : 'updatePerson1',
            operationType: 'UPDATE',
            table        : 'Person',
            payload      : {
              age     : 123,
              objectId: {
                ___ref    : true,
                opResultId: 'createPerson1',
                propName  : 'objectId',
              }
            }
          }
        ]
      })
    })

    describe('Signatures', () => {

      it('update(opResult: OpResult | OpResultValueReference, propertyName: string, propertyValue: OpResultValueReference): OpResult', async () => {
        const results = {
          findPerson1  : {
            operationType: 'FIND',
            result       : []
          },
          createPerson1: {
            operationType: 'CREATE',
            result       : {}
          },
          updatePerson1: {
            operationType: 'UPDATE',
            result       : {}
          },
          updatePerson2: {
            operationType: 'UPDATE',
            result       : {}
          },
          updatePerson3: {
            operationType: 'UPDATE',
            result       : {}
          },
          updatePerson4: {
            operationType: 'UPDATE',
            result       : {}
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
              "___jsonclass": "com.backendless.transaction.OperationCreate",
              "payload": {
                "name": "p-1",
                "age": 777
              },
              "opResultId": "createPerson1",
              "operationType": "CREATE",
              "table": "Person"
            },
            {
              "___jsonclass": "com.backendless.transaction.OperationUpdate",
              "payload": {
                "objectId": {
                  "___ref": true,
                  "opResultId": "findPerson1",
                  "resultIndex": 1,
                  "propName": "objectId"
                },
                "age": 111
              },
              "opResultId": "updatePerson1",
              "operationType": "UPDATE",
              "table": "Person"
            },
            {
              "___jsonclass": "com.backendless.transaction.OperationUpdate",
              "payload": {
                "objectId": {
                  "___ref": true,
                  "opResultId": "createPerson1",
                  "propName": "objectId"
                },
                "age": 222
              },
              "opResultId": "updatePerson2",
              "operationType": "UPDATE",
              "table": "Person"
            },
            {
              "___jsonclass": "com.backendless.transaction.OperationUpdate",
              "payload": {
                "objectId": {
                  "___ref": true,
                  "opResultId": "createPerson1",
                  "propName": "objectId"
                },
                "sub": {
                  "___ref": true,
                  "opResultId": "findPerson1",
                  "resultIndex": 1,
                  "propName": "subProp"
                }
              },
              "opResultId": "updatePerson3",
              "operationType": "UPDATE",
              "table": "Person"
            },
            {
              "___jsonclass": "com.backendless.transaction.OperationUpdate",
              "payload": {
                "objectId": {
                  "___ref": true,
                  "opResultId": "createPerson1",
                  "propName": "objectId"
                },
                "sub2": {
                  "___ref": true,
                  "opResultId": "createPerson1",
                  "propName": "subProp2"
                }
              },
              "opResultId": "updatePerson4",
              "operationType": "UPDATE",
              "table": "Person"
            }
          ]
        })

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
              opResultId   : 'updatePerson1',
              operationType: 'UPDATE',
              table        : 'Person',
              payload      : {
                age     : 111,
                objectId: {
                  ___ref     : true,
                  opResultId : 'findPerson1',
                  propName   : 'objectId',
                  resultIndex: 1,
                }
              },
            },
            {
              opResultId   : 'updatePerson2',
              operationType: 'UPDATE',
              table        : 'Person',
              payload      : {
                age     : 222,
                objectId: {
                  ___ref    : true,
                  opResultId: 'createPerson1',
                  propName  : 'objectId',
                }
              }
            },
            {
              opResultId   : 'updatePerson3',
              operationType: 'UPDATE',
              table        : 'Person',
              payload      : {
                objectId: {
                  ___ref    : true,
                  opResultId: 'createPerson1',
                  propName  : 'objectId',
                },
                sub     : {
                  ___ref     : true,
                  opResultId : 'findPerson1',
                  propName   : 'subProp',
                  resultIndex: 1,
                }
              }
            },
            {
              opResultId   : 'updatePerson4',
              operationType: 'UPDATE',
              table        : 'Person',
              payload      : {
                objectId: {
                  ___ref    : true,
                  opResultId: 'createPerson1',
                  propName  : 'objectId',
                },
                sub2    : {
                  ___ref    : true,
                  opResultId: 'createPerson1',
                  propName  : 'subProp2',
                }
              }
            }
          ]
        })
      })
    })
  })

  describe('find-operation', function() {
    let query

    beforeEach(() => {
      query = Backendless.Data.QueryBuilder.create()
    })

    it('default options', async () => {
      const results = {
        findPerson1: {
          operationType: 'FIND',
          result       : []
        }
      }

      const req1 = prepareSuccessResponse(results)

      const uow = Backendless.UnitOfWork.initFromJSON({
        ...commonSuiteRequestBody,
        operations: [
          {
            "___jsonclass": "com.backendless.transaction.OperationFind",
            "payload": {
              "queryOptions": {},
              "pageSize": 10
            },
            "opResultId": "findPerson1",
            "operationType": "FIND",
            "table": "Person"
          }
        ]
      })

      await uow.execute()

      expect(req1.body).to.deep.include({
        operations: [
          {
            opResultId   : 'findPerson1',
            operationType: 'FIND',
            table        : 'Person',
            payload      : {
              pageSize    : 10,
              queryOptions: {},
            },
          }
        ]
      })
    })

    it('gets query from plain object', async () => {
      const results = {
        findPerson1: {
          operationType: 'FIND',
          result       : []
        }
      }

      const req1 = prepareSuccessResponse(results)

      const uow = Backendless.UnitOfWork.initFromJSON({
        ...commonSuiteRequestBody,
        operations: [
          {
            "___jsonclass": "com.backendless.transaction.OperationFind",
            "payload": {
              "queryOptions": {
                "related": [
                  "rel1",
                  "rel2",
                  "rel3"
                ],
                "relationsDepth": 3,
                "relationsPageSize": 25
              },
              "pageSize": 50,
              "offset": 15,
              "properties": [
                "foo",
                "bar",
                "prop1",
                "prop2",
                "prop3",
                "prop4",
                "prop5",
                "prop6",
                "prop7",
                "prop8",
                "prop9",
                "*"
              ],
              "excludeProps": [
                "ex-foo",
                "ex-bar",
                "ex-prop1",
                "ex-prop2",
                "ex-prop3",
                "ex-prop4",
                "ex-prop5",
                "ex-prop6",
                "ex-prop7",
                "ex-prop8"
              ],
              "whereClause": "age >= 100",
              "havingClause": "age >= 200"
            },
            "opResultId": "findPerson1",
            "operationType": "FIND",
            "table": "Person"
          }
        ]
      })

      await uow.execute()

      expect(req1.body).to.deep.include({
        operations: [
          {
            opResultId   : 'findPerson1',
            operationType: 'FIND',
            table        : 'Person',
            payload      : {
              pageSize    : 50,
              offset      : 15,
              properties  : ['foo', 'bar', 'prop1', 'prop2', 'prop3', 'prop4', 'prop5', 'prop6', 'prop7', 'prop8', 'prop9', '*'],
              excludeProps: ['ex-foo', 'ex-bar', 'ex-prop1', 'ex-prop2', 'ex-prop3', 'ex-prop4', 'ex-prop5', 'ex-prop6', 'ex-prop7', 'ex-prop8',],
              whereClause : 'age >= 100',
              havingClause: 'age >= 200',
              queryOptions: {
                related          : ['rel1', 'rel2', 'rel3'],
                relationsDepth   : 3,
                relationsPageSize: 25
              },
            },
          }
        ]
      })
    })

    describe('Search', () => {

      it('basic find with whereClause and havingClause', async () => {
        query
          .setWhereClause('age >= 100')
          .setHavingClause('age >= 200')

        const results = {
          findPerson1: {
            operationType: 'FIND',
            result       : []
          }
        }

        const req1 = prepareSuccessResponse(results)

        const uow = Backendless.UnitOfWork.initFromJSON({
          ...commonSuiteRequestBody,
          operations: [
            {
              "___jsonclass": "com.backendless.transaction.OperationFind",
              "payload": {
                "queryOptions": {},
                "pageSize": 10,
                "whereClause": "age >= 100",
                "havingClause": "age >= 200"
              },
              "opResultId": "findPerson1",
              "operationType": "FIND",
              "table": "Person"
            }
          ]
        })

        await uow.execute()

        expect(req1.body).to.deep.include({
          operations: [
            {
              opResultId   : 'findPerson1',
              operationType: 'FIND',
              table        : 'Person',
              payload      : {
                pageSize    : 10,
                queryOptions: {},
                whereClause : 'age >= 100',
                havingClause: 'age >= 200',
              },
            }
          ]
        })
      })
    })
  })

  describe('delete-operation', function() {

    it('deletes one map-object', async () => {
      const obj = { objectId: 'test-objectId', name: 'p-name' }

      const results = {
        deletePerson1: {
          operationType: 'DELETE',
          result       : obj
        }
      }

      const req1 = prepareSuccessResponse(results)

      const uow = Backendless.UnitOfWork.initFromJSON({
        ...commonSuiteRequestBody,
        operations: [
          {
            "___jsonclass": "com.backendless.transaction.OperationDelete",
            "payload": "test-objectId",
            "opResultId": "deletePerson1",
            "operationType": "DELETE",
            "table": "Person"
          }
        ]
      })

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

      const uow = Backendless.UnitOfWork.initFromJSON({
        ...commonSuiteRequestBody,
        operations: [
          {
            "___jsonclass": "com.backendless.transaction.OperationDelete",
            "payload": "test-objectId-1",
            "opResultId": "deletePerson1",
            "operationType": "DELETE",
            "table": "Person"
          },
          {
            "___jsonclass": "com.backendless.transaction.OperationDelete",
            "payload": "test-objectId-2",
            "opResultId": "deletePerson2",
            "operationType": "DELETE",
            "table": "Person"
          },
          {
            "___jsonclass": "com.backendless.transaction.OperationDelete",
            "payload": "test-objectId-3",
            "opResultId": "deletePerson3",
            "operationType": "DELETE",
            "table": "Person"
          }
        ]
      })

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
    })

    describe('Signatures', () => {

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

        const uow = Backendless.UnitOfWork.initFromJSON({
          ...commonSuiteRequestBody,
          operations: [
            {
              "___jsonclass": "com.backendless.transaction.OperationDelete",
              "payload": "test-objectId",
              "opResultId": "deletePerson1",
              "operationType": "DELETE",
              "table": "Person"
            },
            {
              "___jsonclass": "com.backendless.transaction.OperationDelete",
              "payload": "test-objectId",
              "opResultId": "deletePerson2",
              "operationType": "DELETE",
              "table": "Person"
            }
          ]
        })

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
      })

      it('delete(opResult: OpResult | OpResultValueReference): OpResult', async () => {
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
              "___jsonclass": "com.backendless.transaction.OperationCreate",
              "payload": {
                "name": "p-1",
                "age": 777
              },
              "opResultId": "createPerson1",
              "operationType": "CREATE",
              "table": "Person"
            },
            {
              "___jsonclass": "com.backendless.transaction.OperationDelete",
              "payload": {
                "___ref": true,
                "opResultId": "findPerson1",
                "resultIndex": 1,
                "propName": "objectId"
              },
              "opResultId": "deletePerson1",
              "operationType": "DELETE",
              "table": "Person"
            },
            {
              "___jsonclass": "com.backendless.transaction.OperationDelete",
              "payload": {
                "___ref": true,
                "opResultId": "createPerson1",
                "propName": "objectId"
              },
              "opResultId": "deletePerson2",
              "operationType": "DELETE",
              "table": "Person"
            }
          ]
        })

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
      })
    })
  })

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

  describe('set-relations', function() {

    const commonSuiteRequestBody = {
      opResultId   : 'set_relationPerson1',
      operationType: 'SET_RELATION',
      table        : 'Person',
    }

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
            set_relationPerson1: {
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

        it('children:Class', async () => {
          await callUowInitFromJson([
            {
              "___jsonclass": "com.backendless.transaction.OperationSetRelation",
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
              "opResultId": "set_relationPerson1",
              "operationType": "SET_RELATION",
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

        it('children:List<HashMap>', async () => {
          await callUowInitFromJson([
            {
              "___jsonclass": "com.backendless.transaction.OperationSetRelation",
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
              "opResultId": "set_relationPerson1",
              "operationType": "SET_RELATION",
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
              "___jsonclass": "com.backendless.transaction.OperationSetRelation",
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
              "opResultId": "set_relationPerson1",
              "operationType": "SET_RELATION",
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
            set_relationPerson1: {
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
              "___jsonclass": "com.backendless.transaction.OperationCreateBulk",
              "payload": [
                {}
              ],
              "opResultId": "create_bulkPerson1",
              "operationType": "CREATE_BULK",
              "table": "Person"
            },
            {
              "___jsonclass": "com.backendless.transaction.OperationSetRelation",
              "payload": {
                "___jsonclass": "com.backendless.transaction.payload.Relation",
                "columnUnique": false,
                "conditional": "foo > 123",
                "parentObject": {
                  "___ref": true,
                  "opResultId": "create_bulkPerson1",
                  "resultIndex": 3
                },
                "unconditional": null,
                "relationTableName": null,
                "relationColumn": "order",
                "objectIds": null
              },
              "opResultId": "set_relationPerson1",
              "operationType": "SET_RELATION",
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

        it('children:List<Update.OpResult>', async () => {
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
              "___jsonclass": "com.backendless.transaction.OperationSetRelation",
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
                    "opResultId": "updateOrder1",
                    "propName": "objectId"
                  }
                ],
                "relationTableName": null,
                "relationColumn": "order",
                "objectIds": null
              },
              "opResultId": "set_relationPerson1",
              "operationType": "SET_RELATION",
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

        it('children:<Find.OpResultValue>', async () => {
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
              "___jsonclass": "com.backendless.transaction.OperationSetRelation",
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
                    "opResultId": "findOrder1",
                    "resultIndex": 3,
                    "propName": "objectId"
                  }
                ],
                "relationTableName": null,
                "relationColumn": "order",
                "objectIds": null
              },
              "opResultId": "set_relationPerson1",
              "operationType": "SET_RELATION",
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
                opResultId : 'findOrder1',
                propName   : 'objectId',
                resultIndex: 3,
              }],
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
            set_relationPerson1: {
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

        it('children:Class', async () => {
          await callUowInitFromJson([
            {
              "___jsonclass": "com.backendless.transaction.OperationSetRelation",
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
              "opResultId": "set_relationPerson1",
              "operationType": "SET_RELATION",
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

        it('children:List<BulkCreate.OpResultValue>', async () => {

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
              "___jsonclass": "com.backendless.transaction.OperationSetRelation",
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
              "opResultId": "set_relationPerson1",
              "operationType": "SET_RELATION",
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
              "___jsonclass": "com.backendless.transaction.OperationSetRelation",
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
              "opResultId": "set_relationPerson1",
              "operationType": "SET_RELATION",
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
            set_relationPerson1: {
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
              "___jsonclass": "com.backendless.transaction.OperationSetRelation",
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
              "opResultId": "set_relationPerson1",
              "operationType": "SET_RELATION",
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

        it('children:List<HashMap>', async () => {
          await callUowInitFromJson([
            {
              "___jsonclass": "com.backendless.transaction.OperationSetRelation",
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
              "opResultId": "set_relationPerson1",
              "operationType": "SET_RELATION",
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

        it('children:<Create.OpResult>', async () => {

          await callUowInitFromJson([
            {
              "___jsonclass": "com.backendless.transaction.OperationCreate",
              "payload": {
                "label": "order-1"
              },
              "opResultId": "createOrder1",
              "operationType": "CREATE",
              "table": "Order"
            },
            {
              "___jsonclass": "com.backendless.transaction.OperationSetRelation",
              "payload": {
                "___jsonclass": "com.backendless.transaction.payload.Relation",
                "columnUnique": false,
                "conditional": null,
                "parentObject": "parent-objectId",
                "unconditional": [
                  {
                    "___ref": true,
                    "opResultId": "createOrder1",
                    "propName": "objectId"
                  }
                ],
                "relationTableName": null,
                "relationColumn": "order",
                "objectIds": null
              },
              "opResultId": "set_relationPerson1",
              "operationType": "SET_RELATION",
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
                opResultId: 'createOrder1',
                propName  : 'objectId',
              }],
            }
          })
        })
      })
    })
  })

  describe('bulk-create-operation', function() {

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

      const uow = Backendless.UnitOfWork.initFromJSON({
        ...commonSuiteRequestBody,
        operations: [
          {
            "___jsonclass": "com.backendless.transaction.OperationCreateBulk",
            "payload": [
              {
                "___jsonclass": "Person",
                "___class": "Person",
                "name": "p-name-1"
              }
            ],
            "opResultId": "create_bulkPerson1",
            "operationType": "CREATE_BULK",
            "table": "Person"
          },
          {
            "___jsonclass": "com.backendless.transaction.OperationCreateBulk",
            "payload": [
              {
                "name": "p-name-2"
              }
            ],
            "opResultId": "create_bulkPerson2",
            "operationType": "CREATE_BULK",
            "table": "Person"
          }
        ]
      })

      await uow.execute()

      expect(req1.body.operations).to.have.length(2)

      expect(req1.body.operations[0]).to.deep.include({
        payload      : [
          {
            ___class: 'Person',
            name    : 'p-name-1',
          }
        ],
        opResultId   : 'create_bulkPerson1',
        operationType: 'CREATE_BULK',
        table        : 'Person',
      })

      expect(req1.body.operations[1]).to.deep.include({
        payload      : [
          {
            name: 'p-name-2',
          }
        ],
        opResultId   : 'create_bulkPerson2',
        operationType: 'CREATE_BULK',
        table        : 'Person',
      })
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

      const uow = Backendless.UnitOfWork.initFromJSON({
        ...commonSuiteRequestBody,
        operations: [
          {
            "___jsonclass": "com.backendless.transaction.OperationCreateBulk",
            "payload": [
              {
                "___jsonclass": "Person",
                "___class": "Person",
                "name": "p-name-1"
              }
            ],
            "opResultId": "create_bulkPerson1",
            "operationType": "CREATE_BULK",
            "table": "Person"
          },
          {
            "___jsonclass": "com.backendless.transaction.OperationCreateBulk",
            "payload": [
              {
                "name": "p-name-2"
              }
            ],
            "opResultId": "create_bulkPerson2",
            "operationType": "CREATE_BULK",
            "table": "Person"
          },
          {
            "___jsonclass": "com.backendless.transaction.OperationCreateBulk",
            "payload": [
              {
                "name": "p-name-3"
              }
            ],
            "opResultId": "create_bulkPerson3",
            "operationType": "CREATE_BULK",
            "table": "Person"
          }
        ]
      })

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
    })
  })

  describe('bulk-delete-operation', function() {

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
            "___jsonclass": "com.backendless.transaction.OperationDeleteBulk",
            "payload": {
              "___jsonclass": "com.backendless.transaction.payload.DeleteBulkPayload",
              "conditional": null,
              "unconditional": {
                "___ref": true,
                "opResultId": "findPerson1"
              }
            },
            "opResultId": "delete_bulkPerson1",
            "operationType": "DELETE_BULK",
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
    })

    it('bulkDelete', async () => {
      const results = {
        findPerson1: {
          result: {}
        },

        delete_bulkPerson1: {
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
            "___jsonclass": "com.backendless.transaction.OperationDeleteBulk",
            "payload": {
              "___jsonclass": "com.backendless.transaction.payload.DeleteBulkPayload",
              "conditional": null,
              "unconditional": {
                "___ref": true,
                "opResultId": "findPerson1"
              }
            },
            "opResultId": "delete_bulkPerson1",
            "operationType": "DELETE_BULK",
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
    })

    it('bulkDelete(tableName: string, whereClause: string', async () => {
      const results = {
        delete_bulkPerson1: {
          result: {}
        }
      }

      const req1 = prepareSuccessResponse(results)

      const uow = Backendless.UnitOfWork.initFromJSON({
        ...commonSuiteRequestBody,
        operations: [
          {
            "___jsonclass": "com.backendless.transaction.OperationDeleteBulk",
            "payload": {
              "___jsonclass": "com.backendless.transaction.payload.DeleteBulkPayload",
              "conditional": "foo > 123",
              "unconditional": null
            },
            "opResultId": "delete_bulkPerson1",
            "operationType": "DELETE_BULK",
            "table": "Person"
          }
        ]
      })

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
    })
  })

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