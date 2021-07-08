import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forTest, prepareMockRequest } from '../../helpers/sandbox'

describe('<Users> Roles', function() {

  forTest(this)

  describe('Find Users by RoleName', function() {
    const roleName = 'testRoleName'

    let query

    beforeEach(() => {
      query = Backendless.Data.QueryBuilder.create()
    })

    it('gets users by roleName only', async () => {
      const req1 = prepareMockRequest()

      await Backendless.UserService.findByRole(roleName)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/users/role/${roleName}`,
        headers: {},
        body   : undefined
      })
    })

    it('gets users along with roles by roleName', async () => {
      const req1 = prepareMockRequest()
      const req2 = prepareMockRequest()

      await Backendless.UserService.findByRole(roleName, true)
      await Backendless.UserService.findByRole(roleName, false)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/users/role/${roleName}?loadRoles=true`,
        headers: {},
        body   : undefined
      })

      expect(req2).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/users/role/${roleName}?loadRoles=false`,
        headers: {},
        body   : undefined
      })
    })

    it('gets users by roleName with DataQuery instance', async () => {
      const req1 = prepareMockRequest()
      const req2 = prepareMockRequest()
      const req3 = prepareMockRequest()

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

      await Backendless.UserService.findByRole(roleName, null, query)
      await Backendless.UserService.findByRole(roleName, null, query2)
      await Backendless.UserService.findByRole(roleName, null, query3)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/users/role/${roleName}?${Backendless.DataQueryBuilder.toQueryString(query)}`,
        headers: {},
        body   : undefined
      })

      expect(req2).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/users/role/${roleName}?${Backendless.DataQueryBuilder.toQueryString(query2)}`,
        headers: {},
        body   : undefined
      })

      expect(req3).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/users/role/${roleName}?${Backendless.DataQueryBuilder.toQueryString(query3)}`,
        headers: {},
        body   : undefined
      })
    })

    it('gets users along with roles by roleName with DataQuery instance', async () => {
      const req1 = prepareMockRequest()
      const req2 = prepareMockRequest()

      const query2 = {
        pageSize: 30,
        offset  : 40,
      }

      await Backendless.UserService.findByRole(roleName, true, query)
      await Backendless.UserService.findByRole(roleName, false, query2)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/users/role/${roleName}?loadRoles=true&${Backendless.DataQueryBuilder.toQueryString(query)}`,
        headers: {},
        body   : undefined
      })

      expect(req2).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/users/role/${roleName}?loadRoles=false&${Backendless.DataQueryBuilder.toQueryString(query2)}`,
        headers: {},
        body   : undefined
      })
    })

    it('gets lists of Backendless.User instances along with roles by roleName', async () => {
      const req1 = prepareMockRequest([
        {
          name    : 'nick-test-role',
          objectId: '14F0E678-3C6C-4C8F-8B80-4714E1A7A94A'
        }
      ])

      const result = await Backendless.UserService.findByRole(roleName)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/users/role/${roleName}`,
        headers: {},
        body   : undefined
      })

      expect(result[0]).to.be.instanceof(Backendless.User)
      expect(result[0]).to.be.eql({
        ___class: 'Users',
        name    : 'nick-test-role',
        objectId: '14F0E678-3C6C-4C8F-8B80-4714E1A7A94A'
      })
    })

    it('gets lists of Backendless.User instances with roles along with roles by roleName', async () => {
      const req1 = prepareMockRequest([
        {
          name    : 'nick-test-role',
          objectId: '14F0E678-3C6C-4C8F-8B80-4714E1A7A94A',
          roles   : [
            'testRoleName',
            'testRole1'
          ]
        }
      ])

      const result = await Backendless.UserService.findByRole(roleName, true)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/users/role/${roleName}?loadRoles=true`,
        headers: {},
        body   : undefined
      })

      expect(result[0]).to.be.instanceof(Backendless.User)
      expect(result[0]).to.be.eql({
        ___class: 'Users',
        name    : 'nick-test-role',
        objectId: '14F0E678-3C6C-4C8F-8B80-4714E1A7A94A',
        roles   : [
          'testRoleName',
          'testRole1'
        ]
      })
    })

    it('fails when "roleName" is invalid', async () => {
      const errorMsg = 'Role Name must be a string and can not be empty'

      await expect(Backendless.UserService.findByRole()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.findByRole(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.findByRole(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.findByRole(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.findByRole('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.findByRole(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.findByRole(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.findByRole({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.findByRole([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.findByRole(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when "loadRoles" is invalid', async () => {
      const errorMsg = 'The second argument "loadRoles" can be a boolean only'

      await expect(Backendless.UserService.findByRole(roleName, '')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.findByRole(roleName, 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.findByRole(roleName, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.findByRole(roleName, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.findByRole(roleName, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.findByRole(roleName, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when "query" is invalid', async () => {
      const errorMsg = 'The third argument "query" can be an instance of DataQueryBuilder or a plain object only'

      await expect(Backendless.UserService.findByRole(roleName, true, false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.findByRole(roleName, true, true)).to.eventually.be.rejectedWith(errorMsg)
      // await expect(Backendless.UserService.findByRole(roleName, true, '')).to.eventually.be.rejectedWith(errorMsg)
      // await expect(Backendless.UserService.findByRole(roleName, true, 0)).to.eventually.be.rejectedWith(errorMsg)
      // await expect(Backendless.UserService.findByRole(roleName, true, 123)).to.eventually.be.rejectedWith(errorMsg)
      // await expect(Backendless.UserService.findByRole(roleName, true, [])).to.eventually.be.rejectedWith(errorMsg)
      // await expect(Backendless.UserService.findByRole(roleName, true, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })
  })

  it('gets user roles', async () => {
    const req1 = prepareMockRequest()

    await Backendless.UserService.getUserRoles()

    expect(req1).to.deep.include({
      method : 'GET',
      path   : `${APP_PATH}/users/userroles`,
      headers: {},
      body   : undefined
    })
  })

  it('adds user roles', async () => {
    const req1 = prepareMockRequest()

    await Backendless.UserService.assignRole('test-identity', 'test-role')

    expect(req1).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/users/assignRole`,
      headers: { 'Content-Type': 'application/json' },
      body   : {
        roleName: 'test-role',
        user    : 'test-identity',
      }
    })
  })

  it('removes user roles', async () => {
    const req1 = prepareMockRequest()

    await Backendless.UserService.unassignRole('test-identity', 'test-role')

    expect(req1).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/users/unassignRole`,
      headers: { 'Content-Type': 'application/json' },
      body   : {
        roleName: 'test-role',
        user    : 'test-identity',
      }
    })
  })

  it('fails when "identity" is invalid', async () => {
    const errorMsg = 'User identity must be a string or number and can not be empty.'

    await expect(Backendless.UserService.assignRole(null)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.assignRole(false)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.assignRole(true)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.assignRole('')).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.assignRole(0)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.assignRole({})).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.assignRole([])).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.assignRole(() => ({}))).to.eventually.be.rejectedWith(errorMsg)

    await expect(Backendless.UserService.unassignRole(null)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.unassignRole(false)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.unassignRole(true)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.unassignRole('')).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.unassignRole(0)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.unassignRole({})).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.unassignRole([])).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.unassignRole(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
  })

  it('fails when "roleName" is invalid', async () => {
    const errorMsg = 'Role Name must be a string and can not be empty.'

    await expect(Backendless.UserService.assignRole('identity', null)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.assignRole('identity', false)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.assignRole('identity', true)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.assignRole('identity', '')).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.assignRole('identity', 0)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.assignRole('identity', {})).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.assignRole('identity', [])).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.assignRole('identity', () => ({}))).to.eventually.be.rejectedWith(errorMsg)

    await expect(Backendless.UserService.unassignRole('identity', null)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.unassignRole('identity', false)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.unassignRole('identity', true)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.unassignRole('identity', '')).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.unassignRole('identity', 0)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.unassignRole('identity', {})).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.unassignRole('identity', [])).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.unassignRole('identity', () => ({}))).to.eventually.be.rejectedWith(errorMsg)
  })

})
