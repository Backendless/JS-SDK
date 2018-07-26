import '../helpers/global'
import sandbox from '../helpers/sandbox'

const APP_ID = 'A98AF58F-6B83-0C7A-FFA9-6A88FD113200'
const SECRET_KEY = 'ACC8DAE2-6402-EBE8-FF74-64439E5D3300'

const Backendless = sandbox.Backendless

describe('initApp', function() {

  sandbox.forSuite()

  it('should change public app relevant variables in Backendless scope', function() {
    Backendless.initApp(APP_ID, SECRET_KEY)

    expect(Backendless.applicationId).to.be.equal(APP_ID)
    expect(Backendless.secretKey).to.be.equal(SECRET_KEY)
  })

  it('should not public variables in Backendless scope', function() {
    Backendless.initApp(APP_ID, SECRET_KEY)

    const appPath = Backendless.appPath

    expect(() => Backendless.applicationId = 'applicationId').to.throw() // eslint-disable-line
    expect(() => Backendless.secretKey = 'secretKey').to.throw() // eslint-disable-line
    expect(() => Backendless.appPath = 'appPath').to.throw() // eslint-disable-line

    expect(Backendless.applicationId).to.be.equal(APP_ID)
    expect(Backendless.secretKey).to.be.equal(SECRET_KEY)
    expect(Backendless.appPath).to.be.equal(appPath)
  })
})