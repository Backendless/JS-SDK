import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forTest, prepareMockRequest } from '../../helpers/sandbox'

describe('<Users> Roles', function() {

  forTest(this)

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
