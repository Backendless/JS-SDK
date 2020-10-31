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

describe('<Init Transactions JSON> Delete', function() {

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
          '___jsonclass' : 'com.backendless.transaction.OperationDelete',
          'payload'      : 'test-objectId',
          'opResultId'   : 'deletePerson1',
          'operationType': 'DELETE',
          'table'        : 'Person'
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
          '___jsonclass' : 'com.backendless.transaction.OperationDelete',
          'payload'      : 'test-objectId-1',
          'opResultId'   : 'deletePerson1',
          'operationType': 'DELETE',
          'table'        : 'Person'
        },
        {
          '___jsonclass' : 'com.backendless.transaction.OperationDelete',
          'payload'      : 'test-objectId-2',
          'opResultId'   : 'deletePerson2',
          'operationType': 'DELETE',
          'table'        : 'Person'
        },
        {
          '___jsonclass' : 'com.backendless.transaction.OperationDelete',
          'payload'      : 'test-objectId-3',
          'opResultId'   : 'deletePerson3',
          'operationType': 'DELETE',
          'table'        : 'Person'
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
            '___jsonclass' : 'com.backendless.transaction.OperationDelete',
            'payload'      : 'test-objectId',
            'opResultId'   : 'deletePerson1',
            'operationType': 'DELETE',
            'table'        : 'Person'
          },
          {
            '___jsonclass' : 'com.backendless.transaction.OperationDelete',
            'payload'      : 'test-objectId',
            'opResultId'   : 'deletePerson2',
            'operationType': 'DELETE',
            'table'        : 'Person'
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
            '___jsonclass' : 'com.backendless.transaction.OperationFind',
            'payload'      : {
              'queryOptions': {}
            },
            'opResultId'   : 'findPerson1',
            'operationType': 'FIND',
            'table'        : 'Person'
          },
          {
            '___jsonclass' : 'com.backendless.transaction.OperationCreate',
            'payload'      : {
              'name': 'p-1',
              'age' : 777
            },
            'opResultId'   : 'createPerson1',
            'operationType': 'CREATE',
            'table'        : 'Person'
          },
          {
            '___jsonclass' : 'com.backendless.transaction.OperationDelete',
            'payload'      : {
              '___ref'     : true,
              'opResultId' : 'findPerson1',
              'resultIndex': 1,
              'propName'   : 'objectId'
            },
            'opResultId'   : 'deletePerson1',
            'operationType': 'DELETE',
            'table'        : 'Person'
          },
          {
            '___jsonclass' : 'com.backendless.transaction.OperationDelete',
            'payload'      : {
              '___ref'    : true,
              'opResultId': 'createPerson1',
              'propName'  : 'objectId'
            },
            'opResultId'   : 'deletePerson2',
            'operationType': 'DELETE',
            'table'        : 'Person'
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