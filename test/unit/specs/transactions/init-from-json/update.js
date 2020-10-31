import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forSuite } from '../../../helpers/sandbox'
import { prepareSuccessResponse } from '../utils'

describe('<Init Transactions JSON> Update', function() {

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
          '___jsonclass' : 'com.backendless.transaction.OperationUpdate',
          'payload'      : {
            'objectId': {
              '___ref'    : true,
              'opResultId': 'createPerson1',
              'propName'  : 'objectId'
            },
            'age'     : 123
          },
          'opResultId'   : 'updatePerson1',
          'operationType': 'UPDATE',
          'table'        : 'Person'
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
          '___jsonclass' : 'com.backendless.transaction.OperationUpdate',
          'payload'      : {
            'objectId': 'test-objectId',
            'name'    : 'p-name'
          },
          'opResultId'   : 'updatePerson1',
          'operationType': 'UPDATE',
          'table'        : 'Person'
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
          '___jsonclass' : 'com.backendless.transaction.OperationUpdate',
          'payload'      : {
            'objectId': 'test-objectId-1',
            'name'    : 'p-1'
          },
          'opResultId'   : 'updatePerson1',
          'operationType': 'UPDATE',
          'table'        : 'Person'
        },
        {
          '___jsonclass' : 'com.backendless.transaction.OperationUpdate',
          'payload'      : {
            'objectId': 'test-objectId-2',
            'name'    : 'p-2'
          },
          'opResultId'   : 'updatePerson2',
          'operationType': 'UPDATE',
          'table'        : 'Person'
        },
        {
          '___jsonclass' : 'com.backendless.transaction.OperationUpdate',
          'payload'      : {
            'objectId': 'test-objectId-3',
            'name'    : 'p-3'
          },
          'opResultId'   : 'updatePerson3',
          'operationType': 'UPDATE',
          'table'        : 'Person'
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
          '___jsonclass' : 'com.backendless.transaction.OperationUpdate',
          'payload'      : {
            'objectId': {
              '___ref'    : true,
              'opResultId': 'createPerson1',
              'propName'  : 'objectId'
            },
            'age'     : 123
          },
          'opResultId'   : 'updatePerson1',
          'operationType': 'UPDATE',
          'table'        : 'Person'
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
            '___jsonclass' : 'com.backendless.transaction.OperationUpdate',
            'payload'      : {
              'objectId': {
                '___ref'     : true,
                'opResultId' : 'findPerson1',
                'resultIndex': 1,
                'propName'   : 'objectId'
              },
              'age'     : 111
            },
            'opResultId'   : 'updatePerson1',
            'operationType': 'UPDATE',
            'table'        : 'Person'
          },
          {
            '___jsonclass' : 'com.backendless.transaction.OperationUpdate',
            'payload'      : {
              'objectId': {
                '___ref'    : true,
                'opResultId': 'createPerson1',
                'propName'  : 'objectId'
              },
              'age'     : 222
            },
            'opResultId'   : 'updatePerson2',
            'operationType': 'UPDATE',
            'table'        : 'Person'
          },
          {
            '___jsonclass' : 'com.backendless.transaction.OperationUpdate',
            'payload'      : {
              'objectId': {
                '___ref'    : true,
                'opResultId': 'createPerson1',
                'propName'  : 'objectId'
              },
              'sub'     : {
                '___ref'     : true,
                'opResultId' : 'findPerson1',
                'resultIndex': 1,
                'propName'   : 'subProp'
              }
            },
            'opResultId'   : 'updatePerson3',
            'operationType': 'UPDATE',
            'table'        : 'Person'
          },
          {
            '___jsonclass' : 'com.backendless.transaction.OperationUpdate',
            'payload'      : {
              'objectId': {
                '___ref'    : true,
                'opResultId': 'createPerson1',
                'propName'  : 'objectId'
              },
              'sub2'    : {
                '___ref'    : true,
                'opResultId': 'createPerson1',
                'propName'  : 'subProp2'
              }
            },
            'opResultId'   : 'updatePerson4',
            'operationType': 'UPDATE',
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