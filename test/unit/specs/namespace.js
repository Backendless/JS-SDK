import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_ID, API_KEY } from '../helpers/sandbox'

describe('Namespace', () => {

  describe('Basic init', function() {

    it('should change public app relevant variables in Backendless scope', function() {
      Backendless.initApp(APP_ID, API_KEY)

      expect(Backendless.applicationId).to.be.equal(APP_ID)
      expect(Backendless.secretKey).to.be.equal(API_KEY)
    })

    it('should change public app relevant variables in Backendless scope using object config', function() {
      Backendless.initApp({ appId: APP_ID, apiKey: API_KEY })

      expect(Backendless.applicationId).to.be.equal(APP_ID)
      expect(Backendless.secretKey).to.be.equal(API_KEY)
    })

    it('should not change public variables in Backendless scope', function() {
      Backendless.serverURL = 'http://foo.bar'
      Backendless.initApp(APP_ID, API_KEY)

      expect(() => Backendless.applicationId = 'applicationId').to.throw()
      expect(() => Backendless.secretKey = 'secretKey').to.throw()
      expect(() => Backendless.appPath = 'appPath').to.throw()
      expect(() => Backendless.standalone = 'standalone').to.throw()
      expect(() => Backendless.device = 'device').to.throw()

      expect(Backendless.applicationId).to.be.equal(APP_ID)
      expect(Backendless.secretKey).to.be.equal(API_KEY)
      expect(Backendless.appPath).to.be.equal(`http://foo.bar/${APP_ID}/${API_KEY}`)
    })
  })

  describe('Standalone', function() {

    it('has several Backendless apps at the same time', function() {
      const app2 = Backendless.initApp({ appId: 'appId-2', apiKey: 'apiKey-2', standalone: true })
      const app3 = Backendless.initApp({ appId: 'appId-3', apiKey: 'apiKey-3', standalone: true })

      expect(app2.applicationId).to.be.equal('appId-2')
      expect(app2.secretKey).to.be.equal('apiKey-2')

      expect(app3.applicationId).to.be.equal('appId-3')
      expect(app3.secretKey).to.be.equal('apiKey-3')
    })
  })

  describe('Debug Mode', function() {

    it('should set debug mode', function() {
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

  describe('Server Code', function() {

    it('should set ServerCode', function() {
      Backendless.ServerCode = {
        addService() {
          return true
        }
      }

      expect(Backendless.ServerCode.addService()).to.be.equal(true)
    })
  })

  describe('Device', function() {

    it('should fail if device is not setup yet', function() {
      let error

      try {
        Backendless.device
      } catch (e) {
        error = e
      }

      expect(error.message).to.equal(
        'Device is not defined. Please, run the Backendless.setupDevice'
      )
    })

    it('should setup device', function() {
      Backendless.setupDevice({
        uuid    : 'uuid',
        platform: 'platform',
        version : 'version',
      })

      expect(Backendless.device.uuid).to.equal('uuid')
      expect(Backendless.device.platform).to.equal('PLATFORM')
      expect(Backendless.device.version).to.equal('version')
    })

    it('should fail if it has missed parameter', function() {
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

  describe('XMLHttpRequest', function() {
    it('should setup XMLHttpRequest', function() {
      class TestXMLHttpRequest {
      }

      Backendless.XMLHttpRequest = TestXMLHttpRequest

      expect(Backendless.XMLHttpRequest).to.equal(TestXMLHttpRequest)
    })
  })

  describe('Browser', function() {
    it('should return empty object in Nodejs env', function() {
      expect(Backendless.browser).to.eql({})
    })
  })
})
