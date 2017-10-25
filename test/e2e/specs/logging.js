import '../helpers/global'
import sandbox from '../helpers/sandbox'

const Backendless = sandbox.Backendless

describe('Backendless.Logging', function() {

  sandbox.forSuite()

  it('has name', function() {
    return Promise.resolve()
      .then(() => Backendless.Logging.getLogger('MyLogger'))
      .then(logger => expect(logger.name).to.be.equal('MyLogger'))
  })

  it('equals loggers', function() {
    const logger1 = Backendless.Logging.getLogger('MyLogger')
    const logger2 = Backendless.Logging.getLogger('MyLogger')

    return expect(logger1).to.be.equal(logger2)
  })

  it('send messages pool', function() {
    return Promise.resolve()
      .then(() => Backendless.Logging.getLogger('MyLogger'))
      .then(logger => {
        logger.debug('I\'m debug message')
        logger.info('I\'m info message')
        logger.warn('I\'m warn message', new Error('I\'m warn exception').stack)
        logger.error('I\'m error message', new Error('I\'m error exception').stack)
        logger.fatal('I\'m fatal message', new Error('I\'m fatal exception').stack)
        logger.trace('I\'m debug message')
        logger.debug('I\'m debug message')
        logger.debug('I\'m debug message')

        return Backendless.Logging.flush()
      })
  })

})
