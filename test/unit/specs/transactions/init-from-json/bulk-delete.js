import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forSuite } from '../../../helpers/sandbox'
import { prepareSuccessResponse } from '../utils'

describe('<Init Transactions JSON> Bulk Delete', function() {

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
          '___jsonclass' : 'com.backendless.transaction.OperationFind',
          'payload'      : {
            'queryOptions': {}
          },
          'opResultId'   : 'findPerson1',
          'operationType': 'FIND',
          'table'        : 'Person'
        },
        {
          '___jsonclass' : 'com.backendless.transaction.OperationDeleteBulk',
          'payload'      : {
            '___jsonclass' : 'com.backendless.transaction.payload.DeleteBulkPayload',
            'conditional'  : null,
            'unconditional': {
              '___ref'    : true,
              'opResultId': 'findPerson1'
            }
          },
          'opResultId'   : 'delete_bulkPerson1',
          'operationType': 'DELETE_BULK',
          'table'        : 'Person'
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
          '___jsonclass' : 'com.backendless.transaction.OperationFind',
          'payload'      : {
            'queryOptions': {}
          },
          'opResultId'   : 'findPerson1',
          'operationType': 'FIND',
          'table'        : 'Person'
        },
        {
          '___jsonclass' : 'com.backendless.transaction.OperationDeleteBulk',
          'payload'      : {
            '___jsonclass' : 'com.backendless.transaction.payload.DeleteBulkPayload',
            'conditional'  : null,
            'unconditional': {
              '___ref'    : true,
              'opResultId': 'findPerson1'
            }
          },
          'opResultId'   : 'delete_bulkPerson1',
          'operationType': 'DELETE_BULK',
          'table'        : 'Person'
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
          '___jsonclass' : 'com.backendless.transaction.OperationDeleteBulk',
          'payload'      : {
            '___jsonclass' : 'com.backendless.transaction.payload.DeleteBulkPayload',
            'conditional'  : 'foo > 123',
            'unconditional': null
          },
          'opResultId'   : 'delete_bulkPerson1',
          'operationType': 'DELETE_BULK',
          'table'        : 'Person'
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

  it('bulk delete with tableName and opResultValueReference', async () => {
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
          '___jsonclass' : 'com.backendless.transaction.OperationFind',
          'payload'      : { 'queryOptions': {}, 'pageSize': 1 },
          'opResultId'   : 'findPerson1',
          'operationType': 'FIND',
          'table'        : 'Person'
        },
        {
          '___jsonclass' : 'com.backendless.transaction.OperationDeleteBulk',
          'payload'      : {
            '___jsonclass' : 'com.backendless.transaction.payload.DeleteBulkPayload',
            'conditional'  : null,
            'unconditional': [{ '___ref': true, 'opResultId': 'findPerson1', 'resultIndex': 1, 'propName': 'opRes' }],
            'query'        : null
          },
          'opResultId'   : 'delete_bulkOrder1',
          'operationType': 'DELETE_BULK',
          'table'        : 'Order'
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
        pageSize    : 1,
        queryOptions: {},
      }
    })

    expect(req1.body.operations[1]).to.deep.include({
      opResultId   : 'delete_bulkOrder1',
      operationType: 'DELETE_BULK',
      table        : 'Order',
      payload      : {
        unconditional: [
          {
            ___ref     : true,
            opResultId : 'findPerson1',
            propName   : 'opRes',
            resultIndex: 1,
          }
        ]
      }
    })
  })
})