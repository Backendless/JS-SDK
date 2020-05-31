import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forTest, prepareMockRequest } from '../../helpers/sandbox'

describe('<Data> Data Connectors', function() {

  forTest(this)

  const fakeResult = { foo: 123 }

  const tableName = 'Person'

  const primaryKey1 = 'pk-1'
  const primaryKey2 = 'pk-1'

  let dataStore
  let query

  beforeEach(() => {
    dataStore = Backendless.Data.of(tableName)

    query = Backendless.Data.QueryBuilder.create()
  })

  describe('FindById', () => {
    it('without query', async () => {
      const req1 = prepareMockRequest(fakeResult)

      const result1 = await dataStore.findById({ primaryKey1, primaryKey2 })

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/pk?primaryKey1=${primaryKey1}&primaryKey2=${primaryKey2}`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql(fakeResult)
    })

    it('with all query options', async () => {
      const req1 = prepareMockRequest(fakeResult)
      const req2 = prepareMockRequest(fakeResult)
      const req3 = prepareMockRequest(fakeResult)

      query
        .setPageSize(50)
        .setOffset(15)

        .setProperties(['foo', 'bar'])
        .addProperties(['prop1', 'prop2'])
        .addProperties('prop3', 'prop4')
        .addProperties('prop5', ['prop6', 'prop7'])
        .addProperties('prop8')
        .addProperty('prop9')

        .excludeProperties(['foo', 'bar'])
        .excludeProperties(['prop1', 'prop2'])
        .excludeProperties('prop3', 'prop4')
        .excludeProperties('prop5', ['prop6', 'prop7'])
        .excludeProperty('prop8')

        .addAllProperties()

        .setWhereClause('age >= 100')
        .setHavingClause('age >= 200')

        .setSortBy('created')
        .setGroupBy('objectId')

        .setRelated('rel1')
        .addRelated('rel2')
        .addRelated('rel3')

        .setRelationsDepth(3)
        .setRelationsPageSize(25)

      const query2 = Backendless.Data.QueryBuilder.create()

      const query3 = {
        pageSize: 30,
        offset  : 40,

        properties  : ['prop-1', 'prop-2'],
        excludeProps: ['prop-3', 'prop-3'],

        where : 'test-where',
        having: 'test-having',

        sortBy : 'test-sortby',
        groupBy: 'test-groupby',

        relations        : ['rel-1', 'rel-2'],
        relationsDepth   : 4,
        relationsPageSize: 70,
      }

      const result1 = await dataStore.findById({ primaryKey1, primaryKey2 }, query)
      const result2 = await dataStore.findById({ primaryKey1, primaryKey2 }, query2)
      const result3 = await dataStore.findById({ primaryKey1, primaryKey2 }, query3)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/pk?primaryKey1=pk-1&primaryKey2=pk-1`,
        headers: {},
        body   : undefined
      })

      expect(req2).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/pk?primaryKey1=pk-1&primaryKey2=pk-1`,
        headers: {},
        body   : undefined
      })

      expect(req3).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/pk?primaryKey1=pk-1&primaryKey2=pk-1`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql(fakeResult)
      expect(result2).to.be.eql(fakeResult)
      expect(result3).to.be.eql(fakeResult)
    })

    xit('fails when objectId is invalid', async () => {
      const errorMsg = 'Object Id must be provided and must be a string.'

      await expect(dataStore.findById()).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.findById(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.findById(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.findById(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.findById(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.findById(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.findById(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.findById('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.findById({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.findById([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.findById(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })
  })

})
