import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forTest } from '../../helpers/sandbox'

describe('<Data> Group Query Builder', function() {

  forTest(this)

  let query

  beforeEach(() => {
    query = Backendless.Data.GroupQueryBuilder.create()
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

  it('should set group page size', async () => {
    query.setGroupPageSize(123)

    expect(query.getGroupPageSize()).to.be.eql(123)

    query.setGroupPageSize(555)

    expect(query.getGroupPageSize()).to.be.eql(555)
  })

  it('should set records page size', async () => {
    query.setRecordsPageSize(123)

    expect(query.getRecordsPageSize()).to.be.eql(123)

    query.setRecordsPageSize(555)

    expect(query.getRecordsPageSize()).to.be.eql(555)
  })

  it('should set group depth', async () => {
    query.setGroupDepth(123)

    expect(query.getGroupDepth()).to.be.eql(123)

    query.setGroupDepth(555)

    expect(query.getGroupDepth()).to.be.eql(555)
  })

  it('should set group path', async () => {
    const group1 = { 'column': 'age', 'value': 99 }
    const group2 = { 'column': 'name', 'value': 88 }
    const group3 = { 'column': 'city', 'value': 77 }

    query.setGroupPath(group1)

    expect(query.getGroupPath()).to.be.eql([group1])

    query.setGroupPath([group2, group3])

    expect(query.getGroupPath()).to.be.eql([group2, group3])

    query.setGroupPath([group1, group2, group3])

    expect(query.getGroupPath()).to.be.eql([group1, group2, group3])
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
    query.setDistinct(true)
    query.setOffset(111)
    query.setPageSize(222)
    query.setGroupDepth(333)
    query.setGroupPageSize(444)
    query.setRelationsDepth(555)
    query.setRecordsPageSize(666)
    query.setRelationsPageSize(777)
    query.setSortBy('s1')
    query.setGroupBy('g1')
    query.setRelated('r1')
    query.setWhereClause('w1')
    query.setProperties(['p1', 'p2'])
    query.excludeProperties(['e1', 'e2'])
    query.setGroupPath([{ column: 'age', value: 99 }])

    expect(query).to.be.eql({
      'distinct'         : true,
      'offset'           : 111,
      'pageSize'         : 222,
      'groupDepth'       : 333,
      'groupPageSize'    : 444,
      'relationsDepth'   : 555,
      'recordsPageSize'  : 666,
      'relationsPageSize': 777,
      'where'            : 'w1',
      'sortBy'           : ['s1'],
      'groupBy'          : ['g1'],
      'loadRelations'    : ['r1'],
      'property'         : ['p1', 'p2'],
      'excludeProps'     : ['e1', 'e2'],
      'groupPath'        : [{ 'column': 'age', 'value': 99 }]
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

  it('fails when groupPageSize is invalid', function() {
    const errorMsg = 'Group page size must be a positive value.'

    expect(() => query.setGroupPageSize(-1)).to.throw(errorMsg)
  })

  it('fails when recordsPageSize is invalid', function() {
    const errorMsg = 'Records page size must be a positive value.'

    expect(() => query.setRecordsPageSize(-1)).to.throw(errorMsg)
  })

  it('fails when groupDepth is invalid', function() {
    const errorMsg = 'Group depth cannot have a negative value.'

    expect(() => query.setGroupDepth(-1)).to.throw(errorMsg)
  })

  it('fails when setDistinct is invalid', function() {
    const errorMsg = 'Distinct must be a boolean value.'

    expect(() => query.setDistinct('foobar')).to.throw(errorMsg)
  })
})
