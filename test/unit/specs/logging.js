import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forSuite, prepareMockRequest, APP_PATH, Utils } from '../helpers/sandbox'

describe('<Logging>', function() {

  const loggerName = 'MY_LOGGER_NAME'

  let logger

  forSuite(this)

  beforeEach(() => {
    logger = Backendless.Logging.getLogger(loggerName)
  })

  afterEach(() => {
    Backendless.Logging.reset()
  })

  it('fails when loggerName is not a string', async () => {
    const errorMsg = 'Logger Name must be provided and must be a string.'

    expect(() => Backendless.Logging.getLogger()).to.throw(errorMsg)
    expect(() => Backendless.Logging.getLogger('')).to.throw(errorMsg)
    expect(() => Backendless.Logging.getLogger(null)).to.throw(errorMsg)
    expect(() => Backendless.Logging.getLogger(true)).to.throw(errorMsg)
    expect(() => Backendless.Logging.getLogger(false)).to.throw(errorMsg)
    expect(() => Backendless.Logging.getLogger(123)).to.throw(errorMsg)
    expect(() => Backendless.Logging.getLogger(0)).to.throw(errorMsg)
    expect(() => Backendless.Logging.getLogger({})).to.throw(errorMsg)
    expect(() => Backendless.Logging.getLogger([])).to.throw(errorMsg)
    expect(() => Backendless.Logging.getLogger(() => ({}))).to.throw(errorMsg)
  })

  it('has name', () => {
    expect(logger.name).to.be.equal(loggerName)
  })

  it('equals loggers', () => {
    const logger2 = Backendless.Logging.getLogger(loggerName)

    expect(logger === logger2).to.equal(true)
  })

  it('send messages pool', async () => {
    const req1 = prepareMockRequest()

    Backendless.Logging.setLogReportingPolicy(100, 100)

    logger.debug('debug message')
    logger.info('info message')
    logger.warn('warn message', new Error('warn exception').stack)
    logger.error('error message', new Error('error exception').stack)
    logger.fatal('fatal message', new Error('fatal exception').stack)
    logger.trace('trace message')
    logger.debug('debug message')
    logger.debug('debug message')

    await Backendless.Logging.flush()

    expect(req1).to.deep.include({
      method : 'PUT',
      path   : `${APP_PATH}/log`,
      headers: { 'Content-Type': 'application/json' },
    })

    expect(req1.body[0]).to.deep.include({
      'log-level': 'DEBUG',
      'logger'   : loggerName,
      'message'  : 'debug message',
    })

    expect(req1.body[1]).to.deep.include({
      'log-level': 'INFO',
      'logger'   : loggerName,
      'message'  : 'info message',
    })

    expect(req1.body[2]).to.deep.include({
      'log-level': 'WARN',
      'logger'   : loggerName,
      'message'  : 'warn message',
    })

    expect(req1.body[3]).to.deep.include({
      'log-level': 'ERROR',
      'logger'   : loggerName,
      'message'  : 'error message',
    })

    expect(req1.body[4]).to.deep.include({
      'log-level': 'FATAL',
      'logger'   : loggerName,
      'message'  : 'fatal message',
    })

    expect(req1.body[5]).to.deep.include({
      'log-level': 'TRACE',
      'logger'   : loggerName,
      'message'  : 'trace message',
    })

    expect(req1.body[6]).to.deep.include({
      'log-level': 'DEBUG',
      'logger'   : loggerName,
      'message'  : 'debug message',
    })

    expect(req1.body[7]).to.deep.include({
      'log-level': 'DEBUG',
      'logger'   : loggerName,
      'message'  : 'debug message',
    })

    expect(req1.body[0].timestamp).to.be.a('number')
    expect(req1.body[1].timestamp).to.be.a('number')
    expect(req1.body[2].timestamp).to.be.a('number')
    expect(req1.body[3].timestamp).to.be.a('number')
    expect(req1.body[4].timestamp).to.be.a('number')
    expect(req1.body[5].timestamp).to.be.a('number')
    expect(req1.body[6].timestamp).to.be.a('number')
    expect(req1.body[7].timestamp).to.be.a('number')

    expect(req1.body[2].exception).to.include('warn exception')
    expect(req1.body[3].exception).to.include('error exception')
    expect(req1.body[4].exception).to.include('fatal exception')
  })

  it('throws an error when message is not string', async () => {
    const errorMsg = '"message" must be a string'

    async function check(method) {
      expect(() => logger[method](0)).to.throw(errorMsg)
      expect(() => logger[method](123)).to.throw(errorMsg)
      expect(() => logger[method](true)).to.throw(errorMsg)
      expect(() => logger[method](false)).to.throw(errorMsg)
      expect(() => logger[method](null)).to.throw(errorMsg)
      expect(() => logger[method](undefined)).to.throw(errorMsg)
      expect(() => logger[method](_ => _)).to.throw(errorMsg)
      expect(() => logger[method]({ bar: 123 })).to.throw(errorMsg)
      expect(() => logger[method](['foo', 123, true, false, null, undefined, { bar: 123 }])).to.throw(errorMsg)
    }

    await check('debug')
    await check('info')
    await check('warn')
    await check('error')
    await check('fatal')
    await check('trace')
  })

  it('send messages pool by timer', async () => {
    const req1 = prepareMockRequest()

    Backendless.Logging.setLogReportingPolicy(1, 1)

    logger.debug('debug message')

    await Utils.wait(1000)

    expect(req1).to.deep.include({
      method : 'PUT',
      path   : `${APP_PATH}/log`,
      headers: { 'Content-Type': 'application/json' },
    })

    expect(req1.body[0]).to.deep.include({
      'log-level': 'DEBUG',
      'logger'   : loggerName,
      'message'  : 'debug message',
    })

    expect(req1.body[0].timestamp).to.be.a('number')
  })

  it('should not run timer if it is already running', async () => {
    const req1 = prepareMockRequest()

    Backendless.Logging.setLogReportingPolicy(1, 2)

    logger.debug('debug message - 1')

    const flushInterval1 = Backendless.Logging.flushInterval

    logger.debug('debug message - 2')

    const flushInterval2 = Backendless.Logging.flushInterval

    expect(flushInterval1).to.be.equal(flushInterval2)

    await Utils.wait(2000)

    expect(req1).to.deep.include({
      method : 'PUT',
      path   : `${APP_PATH}/log`,
      headers: { 'Content-Type': 'application/json' },
    })

    expect(req1.body[0]).to.deep.include({
      'log-level': 'DEBUG',
      'logger'   : loggerName,
      'message'  : 'debug message - 1',
    })

    expect(req1.body[1]).to.deep.include({
      'log-level': 'DEBUG',
      'logger'   : loggerName,
      'message'  : 'debug message - 2',
    })
  })

  it('should return the same request promise', async () => {
    prepareMockRequest(() => ({ delay: 2000 }))

    logger.debug('debug message - 1')

    const requestPromise1 = Backendless.Logging.flush()

    logger.debug('debug message - 2')

    const requestPromise2 = Backendless.Logging.flush()

    await Utils.wait(500)

    const requestPromise3 = Backendless.Logging.flush()

    await requestPromise1
    await requestPromise2
    await requestPromise3
  })

  it('should send all the messages', async () => {
    const req1 = prepareMockRequest(() => ({ delay: 1000 }))
    const req2 = prepareMockRequest(() => ({ delay: 1000 }))

    logger.debug('debug message - 1')

    const requestPromise1 = Backendless.Logging.flush()

    await Utils.wait(100)

    logger.debug('debug message - 2')

    await requestPromise1

    const requestPromise2 = Backendless.Logging.flush()

    await Utils.wait(100)

    await requestPromise2

    expect(req1.body).to.have.length(1)
    expect(req2.body).to.have.length(1)

    expect(req1.body[0]).to.deep.include({
      'log-level': 'DEBUG',
      'logger'   : loggerName,
      'message'  : 'debug message - 1',
    })

    expect(req2.body[0]).to.deep.include({
      'log-level': 'DEBUG',
      'logger'   : loggerName,
      'message'  : 'debug message - 2',
    })
  })
})
