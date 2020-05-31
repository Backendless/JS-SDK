import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forSuite } from '../../helpers/sandbox'
import { prepareSuccessResponse } from './utils'

const PERSONS_TABLE_NAME = 'Person'

describe('<Transactions> Find Operation', function() {

  forSuite(this)

  let uow
  let query

  beforeEach(() => {
    uow = new Backendless.UnitOfWork()
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

    const opResult = uow.find(PERSONS_TABLE_NAME, query)

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

    expect(opResult.result).to.equal(opResult.getResult()).to.equal(results.findPerson1.result)
  })

  it('gets query from plain object', async () => {
    const results = {
      findPerson1: {
        operationType: 'FIND',
        result       : []
      }
    }

    const req1 = prepareSuccessResponse(results)

    uow.find(PERSONS_TABLE_NAME, {
      pageSize         : 50,
      offset           : 15,
      properties       : ['foo', 'bar', 'prop1', 'prop2', 'prop3', 'prop4', 'prop5', 'prop6', 'prop7', 'prop8', 'prop9', '*'],
      excludeProps     : ['ex-foo', 'ex-bar', 'ex-prop1', 'ex-prop2', 'ex-prop3', 'ex-prop4', 'ex-prop5', 'ex-prop6', 'ex-prop7', 'ex-prop8',],
      where            : 'age >= 100',
      having           : 'age >= 200',
      relations        : ['rel1', 'rel2', 'rel3'],
      relationsDepth   : 3,
      relationsPageSize: 25
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

  describe('Paging', () => {
    it('basic options', async () => {
      class DataQueryBuilder {
        // setPageSize(pageSize)
        // setOffset(offset)
        // prepareNextPage()
        // preparePreviousPage()
      }

      query
        .setPageSize(50)
        .setOffset(15)

      const results = {
        findPerson1: {
          operationType: 'FIND',
          result       : []
        }
      }

      const req1 = prepareSuccessResponse(results)

      uow.find(PERSONS_TABLE_NAME, query)

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
              queryOptions: {},
            },
          }
        ]
      })
    })

    it('next/prev pages', async () => {
      query
        .setPageSize(50)
        .setOffset(15)

      const results = {
        findPerson1: {
          operationType: 'FIND',
          result       : []
        },
        findPerson2: {
          operationType: 'FIND',
          result       : []
        },
        findPerson3: {
          operationType: 'FIND',
          result       : []
        }
      }

      const req1 = prepareSuccessResponse(results)

      uow.find(PERSONS_TABLE_NAME, query)

      query
        .prepareNextPage()
        .prepareNextPage()

      uow.find(PERSONS_TABLE_NAME, query)

      query.preparePreviousPage()

      uow.find(PERSONS_TABLE_NAME, query)

      await uow.execute()

      expect(req1.body.operations).to.have.length(3)

      expect(req1.body.operations[0]).to.deep.include({
        opResultId   : 'findPerson1',
        operationType: 'FIND',
        table        : 'Person',
        payload      : {
          pageSize    : 50,
          offset      : 15,
          queryOptions: {},
        },
      })

      expect(req1.body.operations[1]).to.deep.include({
        opResultId   : 'findPerson2',
        operationType: 'FIND',
        table        : 'Person',
        payload      : {
          pageSize    : 50,
          offset      : 115,
          queryOptions: {},
        },
      })

      expect(req1.body.operations[2]).to.deep.include({
        opResultId   : 'findPerson3',
        operationType: 'FIND',
        table        : 'Person',
        payload      : {
          pageSize    : 50,
          offset      : 65,
          queryOptions: {},
        },
      })
    })
  })

  describe('Properties', () => {
    it('setProperties', async () => {
      query
        .setProperties(['foo2', 'bar2'])
        .setProperties(['foo', 'bar'])

      const results = {
        findPerson1: {
          operationType: 'FIND',
          result       : []
        }
      }

      const req1 = prepareSuccessResponse(results)

      uow.find(PERSONS_TABLE_NAME, query)

      await uow.execute()

      expect(req1.body).to.deep.include({
        operations: [
          {
            opResultId   : 'findPerson1',
            operationType: 'FIND',
            table        : 'Person',
            payload      : {
              pageSize    : 10,
              properties  : ['foo', 'bar'],
              queryOptions: {},
            },
          }
        ]
      })
    })

    it('addProperties', async () => {
      query
        .setProperties(['foo', 'bar'])
        .addProperties(['prop1', 'prop2'])
        .addProperties('prop3', 'prop4')
        .addProperties('prop5', ['prop6', 'prop7'])
        .addProperties('prop8')
        .addProperty('prop9')
        .addAllProperties()

      const results = {
        findPerson1: {
          operationType: 'FIND',
          result       : []
        }
      }

      const req1 = prepareSuccessResponse(results)

      uow.find(PERSONS_TABLE_NAME, query)

      await uow.execute()

      expect(req1.body).to.deep.include({
        operations: [
          {
            opResultId   : 'findPerson1',
            operationType: 'FIND',
            table        : 'Person',
            payload      : {
              pageSize    : 10,
              properties  : [
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
              queryOptions: {},
            },
          }
        ]
      })
    })

    it('excludeProperties', async () => {
      query
        .excludeProperties(['foo', 'bar'])
        .excludeProperties(['prop1', 'prop2'])
        .excludeProperties('prop3', 'prop4')
        .excludeProperties('prop5', ['prop6', 'prop7'])
        .excludeProperty('prop8')
        .addAllProperties()

      const results = {
        findPerson1: {
          operationType: 'FIND',
          result       : []
        }
      }

      const req1 = prepareSuccessResponse(results)

      uow.find(PERSONS_TABLE_NAME, query)

      await uow.execute()

      expect(req1.body).to.deep.include({
        operations: [
          {
            opResultId   : 'findPerson1',
            operationType: 'FIND',
            table        : 'Person',
            payload      : {
              pageSize    : 10,
              properties  : ['*'],
              excludeProps: [
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
              ],
              queryOptions: {},
            },
          }
        ]
      })
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

      uow.find(PERSONS_TABLE_NAME, query)

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

  describe('Sorting and Grouping', () => {
    it('basic find with sortBy and groupBy', async () => {
      query
        .setSortBy('created')
        .setGroupBy('objectId')

      const results = {
        findPerson1: {
          operationType: 'FIND',
          result       : []
        }
      }

      const req1 = prepareSuccessResponse(results)

      uow.find(PERSONS_TABLE_NAME, query)

      await uow.execute()

      expect(req1.body).to.deep.include({
        operations: [
          {
            opResultId   : 'findPerson1',
            operationType: 'FIND',
            table        : 'Person',
            payload      : {
              pageSize    : 10,
              groupBy     : ['objectId'],
              queryOptions: {
                sortBy: ['created']
              },
            },
          }
        ]
      })
    })
  })

  describe('Relations', () => {
    it('basic find', async () => {
      query
        .setRelated('rel1')
        .addRelated('rel2')
        .addRelated('rel3')
        .setRelationsDepth(3)
        .setRelationsPageSize(25)

      const results = {
        findPerson1: {
          operationType: 'FIND',
          result       : []
        }
      }

      const req1 = prepareSuccessResponse(results)

      uow.find(PERSONS_TABLE_NAME, query)

      await uow.execute()

      expect(req1.body).to.deep.include({
        operations: [
          {
            opResultId   : 'findPerson1',
            operationType: 'FIND',
            table        : 'Person',
            payload      : {
              pageSize    : 10,
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
  })

  describe('Fails', () => {
    const invalidArgsError = 'Invalid arguments'

    it('table name is not a string', async () => {
      expect(() => uow.find()).to.throw(invalidArgsError)
      expect(() => uow.find(null)).to.throw(invalidArgsError)
      expect(() => uow.find(true)).to.throw(invalidArgsError)
      expect(() => uow.find(123)).to.throw(invalidArgsError)
      expect(() => uow.find({})).to.throw(invalidArgsError)
      expect(() => uow.find([])).to.throw(invalidArgsError)
      expect(() => uow.find(() => ({}))).to.throw(invalidArgsError)
    })

    it('object changes is not an object', async () => {
      expect(() => uow.find(PERSONS_TABLE_NAME, 'str')).to.throw(invalidArgsError)
      expect(() => uow.find(PERSONS_TABLE_NAME, true)).to.throw(invalidArgsError)
      expect(() => uow.find(PERSONS_TABLE_NAME, 123)).to.throw(invalidArgsError)
      expect(() => uow.find(PERSONS_TABLE_NAME, [])).to.throw(invalidArgsError)
      expect(() => uow.find(PERSONS_TABLE_NAME, () => ({}))).to.throw(invalidArgsError)
    })
  })
})
