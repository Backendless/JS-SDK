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

  it('fails when there is an incorrect email is passed in the request to restore password', async () => {
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
    const req2 = prepareMockRequest()
    const req3 = prepareMockRequest()
    const req4 = prepareMockRequest()

    await Backendless.UserService.resendEmailConfirmation(validEmailAddress)
    await Backendless.UserService.resendEmailConfirmation('username')
    await Backendless.UserService.resendEmailConfirmation(123456)
    await Backendless.UserService.resendEmailConfirmation(0)

    expect(req1).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/users/resendconfirmation/foo%40bar.com`,
      headers: {},
      body   : undefined
    })

    expect(req2).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/users/resendconfirmation/username`,
      headers: {},
      body   : undefined
    })

    expect(req3).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/users/resendconfirmation/123456`,
      headers: {},
      body   : undefined
    })

    expect(req4).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/users/resendconfirmation/0`,
      headers: {},
      body   : undefined
    })
  })

  it('fails when there is an incorrect type is passed in the request to resend email confirmation', async () => {
    const errorMsg = 'Identity must be a string or number.'

    await expect(Backendless.UserService.resendEmailConfirmation()).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.resendEmailConfirmation(undefined)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.resendEmailConfirmation(null)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.resendEmailConfirmation(true)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.resendEmailConfirmation(false)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.resendEmailConfirmation({})).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.resendEmailConfirmation([])).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.resendEmailConfirmation(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
  })

  it('fails when there is an empty string is passed in the request to resend email confirmation', async () => {
    const errorMsg = 'Identity can not be an empty string.'

    await expect(Backendless.UserService.resendEmailConfirmation('')).to.eventually.be.rejectedWith(errorMsg)
  })

  it('sends correct request to create email confirmation', async () => {
    const req1 = prepareMockRequest()
    const req2 = prepareMockRequest()
    const req3 = prepareMockRequest()
    const req4 = prepareMockRequest()

    await Backendless.UserService.createEmailConfirmationURL(validEmailAddress)
    await Backendless.UserService.createEmailConfirmationURL('username')
    await Backendless.UserService.createEmailConfirmationURL(123456)
    await Backendless.UserService.createEmailConfirmationURL(0)

    expect(req1).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/users/createEmailConfirmationURL/foo%40bar.com`,
      headers: {},
      body   : undefined
    })

    expect(req2).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/users/createEmailConfirmationURL/username`,
      headers: {},
      body   : undefined
    })

    expect(req3).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/users/createEmailConfirmationURL/123456`,
      headers: {},
      body   : undefined
    })

    expect(req4).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/users/createEmailConfirmationURL/0`,
      headers: {},
      body   : undefined
    })
  })

  it('fails when there is an incorrect type is passed in the request to create email confirmation', async () => {
    const errorMsg = 'Identity must be a string or number.'

    await expect(Backendless.UserService.createEmailConfirmationURL()).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.createEmailConfirmationURL(undefined)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.createEmailConfirmationURL(null)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.createEmailConfirmationURL(true)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.createEmailConfirmationURL(false)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.createEmailConfirmationURL({})).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.createEmailConfirmationURL([])).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.createEmailConfirmationURL(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
  })

  it('fails when there is an empty string is passed in the request to create email confirmation', async () => {
    const errorMsg = 'Identity can not be an empty string.'

    await expect(Backendless.UserService.createEmailConfirmationURL('')).to.eventually.be.rejectedWith(errorMsg)
  })


})
