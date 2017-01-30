import '../helpers/global'

const APP_ID = 'A98AF58F-6B83-0C7A-FFA9-6A88FD113200'
const SECRET_KEY = 'ACC8DAE2-6402-EBE8-FF74-64439E5D3300'

const Backendless = require('../../../src/backendless')

describe('initApp', function() {
  it('should change public app relevant variables in Backendless scope', function() {
    Backendless.initApp(APP_ID, SECRET_KEY)

    expect(Backendless.applicationId).to.be.equal(APP_ID)
    expect(Backendless.secretKey).to.be.equal(SECRET_KEY)
  })
})