import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { Utils, APP_PATH, forTest, prepareMockRequest } from '../../helpers/sandbox'

import { UsersUtils } from '../../../../src/users/utils'

function getTestUserObject() {
  return {
    email   : 'foo@bar.com',
    password: '123456',
    name    : 'Bob Miller'
  }
}

function getTestUserInstance(user) {
  return new Backendless.User(user || getTestUserObject())
}

describe('<Users> Registration', function() {

  forTest(this)

  it('register new users', async () => {
    const userObject = getTestUserObject()
    const userInstance = getTestUserInstance()

    const req1 = prepareMockRequest({ ...userObject, objectId: Utils.objectId() })
    const req2 = prepareMockRequest({ ...userInstance, objectId: Utils.objectId() })

    const user1 = await Backendless.UserService.register(userObject)
    const user2 = await Backendless.UserService.register(userInstance)

    expect(req1).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/users/register`,
      headers: { 'Content-Type': 'application/json' },
      body   : userObject
    })

    expect(req2).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/users/register`,
      headers: { 'Content-Type': 'application/json' },
      body   : {
        ___class: 'Users',
        ...userInstance
      }
    })

    expect(user1).to.be.an.instanceof(Backendless.User)
    expect(user1.___class).to.be.equal('Users')
    expect(user1.objectId).to.be.a('string')

    expect(user2).to.be.an.instanceof(Backendless.User)
    expect(user2.___class).to.be.equal('Users')
    expect(user2.objectId).to.be.a('string')
  })

  it('register new users with blUserLocale', async () => {
    const blUserLocale = 'fake_bl_locale'

    const native__getClientUserLocale = UsersUtils.getClientUserLocale
    UsersUtils.getClientUserLocale = () => blUserLocale

    const userObject = getTestUserObject()
    const userInstance = getTestUserInstance()

    const req1 = prepareMockRequest()
    const req2 = prepareMockRequest()
    const req3 = prepareMockRequest()

    await Backendless.UserService.register(userObject)
    await Backendless.UserService.register(userInstance)
    await Backendless.UserService.register({ ...userInstance, blUserLocale: 'MY_CUSTOM_LOCALE' })

    expect(req1).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/users/register`,
      headers: { 'Content-Type': 'application/json' },
      body   : {
        blUserLocale,
        ...userObject
      }
    })

    expect(req2).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/users/register`,
      headers: { 'Content-Type': 'application/json' },
      body   : {
        ___class: 'Users',
        blUserLocale,
        ...userObject
      }
    })

    expect(req3).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/users/register`,
      headers: { 'Content-Type': 'application/json' },
      body   : {
        ___class    : 'Users',
        blUserLocale: 'MY_CUSTOM_LOCALE',
        ...userObject
      }
    })

    UsersUtils.getClientUserLocale = native__getClientUserLocale
  })

  it('register new users with blUserLocale from the Navigator', async () => {
    const check = async navigator => {
      global.__test_navigator = navigator

      const userObject = getTestUserObject()

      const req1 = prepareMockRequest()

      await Backendless.UserService.register(userObject)

      return req1.body.blUserLocale
    }

    expect(await check({})).to.be.equal(undefined)
    expect(await check({ languages: ['l1:test'] })).to.be.equal('l1')
    expect(await check({ userLanguage: 'l2:test' })).to.be.equal('l2')
    expect(await check({ language: 'l3:test' })).to.be.equal('l3')
    expect(await check({ browserLanguage: 'l4:test' })).to.be.equal('l4')
    expect(await check({ systemLanguage: 'l5:test' })).to.be.equal('l5')
  })

})
