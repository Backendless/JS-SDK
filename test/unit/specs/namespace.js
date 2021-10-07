import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_ID, API_KEY, CUSTOM_DOMAIN } from '../helpers/sandbox'

describe('Namespace', function() {
  this.timeout(2000)

  describe('Basic init', () => {

    it('should default export for ES6', () => {
      const Backendless_ES5 = require('../../../src')

      expect(Backendless_ES5).to.be.equal(Backendless)
      expect(Backendless_ES5.default).to.be.equal(Backendless)
    })

    it('should change public app relevant variables in Backendless scope', () => {
      Backendless.initApp(APP_ID, API_KEY)

      expect(Backendless.appId).to.be.equal(APP_ID)
      expect(Backendless.apiKey).to.be.equal(API_KEY)
    })

    it('should change public app relevant variables in Backendless scope using object config', () => {
      Backendless.initApp({ appId: APP_ID, apiKey: API_KEY })

      expect(Backendless.appId).to.be.equal(APP_ID)
      expect(Backendless.apiKey).to.be.equal(API_KEY)
    })

    it('should not change public variables in Backendless scope', () => {
      Backendless.serverURL = 'http://foo.bar'
      Backendless.initApp(APP_ID, API_KEY)

      expect(() => Backendless.appId = 'appId').to.throw()
      expect(() => Backendless.apiKey = 'apiKey').to.throw()
      expect(() => Backendless.appPath = 'appPath').to.throw()
      expect(() => Backendless.standalone = 'standalone').to.throw()
      expect(() => Backendless.device = 'device').to.throw()

      expect(Backendless.appId).to.be.equal(APP_ID)
      expect(Backendless.apiKey).to.be.equal(API_KEY)
      expect(Backendless.appPath).to.be.equal(`http://foo.bar/${APP_ID}/${API_KEY}`)
    })
  })

  describe('Standalone', () => {

    it('has several Backendless apps at the same time', () => {
      const app2 = Backendless.initApp({ appId: 'appId-2', apiKey: 'apiKey-2', standalone: true })
      const app3 = Backendless.initApp({ appId: 'appId-3', apiKey: 'apiKey-3', standalone: true })

      expect(app2.appId).to.be.equal('appId-2')
      expect(app2.apiKey).to.be.equal('apiKey-2')

      expect(app3.appId).to.be.equal('appId-3')
      expect(app3.apiKey).to.be.equal('apiKey-3')
    })

    it('has custom serverURL', () => {
      const app1 = Backendless.initApp({
        serverURL : 'http://my-server-url.com',
        appId     : 'appId-1',
        apiKey    : 'apiKey-1',
        standalone: true
      })

      expect(app1.appId).to.be.equal('appId-1')
      expect(app1.apiKey).to.be.equal('apiKey-1')
      expect(app1.appPath).to.be.equal('http://my-server-url.com/appId-1/apiKey-1')
    })
  })

  describe('Custom Domain', () => {

    it('should init with custom domain', () => {
      Backendless.initApp(CUSTOM_DOMAIN)

      expect(Backendless.appId).to.be.equal(null)
      expect(Backendless.apiKey).to.be.equal(null)
      expect(Backendless.domain).to.be.equal(CUSTOM_DOMAIN)
      expect(Backendless.appPath).to.be.equal(`${CUSTOM_DOMAIN}/api`)
      expect(Backendless.apiURI).to.be.equal('/api')
    })

    it('should init with custom domain via config object', () => {
      Backendless.initApp({ domain: CUSTOM_DOMAIN, apiKey: 'XXX' })

      expect(Backendless.appId).to.be.equal(null)
      expect(Backendless.apiKey).to.be.equal(null)
      expect(Backendless.domain).to.be.equal(CUSTOM_DOMAIN)
      expect(Backendless.appPath).to.be.equal(`${CUSTOM_DOMAIN}/api`)
      expect(Backendless.apiURI).to.be.equal('/api')
    })

    it('should init with custom domain and apiURI', () => {
      Backendless.apiURI = '/my-api-uri'
      Backendless.initApp(CUSTOM_DOMAIN)

      expect(Backendless.domain).to.be.equal(CUSTOM_DOMAIN)
      expect(Backendless.appPath).to.be.equal(`${CUSTOM_DOMAIN}/my-api-uri`)
      expect(Backendless.apiURI).to.be.equal('/my-api-uri')

      Backendless.apiURI = undefined
    })

    it('should fails with custom domain which does not start on https or http', () => {
      const errorMsg = (
        'When initialize the SDK with a custom domain it should start with http:// or https://, ' +
        'for example: Backendless.initApp(\'https://foobar.com\')'
      )

      expect(() => Backendless.initApp('foobar.com')).to.throw(errorMsg)
      expect(() => Backendless.initApp('httpsfoobar.com')).to.throw(errorMsg)
      expect(() => Backendless.initApp('https:foobar.com')).to.throw(errorMsg)
      expect(() => Backendless.initApp('https:/foobar.com')).to.throw(errorMsg)
      expect(() => Backendless.initApp('httpfoobar.com')).to.throw(errorMsg)
      expect(() => Backendless.initApp('http:foobar.com')).to.throw(errorMsg)
      expect(() => Backendless.initApp('http:/foobar.com')).to.throw(errorMsg)
      expect(() => Backendless.initApp('file://foobar.com')).to.throw(errorMsg)
    })
  })

  describe('Debug Mode', () => {

    it('should set debug mode', () => {
      Backendless.debugMode = true

      expect(Backendless.debugMode).to.be.equal(true)

      Backendless.initApp(APP_ID, API_KEY)

      expect(Backendless.debugMode).to.be.equal(true)

      Backendless.debugMode = false

      expect(Backendless.debugMode).to.be.equal(false)

      Backendless.initApp(APP_ID, API_KEY)

      expect(Backendless.debugMode).to.be.equal(false)
    })
  })

  describe('Server Code', () => {

    it('should set ServerCode', () => {
      Backendless.ServerCode = {
        addService() {
          return true
        }
      }

      expect(Backendless.ServerCode.addService()).to.be.equal(true)
    })

    it('should not reset ServerCode on initApp', () => {
      const ServerCode = Backendless.ServerCode = {
        addService() {
          return true
        }
      }

      Backendless.initApp(APP_ID, API_KEY)

      expect(Backendless.ServerCode).to.be.equal(ServerCode)
      expect(Backendless.ServerCode.addService()).to.be.equal(true)
    })
  })

  describe('Device', () => {

    it('should fail if device is not setup yet', () => {
      let error

      try {
        Backendless.device
      } catch (e) {
        error = e
      }

      expect(error.message).to.equal('Device is not defined. Please, run the Backendless.setupDevice')
    })

    it('should setup device', () => {
      Backendless.setupDevice({
        uuid    : 'uuid',
        platform: 'platform',
        version : 'version',
      })

      expect(Backendless.device.uuid).to.equal('uuid')
      expect(Backendless.device.platform).to.equal('PLATFORM')
      expect(Backendless.device.version).to.equal('version')
    })

    it('should fail if it has missed parameter', () => {
      Backendless.setupDevice({ uuid: 'u', platform: 'p', version: 'v', })

      const errorMsg = 'Device properties object must consist of fields "uuid", "platform" and "version".'

      expect(() => Backendless.setupDevice()).to.throw(errorMsg)
      expect(() => Backendless.setupDevice({})).to.throw(errorMsg)
      expect(() => Backendless.setupDevice({ uuid: 'u', })).to.throw(errorMsg)
      expect(() => Backendless.setupDevice({ uuid: 'u', version: 'v', })).to.throw(errorMsg)
      expect(() => Backendless.setupDevice({ uuid: 'u', platform: 'p', })).to.throw(errorMsg)
      expect(() => Backendless.setupDevice({ platform: 'p' })).to.throw(errorMsg)
      expect(() => Backendless.setupDevice({ platform: 'p', version: 'v' })).to.throw(errorMsg)
      expect(() => Backendless.setupDevice({ version: 'v', })).to.throw(errorMsg)
    })
  })

  describe('XMLHttpRequest', () => {
    it('should setup XMLHttpRequest', () => {
      class TestXMLHttpRequest {
      }

      Backendless.XMLHttpRequest = TestXMLHttpRequest

      expect(Backendless.XMLHttpRequest).to.equal(TestXMLHttpRequest)
    })
  })

  describe('Browser', () => {
    it('should return empty object in Nodejs env', () => {
      expect(Backendless.browser).to.eql({})
    })
  })

  describe('Utils', () => {
    it('isBrowser returns false in NodeJS env', () => {
      expect(Backendless.Utils.isBrowser).to.equal(false)
    })

    it('isLocalStorageSupported is not supported in NodeJS env', () => {
      expect(Backendless.Utils.isLocalStorageSupported).to.equal(false)
    })

    it('castArray wrap into array if passed argument is not array', () => {
      expect(Backendless.Utils.castArray()).to.eql([])
      expect(Backendless.Utils.castArray(undefined)).to.eql([])
      expect(Backendless.Utils.castArray(null)).to.eql([null])
      expect(Backendless.Utils.castArray(false)).to.eql([false])
      expect(Backendless.Utils.castArray(0)).to.eql([0])
      expect(Backendless.Utils.castArray(123)).to.eql([123])
      expect(Backendless.Utils.castArray({})).to.eql([{}])
      expect(Backendless.Utils.castArray('str')).to.eql(['str'])

      expect(Backendless.Utils.castArray([])).to.eql([])
      expect(Backendless.Utils.castArray([undefined])).to.eql([undefined])
      expect(Backendless.Utils.castArray([null])).to.eql([null])
      expect(Backendless.Utils.castArray([false])).to.eql([false])
      expect(Backendless.Utils.castArray([0])).to.eql([0])
      expect(Backendless.Utils.castArray([123])).to.eql([123])
      expect(Backendless.Utils.castArray([{}])).to.eql([{}])
      expect(Backendless.Utils.castArray(['str'])).to.eql(['str'])
    })

    it('isCustomClassInstance returns true is the passed object is an instance of custom class only', () => {
      class FooClass {
      }

      function FooFn() {
      }

      expect(Backendless.Utils.isCustomClassInstance(new FooClass())).to.equal(true)
      expect(Backendless.Utils.isCustomClassInstance(new FooFn())).to.equal(true)

      expect(Backendless.Utils.isCustomClassInstance()).to.equal(false)
      expect(Backendless.Utils.isCustomClassInstance(null)).to.equal(false)
      expect(Backendless.Utils.isCustomClassInstance(0)).to.equal(false)
      expect(Backendless.Utils.isCustomClassInstance(123)).to.equal(false)
      expect(Backendless.Utils.isCustomClassInstance('str')).to.equal(false)
      expect(Backendless.Utils.isCustomClassInstance({})).to.equal(false)
      expect(Backendless.Utils.isCustomClassInstance([])).to.equal(false)
      expect(Backendless.Utils.isCustomClassInstance(() => ({}))).to.equal(false)
    })

    it('getClassName returns a Class Name', () => {
      class FooClass {
      }

      function FooFn() {
      }

      const FooArrow = () => {
      }

      const FooVarFn = function() {
      }

      const classes = {
        FooFn() {
        },

        FooVar: function() {
        },
      }

      expect(Backendless.Utils.getClassName(FooClass)).to.equal('FooClass')
      expect(Backendless.Utils.getClassName(FooFn)).to.equal('FooFn')
      expect(Backendless.Utils.getClassName(FooArrow)).to.equal('FooArrow')
      expect(Backendless.Utils.getClassName(FooVarFn)).to.equal('FooVarFn')

      expect(Backendless.Utils.getClassName(new FooClass())).to.equal('FooClass')
      expect(Backendless.Utils.getClassName(new FooFn())).to.equal('FooFn')
      expect(Backendless.Utils.getClassName(new FooArrow())).to.equal('FooArrow')
      expect(Backendless.Utils.getClassName(new FooVarFn())).to.equal('FooVarFn')

      expect(Backendless.Utils.getClassName(classes.FooFn)).to.equal('FooFn')
      expect(Backendless.Utils.getClassName(classes.FooVar)).to.equal('FooVar')
      expect(Backendless.Utils.getClassName({ ___class: 'MyClass' })).to.equal('MyClass')

      expect(Backendless.Utils.getClassName()).to.equal(null)
      expect(Backendless.Utils.getClassName(null)).to.equal(null)
      expect(Backendless.Utils.getClassName(0)).to.equal(null)
      expect(Backendless.Utils.getClassName(123)).to.equal(null)
      expect(Backendless.Utils.getClassName('str')).to.equal(null)
      expect(Backendless.Utils.getClassName({})).to.equal(null)
      expect(Backendless.Utils.getClassName([])).to.equal(null)
      expect(Backendless.Utils.getClassName(() => ({}))).to.equal(null)
    })

    it('uuid returns uniq string', () => {
      expect(Backendless.Utils.uuid()).to.be.a('string')
      expect(Backendless.Utils.uuid()).to.not.equal(Backendless.Utils.uuid())
    })
  })

  describe('Helpers', () => {
    it('has links to service classes', () => {
      expect(Backendless.Persistence).to.equal(Backendless.Data)
      expect(Backendless.DataQueryBuilder).to.equal(Backendless.Data.QueryBuilder)
      expect(Backendless.JSONUpdateBuilder).to.equal(Backendless.Data.JSONUpdateBuilder)
      expect(Backendless.LoadRelationsQueryBuilder).to.equal(Backendless.Data.LoadRelationsQueryBuilder)

      expect(Backendless.EmailEnvelope).to.equal(Backendless.Messaging.EmailEnvelope)
      expect(Backendless.Bodyparts).to.equal(Backendless.Messaging.Bodyparts)
      expect(Backendless.PublishOptions).to.equal(Backendless.Messaging.PublishOptions)
      expect(Backendless.DeliveryOptions).to.equal(Backendless.Messaging.DeliveryOptions)
      expect(Backendless.PublishOptionsHeaders).to.equal(Backendless.Messaging.PublishOptionsHeaders)

      expect(Backendless.CustomServices).to.equal(Backendless.BL.CustomServices)
      expect(Backendless.APIServices).to.equal(Backendless.CustomServices)
      expect(Backendless.Events).to.equal(Backendless.BL.Events)
    })

    it('has noConflict function', () => {
      const B = Backendless.noConflict()

      expect(B).to.equal(Backendless)
      expect(global.Backendless).to.equal(undefined)
    })

    it('should support deprecated applicationId and secretKey', function() {
      Backendless.initApp(APP_ID, API_KEY)

      // eslint-disable-next-line no-console
      const _nativeConsoleWarn = console.warn

      // eslint-disable-next-line no-console
      const spyConsoleWarn = console.warn = chai.spy()

      expect(Backendless.applicationId).to.be.equal(APP_ID)
      expect(Backendless.secretKey).to.be.equal(API_KEY)
      expect(() => Backendless.applicationId = 'applicationId').to.throw('') // eslint-disable-line
      expect(() => Backendless.secretKey = 'secretKey').to.throw('') // eslint-disable-line

      Backendless.initApp({ domain: 'https://foo.com', apiKey: 'XXX' })

      expect(Backendless.appId).to.be.equal(null)
      expect(Backendless.apiKey).to.be.equal(null)
      expect(Backendless.domain).to.be.equal('https://foo.com')
      expect(Backendless.appPath).to.be.equal('https://foo.com/api')
      expect(Backendless.apiURI).to.be.equal('/api')

      const appIdWarnMsg = 'getter/setter for Backendless.applicationId is deprecated, instead use Backendless.appId'
      const apiKeyWarnMsg = 'getter/setter for Backendless.secretKey is deprecated, instead use Backendless.apiKey'

      expect(spyConsoleWarn).to.have.been.called.exactly(3)

      expect(spyConsoleWarn).on.nth(1).be.called.with(apiKeyWarnMsg)
      expect(spyConsoleWarn).on.nth(2).be.called.with(appIdWarnMsg)
      expect(spyConsoleWarn).on.nth(3).be.called.with(apiKeyWarnMsg)

      // eslint-disable-next-line no-console
      console.warn = _nativeConsoleWarn
    })

  })
})
