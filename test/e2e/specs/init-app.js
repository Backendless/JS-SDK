import sandbox from '../helpers/sandbox'

const APP_ID = 'A98AF58F-6B83-0C7A-FFA9-6A88FD113200'
const API_KEY = 'ACC8DAE2-6402-EBE8-FF74-64439E5D3300'

const Backendless = sandbox.Backendless

describe('initApp', function() {

  sandbox.forSuite()

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

  it('should not public variables in Backendless scope', function() {
    Backendless.initApp(APP_ID, API_KEY)

    const appPath = Backendless.appPath

    expect(() => Backendless.applicationId = 'applicationId').to.throw() // eslint-disable-line
    expect(() => Backendless.secretKey = 'secretKey').to.throw() // eslint-disable-line
    expect(() => Backendless.appPath = 'appPath').to.throw() // eslint-disable-line

    expect(Backendless.applicationId).to.be.equal(APP_ID)
    expect(Backendless.secretKey).to.be.equal(API_KEY)
    expect(Backendless.appPath).to.be.equal(appPath)
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
})
