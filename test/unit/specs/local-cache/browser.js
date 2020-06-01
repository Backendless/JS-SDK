import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forTest, APP_ID, API_KEY } from '../../helpers/sandbox'

describe('<LocalCache> Browser', function() {

  forTest(this)

  let cleanupDom

  beforeEach(() => {
    cleanupDom = require('jsdom-global')('', { url: 'http://localhost' })

    global.localStorage = window.localStorage

    Backendless.Utils.isBrowser = true
    Backendless.Utils.isLocalStorageSupported = true

    Backendless.initApp(APP_ID, API_KEY)
  })

  afterEach(() => {
    cleanupDom()

    Backendless.Utils.isBrowser = false
    Backendless.Utils.isLocalStorageSupported = false

    delete global.localStorage
  })

  xit('has default storage name', () => {
    expect(Backendless.LocalCache.storageName).to.be.equal('Backendless')
  })

  xit('has particular storage name for standalone', () => {
    const app1 = Backendless.initApp({ appId: 'appId-1', apiKey: 'apiKey-1', standalone: true })
    const app2 = Backendless.initApp({ appId: 'appId-2', apiKey: 'apiKey-2', standalone: true })

    expect(app1.LocalCache.storageName).to.be.equal('Backendless-appId-1')
    expect(app2.LocalCache.storageName).to.be.equal('Backendless-appId-2')
  })

  it('has KEYS shortcuts', () => {
    expect(Backendless.LocalCache.Keys.USER_TOKEN).to.be.equal('user-token')
    expect(Backendless.LocalCache.Keys.CURRENT_USER_ID).to.be.equal('current-user-id')
    expect(Backendless.LocalCache.Keys.STAY_LOGGED_IN).to.be.equal('stayLoggedIn')
  })

  it('sets and gets any data types', () => {
    const key = 'key'

    Backendless.LocalCache.set(key, '')
    expect(Backendless.LocalCache.get(key)).to.be.equal('')

    Backendless.LocalCache.set(key, 'str')
    expect(Backendless.LocalCache.get(key)).to.be.equal('str')

    Backendless.LocalCache.set(key, null)
    expect(Backendless.LocalCache.get(key)).to.be.equal(null)

    Backendless.LocalCache.set(key, undefined)
    expect(Backendless.LocalCache.get(key)).to.be.equal(undefined)

    Backendless.LocalCache.set(key, true)
    expect(Backendless.LocalCache.get(key)).to.be.equal(true)

    Backendless.LocalCache.set(key, false)
    expect(Backendless.LocalCache.get(key)).to.be.equal(false)

    Backendless.LocalCache.set(key, 0)
    expect(Backendless.LocalCache.get(key)).to.be.equal(0)

    Backendless.LocalCache.set(key, 123)
    expect(Backendless.LocalCache.get(key)).to.be.equal(123)

    Backendless.LocalCache.set(key, [1, 2, 3])
    expect(Backendless.LocalCache.get(key)).to.be.eql([1, 2, 3])

    Backendless.LocalCache.set(key, { foo: 'bar' })
    expect(Backendless.LocalCache.get(key)).to.be.eql({ foo: 'bar' })

    Backendless.LocalCache.set(key, [{ foo: 'bar' }, { num: 123 }])
    expect(Backendless.LocalCache.get(key)).to.be.eql([{ foo: 'bar' }, { num: 123 }])
  })

  it('removes items', () => {
    Backendless.LocalCache.set('key-1', 'str')
    Backendless.LocalCache.set('key-2', true)
    Backendless.LocalCache.set('key-5', 123)
    Backendless.LocalCache.set('key-6', [1, 2, 3])
    Backendless.LocalCache.set('key-7', { foo: 'bar' })
    Backendless.LocalCache.set('key-8', [{ foo: 'bar' }, { num: 123 }])

    Backendless.LocalCache.remove('key-2')
    Backendless.LocalCache.remove('key-6')
    Backendless.LocalCache.remove('key-8')

    expect(Backendless.LocalCache.get('key-2')).to.be.equal(undefined)
    expect(Backendless.LocalCache.get('key-6')).to.be.equal(undefined)
    expect(Backendless.LocalCache.get('key-8')).to.be.equal(undefined)

    expect(Backendless.LocalCache.get('key-1')).to.be.equal('str')
    expect(Backendless.LocalCache.get('key-5')).to.be.equal(123)
    expect(Backendless.LocalCache.get('key-7')).to.be.eql({ foo: 'bar' })
  })

  xit('returns empty storage even if there is broken string', () => {
    const warn = console.warn

    let warnMessage
    let warnError

    console.warn = (m, e) => {
      warnMessage = m
      warnError = e
    }

    localStorage.setItem(Backendless.LocalCache.storageName, '{foo}')

    expect(Backendless.LocalCache.get('key-2')).to.be.equal(undefined)
    expect(Backendless.LocalCache.get('key-6')).to.be.equal(undefined)
    expect(Backendless.LocalCache.get('key-8')).to.be.equal(undefined)

    expect(warnMessage).to.be.equal('Could not parse data from LocalStorage')
    expect(warnError.message).to.be.equal('Unexpected token f in JSON at position 1')

    console.warn = warn
  })

  it('should keep current user token and id in the LocalCache after initApp', async () => {
    const testToken = 'test-token'
    const testUserId = 'test-id'

    Backendless.LocalCache.set(Backendless.LocalCache.Keys.USER_TOKEN, testToken)
    Backendless.LocalCache.set(Backendless.LocalCache.Keys.CURRENT_USER_ID, testUserId)

    Backendless.initApp(APP_ID, API_KEY)

    expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.USER_TOKEN)).to.be.equal(testToken)
    expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.CURRENT_USER_ID)).to.be.equal(testUserId)
  })

})
