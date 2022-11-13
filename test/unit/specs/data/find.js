import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forTest, prepareMockRequest } from '../../helpers/sandbox'

describe('<Data> Find', function() {

  forTest(this)

  const fakeResult = { foo: 123 }

  const tableName = 'Person'
  const objectId = 'test-object-id'

  let dataStore
  let query

  beforeEach(() => {
    dataStore = Backendless.Data.of(tableName)

    query = Backendless.Data.QueryBuilder.create()
  })

  describe('Find', () => {
    it('without query', async () => {
      const req1 = prepareMockRequest(fakeResult)

      const result1 = await dataStore.find()

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/${tableName}/find`,
        headers: { 'Content-Type': 'application/json' },
        body   : {}
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

        .setDistinct(false)
        .setDistinct(true)

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

      const result1 = await dataStore.find(query)
      const result2 = await dataStore.find(query2)
      const result3 = await dataStore.find(query3)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/${tableName}/find`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          pageSize         : 50,
          offset           : 15,
          excludeProps     : 'foo,bar,prop1,prop2,prop3,prop4,prop5,prop6,prop7,prop8',
          where            : 'age >= 100',
          having           : 'age >= 200',
          sortBy           : 'created',
          groupBy          : 'objectId',
          relationsDepth   : 3,
          relationsPageSize: 25,
          distinct         : true,
          props            : 'foo,bar,prop1,prop2,prop3,prop4,prop5,prop6,prop7,prop8,prop9,*',
          loadRelations    : 'rel1,rel2,rel3'
        }
      })

      expect(req2).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/${tableName}/find`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          pageSize: 10,
          offset  : 0,
          distinct: false
        }
      })

      expect(req3).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/${tableName}/find`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          pageSize         : 30,
          offset           : 40,
          excludeProps     : 'prop-3,prop-3',
          where            : 'test-where',
          having           : 'test-having',
          sortBy           : 'test-sortby',
          groupBy          : 'test-groupby',
          relationsDepth   : 4,
          relationsPageSize: 70,
          props            : 'prop-1,prop-2',
          loadRelations    : 'rel-1,rel-2'
        }
      })

      expect(result1).to.be.eql(fakeResult)
      expect(result2).to.be.eql(fakeResult)
      expect(result3).to.be.eql(fakeResult)
    })

  })

  describe('FindById', () => {
    it('without query', async () => {
      const req1 = prepareMockRequest(fakeResult)

      const result1 = await dataStore.findById(objectId)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/${objectId}`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql(fakeResult)
    })

    it('with specific symbols in id', async () => {
      const req1 = prepareMockRequest(fakeResult)
      const req2 = prepareMockRequest(fakeResult)
      const req3 = prepareMockRequest(fakeResult)
      const req4 = prepareMockRequest(fakeResult)
      const req5 = prepareMockRequest(fakeResult)
      const req6 = prepareMockRequest(fakeResult)
      const req7 = prepareMockRequest(fakeResult)

      const result1 = await dataStore.findById('foo bar')
      const result2 = await dataStore.findById('foo:bar')
      const result3 = await dataStore.findById('foo@bar')
      const result4 = await dataStore.findById('foo/bar')
      const result5 = await dataStore.findById('foo%bar')
      const result6 = await dataStore.findById('foo"bar')
      const result7 = await dataStore.findById('foo_абв_bar')

      function buildPayload(objectIdInPath){
        return {
          method : 'GET',
          path   : `${APP_PATH}/data/${tableName}/${objectIdInPath}`,
          headers: {},
          body   : undefined
        }
      }

      expect(req1).to.deep.include(buildPayload('foo%20bar'))
      expect(req2).to.deep.include(buildPayload('foo%3Abar'))
      expect(req3).to.deep.include(buildPayload('foo%40bar'))
      expect(req4).to.deep.include(buildPayload('foo%2Fbar'))
      expect(req5).to.deep.include(buildPayload('foo%25bar'))
      expect(req6).to.deep.include(buildPayload('foo%22bar'))
      expect(req7).to.deep.include(buildPayload('foo_%D0%B0%D0%B1%D0%B2_bar'))

      expect(result1).to.be.eql(fakeResult)
      expect(result2).to.be.eql(fakeResult)
      expect(result3).to.be.eql(fakeResult)
      expect(result4).to.be.eql(fakeResult)
      expect(result5).to.be.eql(fakeResult)
      expect(result6).to.be.eql(fakeResult)
      expect(result7).to.be.eql(fakeResult)
    })

    it('with object', async () => {
      const req1 = prepareMockRequest(fakeResult)

      const result1 = await dataStore.findById({ objectId })

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/pk?objectId=${objectId}`,
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

        .setDistinct(false)
        .setDistinct(true)

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

      const result1 = await dataStore.findById(objectId, query)
      const result2 = await dataStore.findById(objectId, query2)
      const result3 = await dataStore.findById(objectId, query3)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/${objectId}?property=foo&property=bar&property=prop1&property=prop2&property=prop3&property=prop4&property=prop5&property=prop6&property=prop7&property=prop8&property=prop9&property=*&excludeProps=foo,bar,prop1,prop2,prop3,prop4,prop5,prop6,prop7,prop8&where=age%20%3E%3D%20100&having=age%20%3E%3D%20200&sortBy=created&groupBy=objectId&loadRelations=rel1,rel2,rel3&relationsDepth=3&relationsPageSize=25&distinct=true`,
        headers: {},
        body   : undefined
      })

      expect(req2).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/${objectId}`,
        headers: {},
        body   : undefined
      })

      expect(req3).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/${objectId}?property=prop-1&property=prop-2&excludeProps=prop-3,prop-3&where=test-where&having=test-having&sortBy=test-sortby&groupBy=test-groupby&loadRelations=rel-1,rel-2&relationsDepth=4&relationsPageSize=70`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql(fakeResult)
      expect(result2).to.be.eql(fakeResult)
      expect(result3).to.be.eql(fakeResult)
    })

    it('fails when objectId is invalid', async () => {
      const errorMsg = 'Object Id must be provided and must be a string or an object of primary keys.'

      await expect(dataStore.findById()).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.findById(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.findById(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.findById(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.findById(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.findById(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.findById(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.findById('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.findById([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.findById(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })
  })

  describe('FindFirst', () => {
    it('without query', async () => {
      const req1 = prepareMockRequest([fakeResult])

      const result1 = await dataStore.findFirst()

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/${tableName}/find`,
        headers: { 'Content-Type': 'application/json' },
        body   : { pageSize: 1, offset: 0, sortBy: 'created asc' }
      })

      expect(result1).to.be.eql(fakeResult)
    })

    it('with all query options', async () => {
      const req1 = prepareMockRequest([fakeResult])
      const req2 = prepareMockRequest([fakeResult])
      const req3 = prepareMockRequest([fakeResult])

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

        .setDistinct(false)
        .setDistinct(true)

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

      const result1 = await dataStore.findFirst(query)
      const result2 = await dataStore.findFirst(query2)
      const result3 = await dataStore.findFirst(query3)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/${tableName}/find`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          pageSize         : 1,
          offset           : 0,
          excludeProps     : 'foo,bar,prop1,prop2,prop3,prop4,prop5,prop6,prop7,prop8',
          where            : 'age >= 100',
          having           : 'age >= 200',
          sortBy           : 'created',
          groupBy          : 'objectId',
          relationsDepth   : 3,
          relationsPageSize: 25,
          distinct         : true,
          props            : 'foo,bar,prop1,prop2,prop3,prop4,prop5,prop6,prop7,prop8,prop9,*',
          loadRelations    : 'rel1,rel2,rel3'
        }
      })

      expect(req2).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/${tableName}/find`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          pageSize: 1,
          offset  : 0,
          distinct: false,
          sortBy  : 'created asc'
        }
      })

      expect(req3).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/${tableName}/find`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          pageSize         : 1,
          offset           : 0,
          excludeProps     : 'prop-3,prop-3',
          where            : 'test-where',
          having           : 'test-having',
          sortBy           : 'test-sortby',
          groupBy          : 'test-groupby',
          relationsDepth   : 4,
          relationsPageSize: 70,
          props            : 'prop-1,prop-2',
          loadRelations    : 'rel-1,rel-2'
        }
      })

      expect(result1).to.be.eql(fakeResult)
      expect(result2).to.be.eql(fakeResult)
      expect(result3).to.be.eql(fakeResult)
    })

  })

  describe('FindLast', () => {
    it('without query', async () => {
      const req1 = prepareMockRequest([fakeResult])

      const result1 = await dataStore.findLast()

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/${tableName}/find`,
        headers: { 'Content-Type': 'application/json' },
        body   : { pageSize: 1, offset: 0, sortBy: 'created desc' }
      })

      expect(result1).to.be.eql(fakeResult)
    })

    it('with all query options', async () => {
      const req1 = prepareMockRequest([fakeResult])
      const req2 = prepareMockRequest([fakeResult])
      const req3 = prepareMockRequest([fakeResult])

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

        .setDistinct(false)
        .setDistinct(true)

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

      const result1 = await dataStore.findLast(query)
      const result2 = await dataStore.findLast(query2)
      const result3 = await dataStore.findLast(query3)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/${tableName}/find`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          pageSize         : 1,
          offset           : 0,
          excludeProps     : 'foo,bar,prop1,prop2,prop3,prop4,prop5,prop6,prop7,prop8',
          where            : 'age >= 100',
          having           : 'age >= 200',
          sortBy           : 'created',
          groupBy          : 'objectId',
          relationsDepth   : 3,
          relationsPageSize: 25,
          distinct         : true,
          props            : 'foo,bar,prop1,prop2,prop3,prop4,prop5,prop6,prop7,prop8,prop9,*',
          loadRelations    : 'rel1,rel2,rel3'
        }
      })

      expect(req2).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/${tableName}/find`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          pageSize: 1,
          offset  : 0,
          distinct: false,
          sortBy  : 'created desc'
        }
      })

      expect(req3).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/${tableName}/find`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          pageSize         : 1,
          offset           : 0,
          excludeProps     : 'prop-3,prop-3',
          where            : 'test-where',
          having           : 'test-having',
          sortBy           : 'test-sortby',
          groupBy          : 'test-groupby',
          relationsDepth   : 4,
          relationsPageSize: 70,
          props            : 'prop-1,prop-2',
          loadRelations    : 'rel-1,rel-2'
        }
      })

      expect(result1).to.be.eql(fakeResult)
      expect(result2).to.be.eql(fakeResult)
      expect(result3).to.be.eql(fakeResult)
    })

  })

  describe('Count', () => {
    it('without condition', async () => {
      const req1 = prepareMockRequest(123)

      const result1 = await dataStore.getObjectCount()

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/${tableName}/count`,
        headers: {
          'Content-Type': 'application/json'
        },
        body   : {}
      })

      expect(result1).to.be.equal(123)
    })

    it('with string condition', async () => {
      const req1 = prepareMockRequest(123)

      const result1 = await dataStore.getObjectCount('foo>123')

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/${tableName}/count`,
        headers: {
          'Content-Type': 'application/json'
        },
        body   : {
          where: 'foo>123'
        }
      })

      expect(result1).to.be.equal(123)
    })

    it('with DataQueryBuilder condition', async () => {
      const req1 = prepareMockRequest(111)
      const req2 = prepareMockRequest(222)

      const query1 = Backendless.Data.QueryBuilder.create()
      const query2 = Backendless.Data.QueryBuilder.create()

      query2.setPageSize(30)
      query2.setOffset(60)
      query2.setWhereClause('foo>123')

      const result1 = await dataStore.getObjectCount(query1)
      const result2 = await dataStore.getObjectCount(query2)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/${tableName}/count`,
        headers: {
          'Content-Type': 'application/json'
        },
        body   : {}
      })

      expect(req2).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/${tableName}/count`,
        headers: {
          'Content-Type': 'application/json'
        },
        body   : {
          where: 'foo>123'
        }
      })

      expect(result1).to.be.equal(111)
      expect(result2).to.be.equal(222)
    })

    it('with distinct ', async () => {
      const req1 = prepareMockRequest(2)
      const req2 = prepareMockRequest(3)
      const req3 = prepareMockRequest(4)

      const query1 = Backendless.Data.QueryBuilder.create()
      const query2 = Backendless.Data.QueryBuilder.create()
      const query3 = Backendless.Data.QueryBuilder.create()

      query1.setDistinct(true)
      query1.setWhereClause('foo>123')

      query2.setDistinct(false)
      query2.setWhereClause('bar>123')

      query3.setWhereClause('buz>123')

      const result1 = await dataStore.getObjectCount(query1)
      const result2 = await dataStore.getObjectCount(query2)
      const result3 = await dataStore.getObjectCount(query3)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/${tableName}/count`,
        headers: {
          'Content-Type': 'application/json'
        },
        body   : {
          where   : 'foo>123',
          distinct: true
        }
      })

      expect(req2).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/${tableName}/count`,
        headers: {
          'Content-Type': 'application/json'
        },
        body   : {
          where: 'bar>123'
        }
      })

      expect(req3).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/${tableName}/count`,
        headers: {
          'Content-Type': 'application/json'
        },
        body   : {
          where: 'buz>123'
        }
      })

      expect(result1).to.be.equal(2)
      expect(result2).to.be.equal(3)
      expect(result3).to.be.equal(4)
    })

    it('fails when at least one item is invalid', async () => {
      const errorMsg = 'Condition must be a string or an instance of DataQueryBuilder.'

      await expect(dataStore.getObjectCount(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.getObjectCount(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.getObjectCount({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.getObjectCount([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.getObjectCount(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })
  })

})
