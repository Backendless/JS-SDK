import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { API_KEY, APP_ID, forSuite, prepareMockRequest, APP_PATH, Utils } from '../helpers/sandbox'

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

  it('send many sync messages more than limit', async () => {
    const req1 = prepareMockRequest()

    Backendless.Logging.setMessagesLimit(100)

    for (let i = 1; i <= 200; i++) {
      logger.debug(`m-${i}`)
    }

    await Backendless.Logging.flush()

    expect(req1.body.map(b => b.message)).to.deep.equal([
      'm-1', 'm-2', 'm-3', 'm-4', 'm-5', 'm-6', 'm-7', 'm-8', 'm-9', 'm-10', 'm-11', 'm-12', 'm-13', 'm-14', 'm-15',
      'm-16', 'm-17', 'm-18', 'm-19', 'm-20', 'm-21', 'm-22', 'm-23', 'm-24', 'm-25', 'm-26', 'm-27', 'm-28', 'm-29',
      'm-30', 'm-31', 'm-32', 'm-33', 'm-34', 'm-35', 'm-36', 'm-37', 'm-38', 'm-39', 'm-40', 'm-41', 'm-42', 'm-43',
      'm-44', 'm-45', 'm-46', 'm-47', 'm-48', 'm-49', 'm-50', 'm-51', 'm-52', 'm-53', 'm-54', 'm-55', 'm-56', 'm-57',
      'm-58', 'm-59', 'm-60', 'm-61', 'm-62', 'm-63', 'm-64', 'm-65', 'm-66', 'm-67', 'm-68', 'm-69', 'm-70', 'm-71',
      'm-72', 'm-73', 'm-74', 'm-75', 'm-76', 'm-77', 'm-78', 'm-79', 'm-80', 'm-81', 'm-82', 'm-83', 'm-84', 'm-85',
      'm-86', 'm-87', 'm-88', 'm-89', 'm-90', 'm-91', 'm-92', 'm-93', 'm-94', 'm-95', 'm-96', 'm-97', 'm-98', 'm-99',
      'm-100', 'm-101', 'm-102', 'm-103', 'm-104', 'm-105', 'm-106', 'm-107', 'm-108', 'm-109', 'm-110', 'm-111',
      'm-112', 'm-113', 'm-114', 'm-115', 'm-116', 'm-117', 'm-118', 'm-119', 'm-120', 'm-121', 'm-122', 'm-123',
      'm-124', 'm-125', 'm-126', 'm-127', 'm-128', 'm-129', 'm-130', 'm-131', 'm-132', 'm-133', 'm-134', 'm-135',
      'm-136', 'm-137', 'm-138', 'm-139', 'm-140', 'm-141', 'm-142', 'm-143', 'm-144', 'm-145', 'm-146', 'm-147',
      'm-148', 'm-149', 'm-150', 'm-151', 'm-152', 'm-153', 'm-154', 'm-155', 'm-156', 'm-157', 'm-158', 'm-159',
      'm-160', 'm-161', 'm-162', 'm-163', 'm-164', 'm-165', 'm-166', 'm-167', 'm-168', 'm-169', 'm-170', 'm-171',
      'm-172', 'm-173', 'm-174', 'm-175', 'm-176', 'm-177', 'm-178', 'm-179', 'm-180', 'm-181', 'm-182', 'm-183',
      'm-184', 'm-185', 'm-186', 'm-187', 'm-188', 'm-189', 'm-190', 'm-191', 'm-192', 'm-193', 'm-194', 'm-195',
      'm-196', 'm-197', 'm-198', 'm-199', 'm-200',
    ])
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

  it('should try to send next time if it was failed', async () => {
    const req1 = prepareMockRequest(() => {
      throw new Error('Test Error')
    })

    const req2 = prepareMockRequest()

    Backendless.Logging.setLogReportingPolicy(1, 0.5)

    logger.debug('debug message - 1')
    logger.debug('debug message - 2')

    await Utils.wait(1000)

    expect(req1).to.deep.include({
      method : 'PUT',
      path   : `${APP_PATH}/log`,
      headers: { 'Content-Type': 'application/json' },
    })

    expect(req1.body).to.deep.equal([
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 1', timestamp: req1.body[0].timestamp },
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 2', timestamp: req1.body[1].timestamp }
    ])

    logger.debug('debug message - 3')

    await Utils.wait(1000)

    expect(req2.body).to.deep.equal([
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 1', timestamp: req1.body[0].timestamp },
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 2', timestamp: req1.body[1].timestamp },
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 3', timestamp: req2.body[2].timestamp }
    ])
  })

  it('should keep messages if they were not sent #1', async () => {
    const req1 = prepareMockRequest(() => {
      throw new Error('Test Error1')
    })
    const req2 = prepareMockRequest(() => {
      throw new Error('Test Error2')
    })
    const req3 = prepareMockRequest()

    Backendless.Logging.setLogReportingPolicy(2, 0.5)
    Backendless.Logging.setMessagesLimit(5)

    logger.debug('debug message - 1')
    logger.debug('debug message - 2')

    await Utils.wait(1000)

    logger.debug('debug message - 3')
    logger.debug('debug message - 4')

    await Utils.wait(1000)

    logger.debug('debug message - 5')
    logger.debug('debug message - 6')

    await Utils.wait(1000)

    expect(req1.body).to.deep.equal([
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 1', timestamp: req1.body[0].timestamp },
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 2', timestamp: req1.body[1].timestamp },
    ])

    expect(req2.body).to.deep.equal([
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 1', timestamp: req2.body[0].timestamp },
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 2', timestamp: req2.body[1].timestamp },
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 3', timestamp: req2.body[2].timestamp },
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 4', timestamp: req2.body[3].timestamp },
    ])

    expect(req3.body).to.deep.equal([
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 1', timestamp: req3.body[0].timestamp },
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 2', timestamp: req3.body[1].timestamp },
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 3', timestamp: req3.body[2].timestamp },
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 4', timestamp: req3.body[3].timestamp },
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 5', timestamp: req3.body[4].timestamp },
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 6', timestamp: req3.body[5].timestamp },
    ])
  })

  it('should keep messages if they were not sent #2', async () => {
    const req1 = prepareMockRequest(() => {
      throw new Error('Test Error1')
    })
    const req2 = prepareMockRequest(() => {
      throw new Error('Test Error2')
    })
    const req3 = prepareMockRequest()

    Backendless.Logging.setLogReportingPolicy(2, 0.5)
    Backendless.Logging.setMessagesLimit(5)

    logger.debug('debug message - 1')
    logger.debug('debug message - 2')
    logger.debug('debug message - 3')

    await Utils.wait(1000)

    logger.debug('debug message - 4')
    logger.debug('debug message - 5')
    logger.debug('debug message - 6')

    await Utils.wait(1000)

    logger.debug('debug message - 7')
    logger.debug('debug message - 8')

    await Utils.wait(1000)

    expect(req1.body).to.deep.equal([
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 1', timestamp: req1.body[0].timestamp },
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 2', timestamp: req1.body[1].timestamp },
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 3', timestamp: req1.body[2].timestamp },
    ])

    expect(req2.body).to.deep.equal([
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 1', timestamp: req2.body[0].timestamp },
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 2', timestamp: req2.body[1].timestamp },
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 3', timestamp: req2.body[2].timestamp },
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 4', timestamp: req2.body[3].timestamp },
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 5', timestamp: req2.body[4].timestamp },
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 6', timestamp: req2.body[5].timestamp },
    ])

    expect(req3.body).to.deep.equal([
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 2', timestamp: req3.body[0].timestamp },
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 3', timestamp: req3.body[1].timestamp },
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 4', timestamp: req3.body[2].timestamp },
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 5', timestamp: req3.body[3].timestamp },
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 6', timestamp: req3.body[4].timestamp },
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 7', timestamp: req3.body[5].timestamp },
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message - 8', timestamp: req3.body[6].timestamp },
    ])
  })

  it('should send 100 messages by default', async () => {
    const req1 = prepareMockRequest()

    Backendless.Logging.setLogReportingPolicy(2, 0.5)

    for (let i = 1; i <= 100; i++) {
      logger.debug(`debug message - ${i}`)
    }

    await Utils.wait(1000)

    expect(req1.body).to.have.length(100)
  })

  it('should change max limit when setting numOfMessages', async () => {
    const req1 = prepareMockRequest()

    Backendless.Logging.setLogReportingPolicy(200, 0.5)

    for (let i = 1; i <= 200; i++) {
      logger.debug(`debug message - ${i}`)
    }

    await Utils.wait(1000)

    expect(req1.body).to.have.length(200)
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

  it('should apply default logging config', async () => {
    logger.fatal('fatal message')
    logger.error('error message')
    logger.warn('warn message')
    logger.info('info message')
    logger.debug('debug message')
    logger.trace('trace message')

    const req = prepareMockRequest()

    await Backendless.Logging.flush()

    expect(req.body).to.deep.equal([
      { 'log-level': 'FATAL', 'logger': loggerName, 'message': 'fatal message', timestamp: req.body[0].timestamp },
      { 'log-level': 'ERROR', 'logger': loggerName, 'message': 'error message', timestamp: req.body[1].timestamp },
      { 'log-level': 'WARN', 'logger': loggerName, 'message': 'warn message', timestamp: req.body[2].timestamp },
      { 'log-level': 'INFO', 'logger': loggerName, 'message': 'info message', timestamp: req.body[3].timestamp },
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message', timestamp: req.body[4].timestamp },
      { 'log-level': 'TRACE', 'logger': loggerName, 'message': 'trace message', timestamp: req.body[5].timestamp },
    ])
  })

  it('should apply log levels to logging config', async () => {
    prepareMockRequest([
      {
        name : loggerName,
        level: 'FATAL'
      },
      {
        name : 'Global logger',
        level: 'ERROR'
      }
    ])

    Backendless.initApp({
      appId  : APP_ID,
      apiKey : API_KEY,
      logging: {
        defaultLevel: 'info',
        levels      : {
          [loggerName]: 'warn'
        }
      }
    })

    await Utils.wait(1000)

    const req = prepareMockRequest()

    logger.debug('debug message')
    logger.info('info message')
    logger.fatal('fatal message')
    logger.trace('trace message')

    const unregisteredLogger = Backendless.Logging.getLogger('unregistered')

    unregisteredLogger.info('should not be flushed')
    unregisteredLogger.error('should be flushed')

    await Backendless.Logging.flush()

    expect(req.body).to.deep.equal([
      { 'log-level': 'FATAL', 'logger': loggerName, 'message': 'fatal message', timestamp: req.body[0].timestamp },
      {
        'log-level': 'ERROR',
        'logger'   : 'unregistered',
        'message'  : 'should be flushed',
        timestamp  : req.body[1].timestamp
      },
    ])
  })

  it('should not load log levels', async () => {
    Backendless.initApp({
      appId  : APP_ID,
      apiKey : API_KEY,
      logging: {
        loadLevels: false,
      }
    })

    const req = prepareMockRequest()

    logger.debug('debug message')
    logger.info('info message')
    logger.fatal('fatal message')
    logger.trace('trace message')

    await Backendless.Logging.flush()

    expect(req.body).to.deep.equal([
      { 'log-level': 'DEBUG', 'logger': loggerName, 'message': 'debug message', timestamp: req.body[0].timestamp },
      { 'log-level': 'INFO', 'logger': loggerName, 'message': 'info message', timestamp: req.body[1].timestamp },
      { 'log-level': 'FATAL', 'logger': loggerName, 'message': 'fatal message', timestamp: req.body[2].timestamp },
      { 'log-level': 'TRACE', 'logger': loggerName, 'message': 'trace message', timestamp: req.body[3].timestamp },
    ])
  })
})
