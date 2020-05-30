import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forTest, prepareMockRequest } from '../../helpers/sandbox'

describe('<Users> Emails', function() {

  forTest(this)

  const validEmailAddress = 'foo@bar.com'

  it('sends correct request to restore password', async () => {
    const req1 = prepareMockRequest()

    await Backendless.UserService.restorePassword(validEmailAddress)

    expect(req1).to.deep.include({
      method : 'GET',
      path   : `${APP_PATH}/users/restorepassword/foo%40bar.com`,
      headers: {},
      body   : undefined
    })
  })

  xit('fails when there is an incorrect email is passed in the request to restore password', async () => {
    const errorMsg = 'Email Address must be provided and must be a string.'

    await expect(Backendless.UserService.restorePassword()).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.restorePassword(undefined)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.restorePassword('')).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.restorePassword(0)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.restorePassword(123)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.restorePassword(null)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.restorePassword(true)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.restorePassword(false)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.restorePassword({})).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.restorePassword([])).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.restorePassword(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
  })

  it('sends correct request to resend email confirmation', async () => {
    const req1 = prepareMockRequest()

    await Backendless.UserService.resendEmailConfirmation(validEmailAddress)

    expect(req1).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/users/resendconfirmation/foo@bar.com`,
      headers: {},
      body   : undefined
    })
  })

  xit('fails when there is an incorrect email is passed in the request to resend email confirmation', async () => {
    const errorMsg = 'Email Address must be provided and must be a string.'

    await expect(Backendless.UserService.resendEmailConfirmation()).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.resendEmailConfirmation(undefined)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.resendEmailConfirmation('')).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.resendEmailConfirmation(0)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.resendEmailConfirmation(123)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.resendEmailConfirmation(null)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.resendEmailConfirmation(true)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.resendEmailConfirmation(false)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.resendEmailConfirmation({})).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.resendEmailConfirmation([])).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.resendEmailConfirmation(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
  })

})
