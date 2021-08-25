import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forTest, prepareMockRequest, Utils } from '../../helpers/sandbox'

describe('<Users> Password', function() {

  forTest(this)

  beforeEach(async () => {
    prepareMockRequest({})

    await Backendless.UserService.logout()
  })

  const login = async () => {
    prepareMockRequest({
      email       : 'foo@bar.com',
      password    : 'valid-password-123456',
      name        : 'Bob Miller',
      objectId    : Utils.objectId(),
      'user-token': 'mock-user-token'
    })

    await Backendless.UserService.login('foo@bar.com', 'valid-password-123456', true)
  }

  describe('verify password of the current user', function() {
    it('returns boolean value', async () => {
      await login()

      const req1 = prepareMockRequest({ valid: true })
      const req2 = prepareMockRequest({ valid: false })

      const result1 = await Backendless.UserService.verifyPassword('valid-password-123456')
      const result2 = await Backendless.UserService.verifyPassword('invalid-password')

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/verifypassword`,
        headers: { 'Content-Type': 'application/json', 'user-token': 'mock-user-token' },
        body   : {
          password: 'valid-password-123456'
        }
      })

      expect(req2).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/verifypassword`,
        headers: { 'Content-Type': 'application/json', 'user-token': 'mock-user-token' },
        body   : {
          password: 'invalid-password'
        }
      })

      expect(result1).to.be.equal(true)
      expect(result2).to.be.equal(false)
    })

    it('fails when server returns an error', async () => {
      await login()

      const errorMsg = 'No authenticated user is associated with request'

      prepareMockRequest(() => ({
        status: 400,
        body  : {
          code     : 3121,
          message  : errorMsg,
          errorData: {}
        }
      }))

      await expect(Backendless.UserService.verifyPassword('valid-password')).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails for not logged in user', async () => {
      const errorMsg = 'In order to check password you have to be logged in'

      await expect(Backendless.UserService.verifyPassword('valid-password-123456')).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when the password is not valid string', async () => {
      const errorMsg = 'Password has to be a non empty string'

      await expect(Backendless.UserService.verifyPassword()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.verifyPassword('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.verifyPassword(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.verifyPassword(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.verifyPassword(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.verifyPassword(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.verifyPassword(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.verifyPassword(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.verifyPassword({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.verifyPassword([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.verifyPassword(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

  })
})
