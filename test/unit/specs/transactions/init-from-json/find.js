import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forSuite } from '../../../helpers/sandbox'
import { prepareSuccessResponse } from '../utils'

describe('<Init Transactions JSON> Find', function() {

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
          '___jsonclass' : 'com.backendless.transaction.OperationFind',
          'payload'      : {
            'queryOptions': {},
            'pageSize'    : 10
          },
          'opResultId'   : 'findPerson1',
          'operationType': 'FIND',
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
            '___jsonclass' : 'com.backendless.transaction.OperationFind',
            'payload'      : {
              'queryOptions': {},
              'pageSize'    : 10,
              'whereClause' : 'age >= 100',
              'havingClause': 'age >= 200'
            },
            'opResultId'   : 'findPerson1',
            'operationType': 'FIND',
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