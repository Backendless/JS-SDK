import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forTest, APP_ID, API_KEY } from '../helpers/sandbox'

describe('Browser', function() {

  forTest(this)

  let cleanupDom

  beforeEach(() => {
    cleanupDom = require('global-jsdom')('', { url: 'http://localhost' })

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

  describe('User Agent', () => {
    let prevNavigator

    beforeEach(() => {
      prevNavigator = global.navigator

      global.navigator = {}
    })

    afterEach(() => {
      global.navigator = prevNavigator
    })

    it('navigator has userAgent', () => {
      navigator.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'

      expect(Backendless.browser).to.be.eql({
        chrome : true,
        version: '81.0.4044.138',
      })

      navigator.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12A365 Safari/600.1.4'

      expect(Backendless.browser).to.be.eql({
        webkit : true,
        version: '600.1.4',
      })

      navigator.userAgent = 'Mozilla/5.0 (Linux; U; Android 2.3.6; en-us; Nexus S Build/GRK39F) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1'

      expect(Backendless.browser).to.be.eql({
        webkit : true,
        version: '533.1',
      })
    })

    it('should return empty object when hybrid-app', () => {
      expect(Backendless.browser).to.be.eql({})

      navigator.userAgent = null

      expect(Backendless.browser).to.be.eql({})

      navigator.userAgent = undefined

      expect(Backendless.browser).to.be.eql({})

      navigator.userAgent = ''

      expect(Backendless.browser).to.be.eql({})

    })
  })

})
