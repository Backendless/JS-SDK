import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forSuite } from '../../../helpers/sandbox'
import { prepareSuccessResponse } from '../utils'

describe('<Init Transactions JSON> Basic', function() {

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
            '___jsonclass' : 'com.backendless.transaction.OperationFind',
            'payload'      : {
              'queryOptions': {
                'related'          : [
                  'rel1',
                  'rel2',
                  'rel3'
                ],
                'relationsDepth'   : 3,
                'relationsPageSize': 25
              },
              'pageSize'    : 50,
              'offset'      : 15,
              'properties'  : [
                'foo',
                'bar',
                'prop1',
                'prop2',
                'prop3',
                'prop4',
                'prop5',
                'prop6',
                'prop7',
                'prop8',
                'prop9',
                '*'
              ],
              'excludeProps': [
                'ex-foo',
                'ex-bar',
                'ex-prop1',
                'ex-prop2',
                'ex-prop3',
                'ex-prop4',
                'ex-prop5',
                'ex-prop6',
                'ex-prop7',
                'ex-prop8'
              ],
              'whereClause' : 'age >= 100',
              'havingClause': 'age >= 200'
            },
            'opResultId'   : 'findPerson1',
            'operationType': 'FIND',
            'table'        : 'Person'
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