import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forTest } from '../../helpers/sandbox'

describe('<Data> Group Query Builder', function() {

  forTest(this)

  let query

  beforeEach(() => {
    query = Backendless.Data.GroupQueryBuilder.create()
  })

  it('should be inherited of DataQueryBuilder', async () => {
    expect(query).to.be.an.instanceof(Backendless.Data.QueryBuilder)
  })

  it('should has default values', async () => {
    expect(query.getGroupPageSize()).to.be.equal(10)
    expect(query.getRecordsPageSize()).to.be.equal(10)
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

  it('should add group path', async () => {
    const group1 = { 'column': 'age', 'value': 99 }
    const group2 = { 'column': 'name', 'value': 88 }
    const group3 = { 'column': 'city', 'value': 77 }

    query.addGroupPath(group1)

    expect(query.getGroupPath()).to.be.eql([group1])

    query.addGroupPath(group2)

    expect(query.getGroupPath()).to.be.eql([group1, group2])

    query.addGroupPath(group3)

    expect(query.getGroupPath()).to.be.eql([group1, group2, group3])
  })

  it('should set fileReferencePrefix', async () => {
    query.setFileReferencePrefix('/')

    expect(query.getFileReferencePrefix()).to.eql('/')

    query.setFileReferencePrefix('http://foo.com')

    expect(query.getFileReferencePrefix()).to.eql('http://foo.com')
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
    query.setFileReferencePrefix('http://foo.com')

    expect(query.toJSON()).to.be.eql({
      'distinct'           : true,
      'offset'             : 111,
      'pageSize'           : 222,
      'groupDepth'         : 333,
      'groupPageSize'      : 444,
      'relationsDepth'     : 555,
      'recordsPageSize'    : 666,
      'relationsPageSize'  : 777,
      'where'              : 'w1',
      'having'             : null,
      'sortBy'             : ['s1'],
      'groupBy'            : ['g1'],
      'relations'          : ['r1'],
      'properties'         : ['p1', 'p2'],
      'excludeProps'       : ['e1', 'e2'],
      'groupPath'          : [{ 'column': 'age', 'value': 99 }],
      'fileReferencePrefix': 'http://foo.com',
    })
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
})
