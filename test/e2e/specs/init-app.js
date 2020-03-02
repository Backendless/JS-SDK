import '../helpers/global'
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
})