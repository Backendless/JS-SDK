import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forTest, prepareMockRequest } from '../../helpers/sandbox'

const createRequestBody = (body) => {
  return {
    'distinct'         : body.distinct || false,
    'excludeProps'     : body.excludeProps || null,
    'groupBy'          : body.groupBy || null,
    'groupDepth'       : body.groupDepth || null,
    'groupPageSize'    : body.groupPageSize || 10,
    'groupPath'        : body.groupPath || null,
    'offset'           : body.offset || 0,
    'pageSize'         : body.pageSize || 10,
    'property'         : body.property || null,
    'recordsPageSize'  : body.recordsPageSize || 10,
    'loadRelations'    : body.loadRelations || null,
    'relationsDepth'   : body.relationsDepth || null,
    'relationsPageSize': body.relationsPageSize || null,
    'sortBy'           : body.sortBy || null,
    'where'            : body.where || null
  }
}

describe('<Data> Grouping', function() {

  forTest(this)

  const tableName = 'Person'

  let query

  beforeEach(() => {
    query = Backendless.Data.GroupQueryBuilder.create()
  })

  describe('group', () => {
    it('default', async () => {
      const responseData = {
        hasNextPage: false,
        items      : [{}]
      }

      const req1 = prepareMockRequest(responseData)

      const result = await Backendless.Data.of(tableName).group(query)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/data-grouping/${tableName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          'distinct'         : false,
          'excludeProps'     : null,
          'groupBy'          : null,
          'groupDepth'       : null,
          'groupPageSize'    : 10,
          'groupPath'        : null,
          'offset'           : 0,
          'pageSize'         : 10,
          'property'         : null,
          'recordsPageSize'  : 10,
          'loadRelations'    : null,
          'relationsDepth'   : null,
          'relationsPageSize': null,
          'sortBy'           : null,
          'where'            : null
        }
      })

      expect(result).to.be.equal(responseData)
    })

    it('with query', async () => {
      const req1 = prepareMockRequest()

      query.setPageSize(11)
      query.setGroupDepth(22)
      query.setGroupPageSize(33)
      query.setOffset(44)
      query.setRelationsDepth(66)
      query.setRecordsPageSize(55)
      query.setRelationsPageSize(77)
      query.setDistinct(true)
      query.setSortBy('city')
      query.setRelated('baz')
      query.setGroupBy('country')
      query.addProperty('foobar')
      query.excludeProperty('name')
      query.setWhereClause('age = 10')
      query.setGroupPath({ column: 'id', value: 123 })

      await Backendless.Data.of(tableName).group(query)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/data-grouping/${tableName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          'pageSize'         : 11,
          'groupDepth'       : 22,
          'groupPageSize'    : 33,
          'offset'           : 44,
          'recordsPageSize'  : 55,
          'relationsDepth'   : 66,
          'relationsPageSize': 77,
          'distinct'         : true,
          'where'            : 'age = 10',
          'loadRelations'    : ['baz'],
          'excludeProps'     : ['name'],
          'sortBy'           : ['city'],
          'property'         : ['foobar'],
          'groupBy'          : ['country'],
          'groupPath'        : [{ 'column': 'id', 'value': 123 }],
        }
      })
    })
  })

  describe('countInGroup', () => {
    it('should throw an error if groupPath doesn\'t provided', async () => {
      const errorMsg = 'Group Path must be provided and must be an object.'

      await expect(Backendless.Data.of(tableName).countInGroup(query)).to.eventually.be.rejectedWith(errorMsg)
    })

    it('default', async () => {
      const responseData = 4

      const req1 = prepareMockRequest(responseData)

      query.setPageSize(11)
      query.setGroupDepth(22)
      query.setGroupPageSize(33)
      query.setOffset(44)
      query.setRelationsDepth(66)
      query.setRecordsPageSize(55)
      query.setRelationsPageSize(77)
      query.setDistinct(true)
      query.setSortBy('city')
      query.setRelated('baz')
      query.setGroupBy('country')
      query.addProperty('foobar')
      query.excludeProperty('name')
      query.setWhereClause('age = 10')
      query.setGroupPath({ column: 'id', value: 123 })

      const result = await Backendless.Data.of(tableName).countInGroup(query)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/data-grouping/${tableName}/count`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          'pageSize'         : 11,
          'groupDepth'       : 22,
          'groupPageSize'    : 33,
          'offset'           : 44,
          'recordsPageSize'  : 55,
          'relationsDepth'   : 66,
          'relationsPageSize': 77,
          'distinct'         : true,
          'where'            : 'age = 10',
          'loadRelations'    : ['baz'],
          'excludeProps'     : ['name'],
          'sortBy'           : ['city'],
          'property'         : ['foobar'],
          'groupBy'          : ['country'],
          'groupPath'        : [{ 'column': 'id', 'value': 123 }],
        }
      })

      expect(result).to.be.equal(responseData)
    })

    it('with query', async () => {
      const responseData = 4

      const req1 = prepareMockRequest(responseData)

      query.setGroupPath({ column: 'foo', value: 'bar' })

      const result = await Backendless.Data.of(tableName).countInGroup(query)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/data/data-grouping/${tableName}/count`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          'distinct'         : false,
          'excludeProps'     : null,
          'groupBy'          : null,
          'groupDepth'       : null,
          'groupPageSize'    : 10,
          'groupPath'        : [{ 'column': 'foo', 'value': 'bar' }],
          'offset'           : 0,
          'pageSize'         : 10,
          'property'         : null,
          'recordsPageSize'  : 10,
          'loadRelations'    : null,
          'relationsDepth'   : null,
          'relationsPageSize': null,
          'sortBy'           : null,
          'where'            : null
        }
      })

      expect(result).to.be.equal(responseData)
    })
  })
})
