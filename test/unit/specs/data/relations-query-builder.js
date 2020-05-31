import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forTest } from '../../helpers/sandbox'

describe('<Data> Relations Query Builder', function() {

  forTest(this)

  let query

  beforeEach(() => {
    query = Backendless.Data.LoadRelationsQueryBuilder.create()
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
    query.setRelated('p1')

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

    expect(query.toJSON()).to.be.eql({
      'excludeProps'     : ['e1', 'e2'],
      'groupBy'          : ['g1'],
      'having'           : 'h1',
      'offset'           : 222,
      'pageSize'         : 111,
      'props'       : ['p1', 'p2'],
      'loadRelations'        : ['r1'],
      'relationsDepth'   : 123,
      'relationsPageSize': 123,
      'sortBy'           : ['s1'],
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
})
