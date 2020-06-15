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
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql(fakeResult)
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

      const result1 = await dataStore.findById(objectId, query)
      const result2 = await dataStore.findById(objectId, query2)
      const result3 = await dataStore.findById(objectId, query3)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/${objectId}?pageSize=50&offset=15&property=foo&property=bar&property=prop1&property=prop2&property=prop3&property=prop4&property=prop5&property=prop6&property=prop7&property=prop8&property=prop9&property=*&excludeProps=foo,bar,prop1,prop2,prop3,prop4,prop5,prop6,prop7,prop8&where=age%20%3E%3D%20100&having=age%20%3E%3D%20200&sortBy=created&groupBy=objectId&loadRelations=rel1,rel2,rel3&relationsDepth=3&relationsPageSize=25`,
        headers: {},
        body   : undefined
      })

      expect(req2).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/${objectId}?pageSize=10`,
        headers: {},
        body   : undefined
      })

      expect(req3).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/${objectId}?pageSize=30&offset=40&property=prop-1&property=prop-2&excludeProps=prop-3,prop-3&where=test-where&having=test-having&sortBy=test-sortby&groupBy=test-groupby&loadRelations=rel-1,rel-2&relationsDepth=4&relationsPageSize=70`,
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
      const req1 = prepareMockRequest(fakeResult)

      const result1 = await dataStore.findFirst()

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/first`,
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

      const result1 = await dataStore.findFirst(query)
      const result2 = await dataStore.findFirst(query2)
      const result3 = await dataStore.findFirst(query3)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/first?pageSize=50&offset=15&property=foo&property=bar&property=prop1&property=prop2&property=prop3&property=prop4&property=prop5&property=prop6&property=prop7&property=prop8&property=prop9&property=*&excludeProps=foo,bar,prop1,prop2,prop3,prop4,prop5,prop6,prop7,prop8&where=age%20%3E%3D%20100&having=age%20%3E%3D%20200&sortBy=created&groupBy=objectId&loadRelations=rel1,rel2,rel3&relationsDepth=3&relationsPageSize=25`,
        headers: {},
        body   : undefined
      })

      expect(req2).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/first?pageSize=10`,
        headers: {},
        body   : undefined
      })

      expect(req3).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/first?pageSize=30&offset=40&property=prop-1&property=prop-2&excludeProps=prop-3,prop-3&where=test-where&having=test-having&sortBy=test-sortby&groupBy=test-groupby&loadRelations=rel-1,rel-2&relationsDepth=4&relationsPageSize=70`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql(fakeResult)
      expect(result2).to.be.eql(fakeResult)
      expect(result3).to.be.eql(fakeResult)
    })

  })

  describe('FindLast', () => {
    it('without query', async () => {
      const req1 = prepareMockRequest(fakeResult)

      const result1 = await dataStore.findLast()

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/last`,
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

      const result1 = await dataStore.findLast(query)
      const result2 = await dataStore.findLast(query2)
      const result3 = await dataStore.findLast(query3)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/last?pageSize=50&offset=15&property=foo&property=bar&property=prop1&property=prop2&property=prop3&property=prop4&property=prop5&property=prop6&property=prop7&property=prop8&property=prop9&property=*&excludeProps=foo,bar,prop1,prop2,prop3,prop4,prop5,prop6,prop7,prop8&where=age%20%3E%3D%20100&having=age%20%3E%3D%20200&sortBy=created&groupBy=objectId&loadRelations=rel1,rel2,rel3&relationsDepth=3&relationsPageSize=25`,
        headers: {},
        body   : undefined
      })

      expect(req2).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/last?pageSize=10`,
        headers: {},
        body   : undefined
      })

      expect(req3).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/last?pageSize=30&offset=40&property=prop-1&property=prop-2&excludeProps=prop-3,prop-3&where=test-where&having=test-having&sortBy=test-sortby&groupBy=test-groupby&loadRelations=rel-1,rel-2&relationsDepth=4&relationsPageSize=70`,
        headers: {},
        body   : undefined
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
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/count`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.equal(123)
    })

    it('with string condition', async () => {
      const req1 = prepareMockRequest(123)

      const result1 = await dataStore.getObjectCount('foo>123')

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/count?where=foo%3E123`,
        headers: {},
        body   : undefined
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
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/count`,
        headers: {},
        body   : undefined
      })

      expect(req2).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/count?where=foo%3E123`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.equal(111)
      expect(result2).to.be.equal(222)
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
