import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forSuite } from '../../../helpers/sandbox'
import { prepareSuccessResponse } from '../utils'

describe('<Init Transactions JSON> Bulk Create', function() {

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
          '___jsonclass' : 'com.backendless.transaction.OperationCreateBulk',
          'payload'      : [
            {
              '___jsonclass': 'Person',
              '___class'    : 'Person',
              'name'        : 'p-name-1'
            }
          ],
          'opResultId'   : 'create_bulkPerson1',
          'operationType': 'CREATE_BULK',
          'table'        : 'Person'
        },
        {
          '___jsonclass' : 'com.backendless.transaction.OperationCreateBulk',
          'payload'      : [
            {
              'name': 'p-name-2'
            }
          ],
          'opResultId'   : 'create_bulkPerson2',
          'operationType': 'CREATE_BULK',
          'table'        : 'Person'
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
          '___jsonclass' : 'com.backendless.transaction.OperationCreateBulk',
          'payload'      : [
            {
              '___jsonclass': 'Person',
              '___class'    : 'Person',
              'name'        : 'p-name-1'
            }
          ],
          'opResultId'   : 'create_bulkPerson1',
          'operationType': 'CREATE_BULK',
          'table'        : 'Person'
        },
        {
          '___jsonclass' : 'com.backendless.transaction.OperationCreateBulk',
          'payload'      : [
            {
              'name': 'p-name-2'
            }
          ],
          'opResultId'   : 'create_bulkPerson2',
          'operationType': 'CREATE_BULK',
          'table'        : 'Person'
        },
        {
          '___jsonclass' : 'com.backendless.transaction.OperationCreateBulk',
          'payload'      : [
            {
              'name': 'p-name-3'
            }
          ],
          'opResultId'   : 'create_bulkPerson3',
          'operationType': 'CREATE_BULK',
          'table'        : 'Person'
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