import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forSuite, prepareMockRequest, APP_PATH } from '../helpers/sandbox'

describe('<Counters>', function() {

  forSuite(this)

  const counterName = 'MY_COUNTER_NAME'

  describe('basic', () => {

    it('get', async () => {
      const req1 = prepareMockRequest()

      await Backendless.Counters.get(counterName)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/counters/${counterName}`,
        headers: {},
        body   : undefined
      })
    })

    it('incrementAndGet', async () => {
      const req1 = prepareMockRequest()

      await Backendless.Counters.incrementAndGet(counterName)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/counters/${counterName}/increment/get`,
        headers: {},
        body   : undefined
      })
    })

    it('getAndIncrement', async () => {
      const req1 = prepareMockRequest()

      await Backendless.Counters.getAndIncrement(counterName)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/counters/${counterName}/get/increment`,
        headers: {},
        body   : undefined
      })
    })

    it('decrementAndGet', async () => {
      const req1 = prepareMockRequest()

      await Backendless.Counters.decrementAndGet(counterName)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/counters/${counterName}/decrement/get`,
        headers: {},
        body   : undefined
      })
    })

    it('getAndDecrement', async () => {
      const req1 = prepareMockRequest()

      await Backendless.Counters.getAndDecrement(counterName)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/counters/${counterName}/get/decrement`,
        headers: {},
        body   : undefined
      })
    })

    it('addAndGet', async () => {
      const req1 = prepareMockRequest()

      await Backendless.Counters.addAndGet(counterName, 123)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/counters/${counterName}/incrementby/get?value=123`,
        headers: {},
        body   : undefined
      })
    })

    it('getAndAdd', async () => {
      const req1 = prepareMockRequest()

      await Backendless.Counters.getAndAdd(counterName, 123)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/counters/${counterName}/get/incrementby?value=123`,
        headers: {},
        body   : undefined
      })
    })

    it('compareAndSet', async () => {
      const req1 = prepareMockRequest()

      await Backendless.Counters.compareAndSet(counterName, 10, 20)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/counters/${counterName}/get/compareandset?expected=10&updatedvalue=20`,
        headers: {},
        body   : undefined
      })
    })

    it('reset', async () => {
      const req1 = prepareMockRequest()

      await Backendless.Counters.reset(counterName)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/counters/${counterName}/reset`,
        headers: {},
        body   : undefined
      })
    })

    describe('fails when counterName is not a string', () => {
      const noCounterNameError = 'Counter Name must be provided and must be a string.'

      it('get', async () => {
        await expect(Backendless.Counters.get()).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.get(null)).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.get(true)).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.get(123)).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.get({})).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.get([])).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.get(() => ({}))).to.eventually.be.rejectedWith(noCounterNameError)
      })

      it('incrementAndGet', async () => {
        await expect(Backendless.Counters.incrementAndGet()).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.incrementAndGet(null)).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.incrementAndGet(true)).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.incrementAndGet(123)).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.incrementAndGet({})).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.incrementAndGet([])).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.incrementAndGet(() => ({}))).to.eventually.be.rejectedWith(noCounterNameError)
      })

      it('getAndIncrement', async () => {
        await expect(Backendless.Counters.getAndIncrement()).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.getAndIncrement(null)).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.getAndIncrement(true)).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.getAndIncrement(123)).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.getAndIncrement({})).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.getAndIncrement([])).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.getAndIncrement(() => ({}))).to.eventually.be.rejectedWith(noCounterNameError)
      })

      it('decrementAndGet', async () => {
        await expect(Backendless.Counters.decrementAndGet()).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.decrementAndGet(null)).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.decrementAndGet(true)).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.decrementAndGet(123)).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.decrementAndGet({})).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.decrementAndGet([])).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.decrementAndGet(() => ({}))).to.eventually.be.rejectedWith(noCounterNameError)
      })

      it('getAndDecrement', async () => {
        await expect(Backendless.Counters.getAndDecrement()).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.getAndDecrement(null)).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.getAndDecrement(true)).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.getAndDecrement(123)).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.getAndDecrement({})).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.getAndDecrement([])).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.getAndDecrement(() => ({}))).to.eventually.be.rejectedWith(noCounterNameError)
      })

      it('addAndGet', async () => {
        await expect(Backendless.Counters.addAndGet()).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.addAndGet(null)).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.addAndGet(true)).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.addAndGet(123)).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.addAndGet({})).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.addAndGet([])).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.addAndGet(() => ({}))).to.eventually.be.rejectedWith(noCounterNameError)
      })

      it('getAndAdd', async () => {
        await expect(Backendless.Counters.getAndAdd()).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.getAndAdd(null)).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.getAndAdd(true)).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.getAndAdd(123)).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.getAndAdd({})).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.getAndAdd([])).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.getAndAdd(() => ({}))).to.eventually.be.rejectedWith(noCounterNameError)
      })

      it('compareAndSet', async () => {
        await expect(Backendless.Counters.compareAndSet()).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.compareAndSet(null)).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.compareAndSet(true)).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.compareAndSet(123)).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.compareAndSet({})).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.compareAndSet([])).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.compareAndSet(() => ({}))).to.eventually.be.rejectedWith(noCounterNameError)
      })

      it('reset', async () => {
        await expect(Backendless.Counters.reset()).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.reset(null)).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.reset(true)).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.reset(123)).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.reset({})).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.reset([])).to.eventually.be.rejectedWith(noCounterNameError)
        await expect(Backendless.Counters.reset(() => ({}))).to.eventually.be.rejectedWith(noCounterNameError)
      })

    })

    it('fails when passed value to addAndGet is not a number', async () => {
      const errorMsg = 'Counter Value must be a number.'

      await expect(Backendless.Counters.addAndGet(counterName)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Counters.addAndGet(counterName, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Counters.addAndGet(counterName, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Counters.addAndGet(counterName, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Counters.addAndGet(counterName, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Counters.addAndGet(counterName, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when passed value to getAndAdd is not a number', async () => {
      const errorMsg = 'Counter Value must be a number.'

      await expect(Backendless.Counters.getAndAdd(counterName)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Counters.getAndAdd(counterName, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Counters.getAndAdd(counterName, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Counters.getAndAdd(counterName, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Counters.getAndAdd(counterName, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Counters.getAndAdd(counterName, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when passed expected/updated to compareAndSet are not numbers', async () => {
      const expectedValueErrorMsg = 'Counter Expected Value must be a number.'
      const updatedValueErrorMsg = 'Counter Updated Value must be a number.'

      await expect(Backendless.Counters.compareAndSet(counterName)).to.eventually.be.rejectedWith(expectedValueErrorMsg)
      await expect(Backendless.Counters.compareAndSet(counterName, null)).to.eventually.be.rejectedWith(expectedValueErrorMsg)
      await expect(Backendless.Counters.compareAndSet(counterName, true)).to.eventually.be.rejectedWith(expectedValueErrorMsg)
      await expect(Backendless.Counters.compareAndSet(counterName, {})).to.eventually.be.rejectedWith(expectedValueErrorMsg)
      await expect(Backendless.Counters.compareAndSet(counterName, [])).to.eventually.be.rejectedWith(expectedValueErrorMsg)
      await expect(Backendless.Counters.compareAndSet(counterName, () => ({}))).to.eventually.be.rejectedWith(expectedValueErrorMsg)

      await expect(Backendless.Counters.compareAndSet(counterName, 123)).to.eventually.be.rejectedWith(updatedValueErrorMsg)
      await expect(Backendless.Counters.compareAndSet(counterName, 123, null)).to.eventually.be.rejectedWith(updatedValueErrorMsg)
      await expect(Backendless.Counters.compareAndSet(counterName, 123, true)).to.eventually.be.rejectedWith(updatedValueErrorMsg)
      await expect(Backendless.Counters.compareAndSet(counterName, 123, {})).to.eventually.be.rejectedWith(updatedValueErrorMsg)
      await expect(Backendless.Counters.compareAndSet(counterName, 123, [])).to.eventually.be.rejectedWith(updatedValueErrorMsg)
      await expect(Backendless.Counters.compareAndSet(counterName, 123, () => ({}))).to.eventually.be.rejectedWith(updatedValueErrorMsg)
    })
  })

  describe('list', () => {

    it('gets a list without pattern', async () => {
      const req1 = prepareMockRequest(['foo', 'bar', 'test1'])

      const result = await Backendless.Counters.list()

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/counters/*/list`,
        headers: {},
        body   : undefined
      })

      expect(result).to.be.eql(['foo', 'bar', 'test1'])
    })

    it('gets a list with pattern', async () => {
      const req1 = prepareMockRequest(['test1', 'test2', 'test3'])

      const result = await Backendless.Counters.list('test*')

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/counters/test*/list`,
        headers: {},
        body   : undefined
      })

      expect(result).to.be.eql(['test1', 'test2', 'test3'])
    })

    it('fails when passed expected/updated to compareAndSet are not numbers', async () => {
      const expectedValueErrorMsg = 'Counters Pattern can be a string only'

      await expect(Backendless.Counters.list(true)).to.eventually.be.rejectedWith(expectedValueErrorMsg)
      await expect(Backendless.Counters.list(false)).to.eventually.be.rejectedWith(expectedValueErrorMsg)
      await expect(Backendless.Counters.list(0)).to.eventually.be.rejectedWith(expectedValueErrorMsg)
      await expect(Backendless.Counters.list(123)).to.eventually.be.rejectedWith(expectedValueErrorMsg)
      await expect(Backendless.Counters.list({})).to.eventually.be.rejectedWith(expectedValueErrorMsg)
      await expect(Backendless.Counters.list([])).to.eventually.be.rejectedWith(expectedValueErrorMsg)
      await expect(Backendless.Counters.list(() => ({}))).to.eventually.be.rejectedWith(expectedValueErrorMsg)
    })
  })

  describe('instance', () => {

    const counter = Backendless.Counters.of(counterName)

    it('fails if counterName is not a string', async () => {
      const noCounterNameError = 'Counter Name must be non empty String'

      expect(() => Backendless.Counters.of()).to.throw(noCounterNameError)
      expect(() => Backendless.Counters.of(null)).to.throw(noCounterNameError)
      expect(() => Backendless.Counters.of(true)).to.throw(noCounterNameError)
      expect(() => Backendless.Counters.of(123)).to.throw(noCounterNameError)
      expect(() => Backendless.Counters.of({})).to.throw(noCounterNameError)
      expect(() => Backendless.Counters.of([])).to.throw(noCounterNameError)
      expect(() => Backendless.Counters.of(() => ({}))).to.throw(noCounterNameError)
    })

    it('get', async () => {
      const req1 = prepareMockRequest()

      await counter.get()

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/counters/${counterName}`,
        headers: {},
        body   : undefined
      })
    })

    it('incrementAndGet', async () => {
      const req1 = prepareMockRequest()

      await counter.incrementAndGet()

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/counters/${counterName}/increment/get`,
        headers: {},
        body   : undefined
      })
    })

    it('getAndIncrement', async () => {
      const req1 = prepareMockRequest()

      await counter.getAndIncrement()

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/counters/${counterName}/get/increment`,
        headers: {},
        body   : undefined
      })
    })

    it('decrementAndGet', async () => {
      const req1 = prepareMockRequest()

      await counter.decrementAndGet()

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/counters/${counterName}/decrement/get`,
        headers: {},
        body   : undefined
      })
    })

    it('getAndDecrement', async () => {
      const req1 = prepareMockRequest()

      await counter.getAndDecrement()

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/counters/${counterName}/get/decrement`,
        headers: {},
        body   : undefined
      })
    })

    it('addAndGet', async () => {
      const req1 = prepareMockRequest()

      await counter.addAndGet(123)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/counters/${counterName}/incrementby/get?value=123`,
        headers: {},
        body   : undefined
      })
    })

    it('getAndAdd', async () => {
      const req1 = prepareMockRequest()

      await counter.getAndAdd(123)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/counters/${counterName}/get/incrementby?value=123`,
        headers: {},
        body   : undefined
      })
    })

    it('compareAndSet', async () => {
      const req1 = prepareMockRequest()

      await counter.compareAndSet(10, 20)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/counters/${counterName}/get/compareandset?expected=10&updatedvalue=20`,
        headers: {},
        body   : undefined
      })
    })

    it('reset', async () => {
      const req1 = prepareMockRequest()

      await counter.reset()

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/counters/${counterName}/reset`,
        headers: {},
        body   : undefined
      })
    })
  })

})
