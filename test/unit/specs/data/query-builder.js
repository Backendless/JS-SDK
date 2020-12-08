import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forTest } from '../../helpers/sandbox'

describe('<Data> Query Builder', function() {

  forTest(this)

  let query

  beforeEach(() => {
    query = Backendless.Data.QueryBuilder.create()
  })

  it('should has default values', async () => {
    expect(query.getPageSize()).to.be.equal(10)
    expect(query.getOffset()).to.be.equal(0)
  })

  it('should set page size', async () => {
    query.setPageSize(123)

    expect(query.getPageSize()).to.be.eql(123)

    query.setPageSize(555)

    expect(query.getPageSize()).to.be.eql(555)
  })

  it('should set page offset', async () => {
    query.setOffset(123)

    expect(query.getOffset()).to.be.eql(123)

    query.setOffset(555)

    expect(query.getOffset()).to.be.eql(555)
  })

  it('should prepare next/prev page', async () => {
    query.prepareNextPage()

    expect(query.getOffset()).to.be.equal(10)

    query.prepareNextPage()

    expect(query.getOffset()).to.be.equal(20)

    query.prepareNextPage()

    expect(query.getOffset()).to.be.equal(30)

    query.setPageSize(15)
    query.preparePreviousPage()

    expect(query.getOffset()).to.be.equal(15)

    query.preparePreviousPage()

    expect(query.getOffset()).to.be.equal(0)

    query.preparePreviousPage()

    expect(query.getOffset()).to.be.equal(0)
  })

  it('should set properties', async () => {
    query.setProperties('p1')

    expect(query.getProperties()).to.be.eql(['p1'])

    query.setProperties(['p2', 'p3'])

    expect(query.getProperties()).to.be.eql(['p2', 'p3'])
  })

  it('should add properties', async () => {
    query.addProperty('p1')

    expect(query.getProperties()).to.be.eql(['p1'])

    query.addProperties(['p2', 'p3'])

    expect(query.getProperties()).to.be.eql(['p1', 'p2', 'p3'])

    query.addProperties('p4', 'p5', ['p6', 'p7'])

    expect(query.getProperties()).to.be.eql(['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'])

    query.addAllProperties()

    expect(query.getProperties()).to.be.eql(['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', '*'])
  })

  it('should add exclude properties', async () => {
    query.excludeProperty('p1')

    expect(query.getExcludeProperties()).to.be.eql(['p1'])

    query.excludeProperties(['p2', 'p3'])

    expect(query.getExcludeProperties()).to.be.eql(['p1', 'p2', 'p3'])

    query.excludeProperties('p4', 'p5', ['p6', 'p7'])

    expect(query.getExcludeProperties()).to.be.eql(['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'])
  })

  it('should set whereClause', async () => {
    query.setWhereClause('w1')

    expect(query.getWhereClause()).to.be.equal('w1')

    query.setWhereClause('w2')

    expect(query.getWhereClause()).to.be.equal('w2')
  })

  it('should set havingClause', async () => {
    query.setHavingClause('h1')

    expect(query.getHavingClause()).to.be.equal('h1')

    query.setHavingClause('h2')

    expect(query.getHavingClause()).to.be.equal('h2')
  })

  it('should set sortBy', async () => {
    query.setSortBy('s1')

    expect(query.getSortBy()).to.be.eql(['s1'])

    query.setSortBy(['s2'])

    expect(query.getSortBy()).to.be.eql(['s2'])
  })

  it('should set groupBy', async () => {
    query.setGroupBy('g1')

    expect(query.getGroupBy()).to.be.eql(['g1'])

    query.setGroupBy(['g2'])

    expect(query.getGroupBy()).to.be.eql(['g2'])
  })

  it('should add relation', async () => {
    query.addRelated('p1')

    expect(query.getRelated()).to.be.eql(['p1'])

    query.setRelated(['p2', 'p3'])

    expect(query.getRelated()).to.be.eql(['p2', 'p3'])

    query.addRelated(['p4', 'p5', 'p6', 'p7'])

    expect(query.getRelated()).to.be.eql(['p2', 'p3', 'p4', 'p5', 'p6', 'p7'])
  })

  it('should set relations depth', async () => {
    query.setRelationsDepth(123)

    expect(query.getRelationsDepth()).to.be.eql(123)

    query.setRelationsDepth(555)

    expect(query.getRelationsDepth()).to.be.eql(555)
  })

  it('should set relations page size', async () => {
    query.setRelationsPageSize(123)

    expect(query.getRelationsPageSize()).to.be.eql(123)

    query.setRelationsPageSize(555)

    expect(query.getRelationsPageSize()).to.be.eql(555)
  })

  it('should set distinct', async () => {
    query.setDistinct(true)

    expect(query.getDistinct()).to.eql(true)

    query.setDistinct(false)

    expect(query.getDistinct()).to.eql(false)
  })

  it('should return query object', async () => {
    query.setPageSize(111)
    query.setOffset(222)
    query.setProperties(['p1', 'p2'])
    query.excludeProperties(['e1', 'e2'])
    query.setWhereClause('w1')
    query.setHavingClause('h1')
    query.setSortBy('s1')
    query.setGroupBy('g1')
    query.setRelated('r1')
    query.setRelationsDepth(123)
    query.setRelationsPageSize(123)
    query.setDistinct(true)

    expect(query.toJSON()).to.be.eql({
      'excludeProps'     : ['e1', 'e2'],
      'groupBy'          : ['g1'],
      'having'           : 'h1',
      'offset'           : 222,
      'pageSize'         : 111,
      'properties'       : ['p1', 'p2'],
      'relations'        : ['r1'],
      'relationsDepth'   : 123,
      'relationsPageSize': 123,
      'sortBy'           : ['s1'],
      'where'            : 'w1',
      'distinct'         : true,
    })
  })

  it('should return query object for find via post', async () => {
    query.setPageSize(111)
    query.setOffset(222)
    query.setProperties(['p1', 'p2'])
    query.excludeProperties(['e1', 'e2'])
    query.setWhereClause('w1')
    query.setHavingClause('h1')
    query.setSortBy(['s1 asc', 's2 desc'])
    query.setGroupBy('g1')
    query.setRelated('r1')
    query.setRelationsDepth(123)
    query.setRelationsPageSize(123)

    expect(Backendless.DataQueryBuilder.toRequestBody(query)).to.be.eql({
      'excludeProps'     : 'e1,e2',
      'groupBy'          : 'g1',
      'having'           : 'h1',
      'offset'           : 222,
      'pageSize'         : 111,
      'props'            : 'p1,p2',
      'loadRelations'    : 'r1',
      'relationsDepth'   : 123,
      'relationsPageSize': 123,
      'sortBy'           : 's1 asc,s2 desc',
      'where'            : 'w1',
    })
  })

  it('fails when pageSize is invalid', function() {
    const errorMsg = 'Page size must be a positive value.'

    expect(() => query.setPageSize(0)).to.throw(errorMsg)
    expect(() => query.setPageSize(-1)).to.throw(errorMsg)
  })

  it('fails when offset is invalid', function() {
    const errorMsg = 'Offset cannot have a negative value.'

    expect(() => query.setOffset(-1)).to.throw(errorMsg)
  })

  describe('Query String', () => {
    it('should return undefined', () => {
      expect(Backendless.Data.QueryBuilder.toQueryString()).to.be.equal(undefined)
      expect(Backendless.Data.QueryBuilder.toQueryString(null)).to.be.equal(undefined)
    })

    it('pageSize', () => {
      const queryString1 = Backendless.Data.QueryBuilder.toQueryString({ pageSize: 123 })
      const queryString2 = Backendless.Data.QueryBuilder.toQueryString({ pageSize: 0 })
      const queryString3 = Backendless.Data.QueryBuilder.toQueryString({ pageSize: -10 })

      query.setPageSize(200)

      const queryString4 = Backendless.Data.QueryBuilder.toQueryString(query)

      expect(queryString1).to.be.equal('pageSize=123')
      expect(queryString2).to.be.equal('')
      expect(queryString3).to.be.equal('')
      expect(queryString4).to.be.equal('pageSize=200')
    })

    it('pageOffset', () => {
      const queryString1 = Backendless.Data.QueryBuilder.toQueryString({ offset: 123 })
      const queryString2 = Backendless.Data.QueryBuilder.toQueryString({ offset: 0 })
      const queryString3 = Backendless.Data.QueryBuilder.toQueryString({ offset: -10 })

      query.setOffset(200)

      const queryString4 = Backendless.Data.QueryBuilder.toQueryString(query)

      expect(queryString1).to.be.equal('offset=123')
      expect(queryString2).to.be.equal('')
      expect(queryString3).to.be.equal('')
      expect(queryString4).to.be.equal('pageSize=10&offset=200')
    })

    it('properties', () => {
      const queryString1 = Backendless.Data.QueryBuilder.toQueryString({ properties: 'p1' })
      const queryString2 = Backendless.Data.QueryBuilder.toQueryString({ properties: {p2:'p2'} })
      const queryString3 = Backendless.Data.QueryBuilder.toQueryString({ properties: true })
      const queryString4 = Backendless.Data.QueryBuilder.toQueryString({ properties: [] })
      const queryString5 = Backendless.Data.QueryBuilder.toQueryString({ properties: ['p3', 'sum(col) as foo'] })
      const queryString6 = Backendless.Data.QueryBuilder.toQueryString({ properties: null })

      query.setProperties('p6')

      const queryString7 = Backendless.Data.QueryBuilder.toQueryString(query)

      expect(queryString1).to.be.equal('')
      expect(queryString2).to.be.equal('')
      expect(queryString3).to.be.equal('')
      expect(queryString4).to.be.equal('')
      expect(queryString5).to.be.equal('property=p3&property=sum(col)%20as%20foo')
      expect(queryString6).to.be.equal('')
      expect(queryString7).to.be.equal('pageSize=10&property=p6')
    })

    it('excludeProps', () => {
      const queryString1 = Backendless.Data.QueryBuilder.toQueryString({ excludeProps: 'p1' })
      const queryString2 = Backendless.Data.QueryBuilder.toQueryString({ excludeProps: {p2:'p2'} })
      const queryString3 = Backendless.Data.QueryBuilder.toQueryString({ excludeProps: true })
      const queryString4 = Backendless.Data.QueryBuilder.toQueryString({ excludeProps: [] })
      const queryString5 = Backendless.Data.QueryBuilder.toQueryString({ excludeProps: ['p3', 'sum(col) as foo'] })
      const queryString6 = Backendless.Data.QueryBuilder.toQueryString({ excludeProps: null })

      query.excludeProperties('p6')

      const queryString7 = Backendless.Data.QueryBuilder.toQueryString(query)

      expect(queryString1).to.be.equal('')
      expect(queryString2).to.be.equal('')
      expect(queryString3).to.be.equal('')
      expect(queryString4).to.be.equal('')
      expect(queryString5).to.be.equal('excludeProps=p3,sum(col)%20as%20foo')
      expect(queryString6).to.be.equal('')
      expect(queryString7).to.be.equal('pageSize=10&excludeProps=p6')
    })

    it('where', () => {
      const queryString1 = Backendless.Data.QueryBuilder.toQueryString({ where: null })
      const queryString2 = Backendless.Data.QueryBuilder.toQueryString({ where: 123 })
      const queryString3 = Backendless.Data.QueryBuilder.toQueryString({ where: 0 })
      const queryString4 = Backendless.Data.QueryBuilder.toQueryString({ where: 'foo > bar' })
      const queryString5 = Backendless.Data.QueryBuilder.toQueryString({ where: 'bar = \'abc\'' })

      query.setWhereClause('bar[\'abc\'] = 123')

      const queryString6 = Backendless.Data.QueryBuilder.toQueryString(query)

      expect(queryString1).to.be.equal('')
      expect(queryString2).to.be.equal('where=123')
      expect(queryString3).to.be.equal('')
      expect(queryString4).to.be.equal('where=foo%20%3E%20bar')
      expect(queryString5).to.be.equal('where=bar%20%3D%20\'abc\'')
      expect(queryString6).to.be.equal('pageSize=10&where=bar%5B\'abc\'%5D%20%3D%20123')
    })

    it('having', () => {
      const queryString1 = Backendless.Data.QueryBuilder.toQueryString({ having: null })
      const queryString2 = Backendless.Data.QueryBuilder.toQueryString({ having: 123 })
      const queryString3 = Backendless.Data.QueryBuilder.toQueryString({ having: 0 })
      const queryString4 = Backendless.Data.QueryBuilder.toQueryString({ having: 'foo > bar' })
      const queryString5 = Backendless.Data.QueryBuilder.toQueryString({ having: 'bar = \'abc\'' })

      query.setHavingClause('bar[\'abc\'] = 123')

      const queryString6 = Backendless.Data.QueryBuilder.toQueryString(query)

      expect(queryString1).to.be.equal('')
      expect(queryString2).to.be.equal('having=123')
      expect(queryString3).to.be.equal('')
      expect(queryString4).to.be.equal('having=foo%20%3E%20bar')
      expect(queryString5).to.be.equal('having=bar%20%3D%20\'abc\'')
      expect(queryString6).to.be.equal('pageSize=10&having=bar%5B\'abc\'%5D%20%3D%20123')
    })

    it('sortBy', () => {
      const queryString1 = Backendless.Data.QueryBuilder.toQueryString({ sortBy: null })
      const queryString2 = Backendless.Data.QueryBuilder.toQueryString({ sortBy: 123 })
      const queryString3 = Backendless.Data.QueryBuilder.toQueryString({ sortBy: 0 })
      const queryString4 = Backendless.Data.QueryBuilder.toQueryString({ sortBy: 'foo desc' })
      const queryString5 = Backendless.Data.QueryBuilder.toQueryString({ sortBy: ['bar asc', 'test'] })

      query.setSortBy('bar!asc')

      const queryString6 = Backendless.Data.QueryBuilder.toQueryString(query)

      expect(queryString1).to.be.equal('')
      expect(queryString2).to.be.equal('sortBy=123')
      expect(queryString3).to.be.equal('')
      expect(queryString4).to.be.equal('sortBy=foo%20desc')
      expect(queryString5).to.be.equal('sortBy=bar%20asc,test')
      expect(queryString6).to.be.equal('pageSize=10&sortBy=bar!asc')
    })

    it('groupBy', () => {
      const queryString1 = Backendless.Data.QueryBuilder.toQueryString({ groupBy: null })
      const queryString2 = Backendless.Data.QueryBuilder.toQueryString({ groupBy: 123 })
      const queryString3 = Backendless.Data.QueryBuilder.toQueryString({ groupBy: 0 })
      const queryString4 = Backendless.Data.QueryBuilder.toQueryString({ groupBy: 'foo desc' })
      const queryString5 = Backendless.Data.QueryBuilder.toQueryString({ groupBy: ['bar asc', 'test'] })

      query.setGroupBy('bar!asc')

      const queryString6 = Backendless.Data.QueryBuilder.toQueryString(query)

      expect(queryString1).to.be.equal('')
      expect(queryString2).to.be.equal('groupBy=123')
      expect(queryString3).to.be.equal('')
      expect(queryString4).to.be.equal('groupBy=foo%20desc')
      expect(queryString5).to.be.equal('groupBy=bar%20asc,test')
      expect(queryString6).to.be.equal('pageSize=10&groupBy=bar!asc')
    })

    it('loadRelations', () => {
      const queryString1 = Backendless.Data.QueryBuilder.toQueryString({ relations: null })
      const queryString2 = Backendless.Data.QueryBuilder.toQueryString({ relations: 123 })
      const queryString3 = Backendless.Data.QueryBuilder.toQueryString({ relations: 0 })
      const queryString4 = Backendless.Data.QueryBuilder.toQueryString({ relations: 'foo' })
      const queryString5 = Backendless.Data.QueryBuilder.toQueryString({ relations: ['bar', 'test'] })
      const queryString6 = Backendless.Data.QueryBuilder.toQueryString({ relations: [] })

      query.setRelated('bar')

      const queryString7 = Backendless.Data.QueryBuilder.toQueryString(query)

      expect(queryString1).to.be.equal('')
      expect(queryString2).to.be.equal('')
      expect(queryString3).to.be.equal('')
      expect(queryString4).to.be.equal('')
      expect(queryString5).to.be.equal('loadRelations=bar,test')
      expect(queryString6).to.be.equal('loadRelations=*')
      expect(queryString7).to.be.equal('pageSize=10&loadRelations=bar')
    })

    it('relationsDepth', () => {
      const queryString1 = Backendless.Data.QueryBuilder.toQueryString({ relationsDepth: 123 })
      const queryString2 = Backendless.Data.QueryBuilder.toQueryString({ relationsDepth: 0 })
      const queryString3 = Backendless.Data.QueryBuilder.toQueryString({ relationsDepth: -10 })

      query.setRelationsDepth(200)

      const queryString4 = Backendless.Data.QueryBuilder.toQueryString(query)

      expect(queryString1).to.be.equal('relationsDepth=123')
      expect(queryString2).to.be.equal('')
      expect(queryString3).to.be.equal('')
      expect(queryString4).to.be.equal('pageSize=10&relationsDepth=200')
    })

    it('relationsPageSize', () => {
      const queryString1 = Backendless.Data.QueryBuilder.toQueryString({ relationsPageSize: 123 })
      const queryString2 = Backendless.Data.QueryBuilder.toQueryString({ relationsPageSize: 0 })
      const queryString3 = Backendless.Data.QueryBuilder.toQueryString({ relationsPageSize: -10 })

      query.setRelationsPageSize(200)

      const queryString4 = Backendless.Data.QueryBuilder.toQueryString(query)

      expect(queryString1).to.be.equal('relationsPageSize=123')
      expect(queryString2).to.be.equal('')
      expect(queryString3).to.be.equal('')
      expect(queryString4).to.be.equal('pageSize=10&relationsPageSize=200')
    })
  })
})
