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
})
