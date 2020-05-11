import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forTest, prepareMockRequest } from '../../helpers/sandbox'

describe('<Data> Relations', () => {

  forTest()

  const fakeResult = { foo: 123 }

  const tableName = 'Person'
  const relationName = 'testChildColumn'

  const parent = { objectId: 'parent-id' }

  let dataStore

  beforeEach(() => {
    dataStore = Backendless.Data.of(tableName)
  })

  describe('Load', () => {
    it('loads children', async () => {
      const req1 = prepareMockRequest([{ foo: 1 }, { foo: 2 }, { foo: 3 }])
      const req2 = prepareMockRequest([{ foo: 1 }, { foo: 2 }, { foo: 3 }])

      const result1 = await dataStore.loadRelations(parent, { relationName })
      const result2 = await dataStore.loadRelations(parent.objectId, { relationName })

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/parent-id/${relationName}`,
        headers: {},
        body   : undefined
      })

      expect(req2).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/parent-id/${relationName}`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql([{ foo: 1 }, { foo: 2 }, { foo: 3 }])
      expect(result2).to.be.eql([{ foo: 1 }, { foo: 2 }, { foo: 3 }])
    })

    it('loads instances', async () => {
      const req1 = prepareMockRequest([{ foo: 1 }, { foo: 2 }, { foo: 3 }])
      const req2 = prepareMockRequest([{ foo: 1 }, { foo: 2 }, { foo: 3 }])
      const req3 = prepareMockRequest([{ foo: 1 }, { foo: 2 }, { foo: 3 }])

      class ClassPerson {
      }

      const query1 = Backendless.Data.LoadRelationsQueryBuilder.of(ClassPerson)
      query1.setRelationName(relationName)

      const query2 = new Backendless.Data.LoadRelationsQueryBuilder()
      query2.setRelationModel(ClassPerson)
      query2.setRelationName(relationName)

      const result1 = await dataStore.loadRelations(parent, query1)
      const result2 = await dataStore.loadRelations(parent, query2)
      const result3 = await dataStore.loadRelations(parent, { relationName, relationModel: ClassPerson })

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/${parent.objectId}/${relationName}?pageSize=10`,
        headers: {},
        body   : undefined
      })

      expect(req2).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/${parent.objectId}/${relationName}?pageSize=10`,
        headers: {},
        body   : undefined
      })

      expect(req3).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/${parent.objectId}/${relationName}`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql([{ foo: 1 }, { foo: 2 }, { foo: 3 }])
      expect(result1[0]).to.be.instanceof(ClassPerson)
      expect(result1[1]).to.be.instanceof(ClassPerson)
      expect(result1[2]).to.be.instanceof(ClassPerson)

      expect(result2).to.be.eql([{ foo: 1 }, { foo: 2 }, { foo: 3 }])
      expect(result2[0]).to.be.instanceof(ClassPerson)
      expect(result2[1]).to.be.instanceof(ClassPerson)
      expect(result2[2]).to.be.instanceof(ClassPerson)

      expect(result3).to.be.eql([{ foo: 1 }, { foo: 2 }, { foo: 3 }])
      expect(result3[0]).to.be.instanceof(ClassPerson)
      expect(result3[1]).to.be.instanceof(ClassPerson)
      expect(result3[2]).to.be.instanceof(ClassPerson)
    })

    it('with all query options', async () => {
      const req1 = prepareMockRequest(fakeResult)
      const req2 = prepareMockRequest(fakeResult)
      const req3 = prepareMockRequest(fakeResult)

      const query = new Backendless.Data.LoadRelationsQueryBuilder()

      query
        .setRelationName(relationName)

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

      const query2 = Backendless.Data.LoadRelationsQueryBuilder
        .create()
        .setRelationName(relationName)

      const query3 = {
        relationName,

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

      const result1 = await dataStore.loadRelations(parent, query)
      const result2 = await dataStore.loadRelations(parent.objectId, query2)
      const result3 = await dataStore.loadRelations(parent.objectId, query3)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/${parent.objectId}/${relationName}?pageSize=50&offset=15&property=foo&property=bar&property=prop1&property=prop2&property=prop3&property=prop4&property=prop5&property=prop6&property=prop7&property=prop8&property=prop9&property=*&excludeProps=foo,bar,prop1,prop2,prop3,prop4,prop5,prop6,prop7,prop8&where=age%20%3E%3D%20100&having=age%20%3E%3D%20200&sortBy=created&groupBy=objectId&loadRelations=rel1,rel2,rel3&relationsDepth=3&relationsPageSize=25`,
        headers: {},
        body   : undefined
      })

      expect(req2).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/${parent.objectId}/${relationName}?pageSize=10`,
        headers: {},
        body   : undefined
      })

      expect(req3).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/data/${tableName}/${parent.objectId}/${relationName}?pageSize=30&offset=40&property=prop-1&property=prop-2&excludeProps=prop-3,prop-3&where=test-where&having=test-having&sortBy=test-sortby&groupBy=test-groupby&loadRelations=rel-1,rel-2&relationsDepth=4&relationsPageSize=70`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql(fakeResult)
      expect(result2).to.be.eql(fakeResult)
      expect(result3).to.be.eql(fakeResult)
    })

    it('fails when parentObjectId is invalid', async () => {
      const errorMsg = 'Parent Object Id must be provided and must be a string.'

      await expect(dataStore.loadRelations()).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.loadRelations('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.loadRelations(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.loadRelations(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.loadRelations(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.loadRelations(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.loadRelations(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.loadRelations(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.loadRelations({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.loadRelations(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when relationName is invalid', async () => {
      const errorMsg = 'Relation Name must be provided and must be a string.'

      await expect(dataStore.loadRelations('parent-id', {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.loadRelations('parent-id', { relationName: '' })).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.loadRelations('parent-id', { relationName: false })).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.loadRelations('parent-id', { relationName: true })).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.loadRelations('parent-id', { relationName: null })).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.loadRelations('parent-id', { relationName: undefined })).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.loadRelations('parent-id', { relationName: 0 })).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.loadRelations('parent-id', { relationName: 123 })).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.loadRelations('parent-id', { relationName: {} })).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.loadRelations('parent-id', { relationName: () => ({}) })).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when relationName in LoadRelationsQueryBuilder is invalid', async () => {
      const errorMsg = 'Relation Name must be provided and must be a string.'

      const createQuery = relationName => {
        return new Backendless.Data.LoadRelationsQueryBuilder().setRelationName(relationName)
      }

      await expect(dataStore.loadRelations('parent-id', createQuery())).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.loadRelations('parent-id', createQuery(''))).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.loadRelations('parent-id', createQuery(false))).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.loadRelations('parent-id', createQuery(true))).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.loadRelations('parent-id', createQuery(null))).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.loadRelations('parent-id', createQuery(undefined))).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.loadRelations('parent-id', createQuery(0))).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.loadRelations('parent-id', createQuery(123))).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.loadRelations('parent-id', createQuery({}))).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.loadRelations('parent-id', createQuery([]))).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.loadRelations('parent-id', createQuery(() => ({})))).to.eventually.be.rejectedWith(errorMsg)
    })

  })

  describe('Set Relations', () => {
    it('children as condition', async () => {
      const req1 = prepareMockRequest(fakeResult)

      const result1 = await dataStore.setRelation(parent, relationName, 'foo>123')

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/${tableName}/parent-id/${relationName}?whereClause=foo%3E123`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.equal(fakeResult)
    })

    it('children as objects', async () => {
      const req1 = prepareMockRequest(fakeResult)

      const result1 = await dataStore.setRelation(parent, relationName, [{ objectId: 'id-1' }, { objectId: 'id-2' }, { objectId: 'id-3' }])

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/${tableName}/parent-id/${relationName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : ['id-1', 'id-2', 'id-3']
      })

      expect(result1).to.be.equal(fakeResult)
    })

    it('children as object ids', async () => {
      const req1 = prepareMockRequest(fakeResult)

      const result1 = await dataStore.setRelation(parent, relationName, ['id-1', { objectId: 'id-2' }, 'id-3'])

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/${tableName}/parent-id/${relationName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : ['id-1', 'id-2', 'id-3']
      })

      expect(result1).to.be.equal(fakeResult)
    })

    it('fails when parentId is invalid', async () => {
      const errorMsg = 'Relation Parent must be provided and must be a string or an object with objectId property.'

      await expect(dataStore.setRelation()).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when columnName is invalid', async () => {
      const errorMsg = 'Relation Column Name must be provided and must be a string.'

      await expect(dataStore.setRelation(parent)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, '')).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when children is invalid', async () => {
      const errorMsg = 'Relation Children must be provided and must be a string or a list of objects.'

      await expect(dataStore.setRelation(parent, relationName)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, relationName, '')).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, relationName, false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, relationName, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, relationName, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, relationName, undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, relationName, 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, relationName, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, relationName, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, relationName, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when at least one item is invalid', async () => {
      const errorMsg = 'Child Id must be provided and must be a string.'

      await expect(dataStore.setRelation(parent, relationName, [''])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, relationName, [false])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, relationName, [true])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, relationName, [null])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, relationName, [undefined])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, relationName, [0])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, relationName, [123])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, relationName, [{}])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, relationName, [[]])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, relationName, [() => ({})])).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when at least one item has invalid objectId', async () => {
      const errorMsg = 'Child Id must be provided and must be a string.'

      await expect(dataStore.setRelation(parent, relationName, [{ objectId: 'o' }, { objectId: '' }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, relationName, [{ objectId: 'o' }, { objectId: false }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, relationName, [{ objectId: 'o' }, { objectId: true }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, relationName, [{ objectId: 'o' }, { objectId: null }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, relationName, [{ objectId: 'o' }, { objectId: undefined }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, relationName, [{ objectId: 'o' }, { objectId: 0 }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, relationName, [{ objectId: 'o' }, { objectId: 123 }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, relationName, [{ objectId: 'o' }, { objectId: {} }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, relationName, [{ objectId: 'o' }, { objectId: [] }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.setRelation(parent, relationName, [{ objectId: 'o' }, { objectId: () => ({}) }])).to.eventually.be.rejectedWith(errorMsg)
    })

  })

  describe('Add Relations', () => {
    it('children as condition', async () => {
      const req1 = prepareMockRequest(fakeResult)

      const result1 = await dataStore.addRelation(parent, relationName, 'foo>123')

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/${tableName}/parent-id/${relationName}?whereClause=foo%3E123`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.equal(fakeResult)
    })

    it('children as objects', async () => {
      const req1 = prepareMockRequest(fakeResult)

      const result1 = await dataStore.addRelation(parent, relationName, [{ objectId: 'id-1' }, { objectId: 'id-2' }, { objectId: 'id-3' }])

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/${tableName}/parent-id/${relationName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : ['id-1', 'id-2', 'id-3']
      })

      expect(result1).to.be.equal(fakeResult)
    })

    it('children as object ids', async () => {
      const req1 = prepareMockRequest(fakeResult)

      const result1 = await dataStore.addRelation(parent, relationName, ['id-1', { objectId: 'id-2' }, 'id-3'])

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/${tableName}/parent-id/${relationName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : ['id-1', 'id-2', 'id-3']
      })

      expect(result1).to.be.equal(fakeResult)
    })

    it('fails when parentId is invalid', async () => {
      const errorMsg = 'Relation Parent must be provided and must be a string or an object with objectId property.'

      await expect(dataStore.addRelation()).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when columnName is invalid', async () => {
      const errorMsg = 'Relation Column Name must be provided and must be a string.'

      await expect(dataStore.addRelation(parent)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, '')).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when children is invalid', async () => {
      const errorMsg = 'Relation Children must be provided and must be a string or a list of objects.'

      await expect(dataStore.addRelation(parent, relationName)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, relationName, '')).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, relationName, false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, relationName, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, relationName, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, relationName, undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, relationName, 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, relationName, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, relationName, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, relationName, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when at least one item is invalid', async () => {
      const errorMsg = 'Child Id must be provided and must be a string.'

      await expect(dataStore.addRelation(parent, relationName, [''])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, relationName, [false])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, relationName, [true])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, relationName, [null])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, relationName, [undefined])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, relationName, [0])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, relationName, [123])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, relationName, [{}])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, relationName, [[]])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, relationName, [() => ({})])).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when at least one item has invalid objectId', async () => {
      const errorMsg = 'Child Id must be provided and must be a string.'

      await expect(dataStore.addRelation(parent, relationName, [{ objectId: 'o' }, { objectId: '' }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, relationName, [{ objectId: 'o' }, { objectId: false }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, relationName, [{ objectId: 'o' }, { objectId: true }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, relationName, [{ objectId: 'o' }, { objectId: null }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, relationName, [{ objectId: 'o' }, { objectId: undefined }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, relationName, [{ objectId: 'o' }, { objectId: 0 }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, relationName, [{ objectId: 'o' }, { objectId: 123 }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, relationName, [{ objectId: 'o' }, { objectId: {} }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, relationName, [{ objectId: 'o' }, { objectId: [] }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.addRelation(parent, relationName, [{ objectId: 'o' }, { objectId: () => ({}) }])).to.eventually.be.rejectedWith(errorMsg)
    })

  })

  describe('Delete Relations', () => {
    it('children as condition', async () => {
      const req1 = prepareMockRequest(fakeResult)

      const result1 = await dataStore.deleteRelation(parent, relationName, 'foo>123')

      expect(req1).to.deep.include({
        method : 'DELETE',
        path   : `${APP_PATH}/data/${tableName}/parent-id/${relationName}?whereClause=foo%3E123`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.equal(fakeResult)
    })

    it('children as objects', async () => {
      const req1 = prepareMockRequest(fakeResult)

      const result1 = await dataStore.deleteRelation(parent, relationName, [{ objectId: 'id-1' }, { objectId: 'id-2' }, { objectId: 'id-3' }])

      expect(req1).to.deep.include({
        method : 'DELETE',
        path   : `${APP_PATH}/data/${tableName}/parent-id/${relationName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : ['id-1', 'id-2', 'id-3']
      })

      expect(result1).to.be.equal(fakeResult)
    })

    it('children as object ids', async () => {
      const req1 = prepareMockRequest(fakeResult)

      const result1 = await dataStore.deleteRelation(parent, relationName, ['id-1', { objectId: 'id-2' }, 'id-3'])

      expect(req1).to.deep.include({
        method : 'DELETE',
        path   : `${APP_PATH}/data/${tableName}/parent-id/${relationName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : ['id-1', 'id-2', 'id-3']
      })

      expect(result1).to.be.equal(fakeResult)
    })

    it('fails when parentId is invalid', async () => {
      const errorMsg = 'Relation Parent must be provided and must be a string or an object with objectId property.'

      await expect(dataStore.deleteRelation()).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when columnName is invalid', async () => {
      const errorMsg = 'Relation Column Name must be provided and must be a string.'

      await expect(dataStore.deleteRelation(parent)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, '')).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when children is invalid', async () => {
      const errorMsg = 'Relation Children must be provided and must be a string or a list of objects.'

      await expect(dataStore.deleteRelation(parent, relationName)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, relationName, '')).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, relationName, false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, relationName, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, relationName, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, relationName, undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, relationName, 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, relationName, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, relationName, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, relationName, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when at least one item is invalid', async () => {
      const errorMsg = 'Child Id must be provided and must be a string.'

      await expect(dataStore.deleteRelation(parent, relationName, [''])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, relationName, [false])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, relationName, [true])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, relationName, [null])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, relationName, [undefined])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, relationName, [0])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, relationName, [123])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, relationName, [{}])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, relationName, [[]])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, relationName, [() => ({})])).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when at least one item has invalid objectId', async () => {
      const errorMsg = 'Child Id must be provided and must be a string.'

      await expect(dataStore.deleteRelation(parent, relationName, [{ objectId: 'o' }, { objectId: '' }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, relationName, [{ objectId: 'o' }, { objectId: false }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, relationName, [{ objectId: 'o' }, { objectId: true }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, relationName, [{ objectId: 'o' }, { objectId: null }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, relationName, [{ objectId: 'o' }, { objectId: undefined }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, relationName, [{ objectId: 'o' }, { objectId: 0 }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, relationName, [{ objectId: 'o' }, { objectId: 123 }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, relationName, [{ objectId: 'o' }, { objectId: {} }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, relationName, [{ objectId: 'o' }, { objectId: [] }])).to.eventually.be.rejectedWith(errorMsg)
      await expect(dataStore.deleteRelation(parent, relationName, [{ objectId: 'o' }, { objectId: () => ({}) }])).to.eventually.be.rejectedWith(errorMsg)
    })

  })

})
