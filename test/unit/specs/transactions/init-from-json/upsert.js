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

describe('<Init Transactions JSON> Upsert', function() {

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

  it('creates one map-object', async () => {
    const results = {
      upsertPerson1: {
        operationType: 'UPSERT',
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
          opResultId   : 'upsertPerson1',
          operationType: 'UPSERT',
          table        : 'Person'
        }
      ]
    })

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
  })

  it('creates instance-object', async () => {
    const results = {
      upsertPerson1: {
        operationType: 'UPSERT',
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
          opResultId   : 'upsertPerson1',
          operationType: 'UPSERT',
          table        : 'Person'
        }
      ]
    })

    await uow.execute()

    expect(req.body).to.deep.include({
      operations: [
        {
          opResultId   : 'upsertPerson1',
          operationType: 'UPSERT',
          table        : 'Person',
          payload      : JSON.parse(JSON.stringify(obj)),
        }
      ]
    })
  })

  it('create with OpResult as property', async () => {
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

    const uow = Backendless.UnitOfWork.initFromJSON({
      ...commonSuiteRequestBody,
      operations: [
        {
          '___jsonclass' : 'com.backendless.transaction.OperationUpsert',
          'payload'      : { 'title': 'order-1' },
          'opResultId'   : 'upsertOrder1',
          'operationType': 'UPSERT',
          'table'        : 'Order'
        },
        {
          '___jsonclass' : 'com.backendless.transaction.OperationUpsert',
          'payload'      : {
            'name' : 'bob',
            'age'  : 123,
            'opRes': { '___ref': true, 'opResultId': 'upsertOrder1', 'propName': 'objectId' }
          },
          'opResultId'   : 'upsertPerson1',
          'operationType': 'UPSERT',
          'table'        : 'Person'
        }
      ]
    })

    const upsertOrder1 = uow.getOpResultById('upsertOrder1')
    const upsertPerson1 = uow.getOpResultById('upsertPerson1')

    expect(upsertPerson1.payload.opRes).to.be.instanceof(Backendless.UnitOfWork.OpResultValueReference)
    expect(upsertPerson1.payload.opRes).to.deep.include(upsertOrder1.resolveTo('objectId'))

    await uow.execute()

    expect(req1.body).to.deep.include({
      operations: [{
        'payload'      : { 'title': 'order-1' },
        'opResultId'   : 'upsertOrder1',
        'operationType': 'UPSERT',
        'table'        : 'Order'
      }, {
        'payload'      : {
          'name' : 'bob',
          'age'  : 123,
          'opRes': { '___ref': true, 'opResultId': 'upsertOrder1', 'propName': 'objectId' }
        },
        'opResultId'   : 'upsertPerson1',
        'operationType': 'UPSERT',
        'table'        : 'Person'
      }]
    })
  })

  it('create with result', async () => {
    const uow = Backendless.UnitOfWork.initFromJSON({
      ...commonSuiteRequestBody,
      operations: [
        {
          '___jsonclass' : 'com.backendless.transaction.OperationUpsert',
          'payload'      : { 'title': 'order-1' },
          'opResultId'   : 'upsertOrder1',
          'operationType': 'UPSERT',
          'table'        : 'Order',
        },
        {
          '___jsonclass' : 'com.backendless.transaction.OperationUpsert',
          'payload'      : {
            'name' : 'bob',
            'age'  : 123,
            'opRes': { '___ref': true, 'opResultId': 'upsertOrder1', 'propName': 'objectId' }
          },
          'opResultId'   : 'upsertPerson1',
          'operationType': 'UPSERT',
          'table'        : 'Person',
        }
      ]
    })

    uow.setResult({
      '___jsonclass': 'com.backendless.transaction.UnitOfWorkResult',
      'success'     : true,
      'error'       : null,
      'results'     : {
        'upsertPerson1': {
          '___jsonclass' : 'com.backendless.transaction.OperationResultCreate',
          'result'       : {
            '___jsonclass': 'Person',
            'created'     : '2020-10-27T16:29:16.274Z',
            'name'        : 'bob',
            '___class'    : 'Person',
            'ownerId'     : null,
            'updated'     : null,
            'age'         : 123,
            'objectId'    : 'test-objectId2',
            'opRes'       : 'test-objectId1'
          },
          'operationType': 'UPSERT'
        },
        'upsertOrder1' : {
          '___jsonclass' : 'com.backendless.transaction.OperationResultCreate',
          'result'       : {
            '___jsonclass': 'Order',
            'price'       : null,
            'created'     : '2020-10-27T16:29:16.259Z',
            '___class'    : 'Order',
            'ownerId'     : null,
            'title'       : 'order-1',
            'updated'     : null,
            'objectId'    : 'test-objectId2'
          },
          'operationType': 'UPSERT'
        }
      }
    })

    const upsertOrder1 = uow.getOpResultById('upsertOrder1')
    const upsertPerson1 = uow.getOpResultById('upsertPerson1')

    expect(upsertOrder1.getResult()).to.deep.include({
      '___jsonclass': 'Order',
      'price'       : null,
      'created'     : '2020-10-27T16:29:16.259Z',
      '___class'    : 'Order',
      'ownerId'     : null,
      'title'       : 'order-1',
      'updated'     : null,
      'objectId'    : 'test-objectId2'
    })

    expect(upsertPerson1.getResult()).to.deep.include({
      '___jsonclass': 'Person',
      'created'     : '2020-10-27T16:29:16.274Z',
      'name'        : 'bob',
      '___class'    : 'Person',
      'ownerId'     : null,
      'updated'     : null,
      'age'         : 123,
      'objectId'    : 'test-objectId2',
      'opRes'       : 'test-objectId1'
    })
  })

  describe('Signatures', () => {

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

      const uow = Backendless.UnitOfWork.initFromJSON({
        ...commonSuiteRequestBody,
        operations: [
          {
            '___jsonclass' : 'com.backendless.transaction.OperationUpsert',
            'payload'      : {
              'name': 'p-name'
            },
            'opResultId'   : 'upsertPerson1',
            'operationType': 'UPSERT',
            'table'        : 'Person'
          },
          {
            '___jsonclass' : 'com.backendless.transaction.OperationUpsert',
            'payload'      : {
              'name': 'p-name'
            },
            'opResultId'   : 'upsertPerson2',
            'operationType': 'UPSERT',
            'table'        : 'Person'
          }
        ]
      })

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
    })

  })
})
