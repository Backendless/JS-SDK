import '../helpers/global'
import sandbox from '../helpers/sandbox'

const Backendless = sandbox.Backendless

describe('Messaging', function() {
  sandbox.forTest()

  it('Create new table', function() {
    return Backendless.Messaging.publish('my-channel', { foo: 'bar' })
      .then(result => {
        expect(result.messageId).to.be.a('string')
        expect(result.status).to.be.equal('scheduled')
        expect(result.errorMessage).to.be.null
      })
  })

})