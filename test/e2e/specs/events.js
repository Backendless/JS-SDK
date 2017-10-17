import '../helpers/global'
import sandbox from '../helpers/sandbox'

const Backendless = sandbox.Backendless

describe('Backendless.Events', function() {

  sandbox.forSuite()

  it('dispatch event with event arguments', function() {
    return expect(Backendless.Events.dispatch('customEvent', {})).to.eventually.be.empty
  })

  it('dispatch event without event arguments', function() {
    return expect(Backendless.Events.dispatch('customEvent')).to.eventually.be.empty
  })

  it('dispatch event without event name', function() {
    return expect(Backendless.Events.dispatch()).to.eventually.be
      .rejectedWith(Error, 'Event Name must be provided and must be not an empty STRING!')
  })

})
