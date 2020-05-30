import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forSuite, prepareMockRequest, APP_PATH } from '../helpers/sandbox'

function Foo(opts) {
  Object.assign(this, opts || {})

  this.foo = 'bar'
  this.___class = 'Foo'
}

describe('<Cache>', function() {

  forSuite(this)

  before(() => {
    Backendless.Cache.setObjectFactory('Foo', Foo)
  })

  const cacheKey = 'MY_CACHE_KEY'
  const cacheValue = { value: 123 }

  describe('Cache.put', () => {
    it('should put primitive value', async () => {
      const req1 = prepareMockRequest()

      await Backendless.Cache.put(cacheKey, 123)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/cache/${cacheKey}`,
        headers: { 'Content-Type': 'application/json' },
        body   : 123
      })
    })

    it('should put object', async () => {
      const req1 = prepareMockRequest()

      await Backendless.Cache.put(cacheKey, cacheValue)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/cache/${cacheKey}`,
        headers: { 'Content-Type': 'application/json' },
        body   : cacheValue
      })
    })

    it('should put instance', async () => {
      const req1 = prepareMockRequest()

      const foo = new Foo()

      await Backendless.Cache.put(cacheKey, foo)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/cache/${cacheKey}`,
        headers: { 'Content-Type': 'application/json' },
        body   : foo
      })
    })

    it('should put with ttl', async () => {
      const req1 = prepareMockRequest()

      await Backendless.Cache.put(cacheKey, cacheValue, 12345)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/cache/${cacheKey}?timeout=12345`,
        headers: { 'Content-Type': 'application/json' },
        body   : cacheValue
      })
    })

    it('fails when key is not a string', async () => {
      const errorMsg = 'Cache Key must be non empty String'

      await expect(Backendless.Cache.put()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.put(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.put(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.put(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.put({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.put([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.put(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    xit('fails when timeToLive is not a positive number', async () => {
      const errorMsg = 'Cache TimeToLive must be a positive number.'

      await expect(Backendless.Cache.put(cacheKey, cacheValue, -123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.put(cacheKey, cacheValue, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.put(cacheKey, cacheValue, 'str')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.put(cacheKey, cacheValue, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.put(cacheKey, cacheValue, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.put(cacheKey, cacheValue, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })
  })

  describe('Cache.get', () => {
    it('should get primitive value', async () => {
      const req1 = prepareMockRequest(() => ({
        body: 123
      }))

      const result = await Backendless.Cache.get(cacheKey)

      expect(result).to.equal(123)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/cache/${cacheKey}`,
        headers: {},
      })
    })

    it('should get object', async () => {
      const req1 = prepareMockRequest(() => ({
        body: 123
      }))

      const result = await Backendless.Cache.get(cacheKey)

      expect(result).to.equal(123)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/cache/${cacheKey}`,
        headers: {},
      })
    })

    it('should get instance', async () => {
      const req1 = prepareMockRequest(() => ({
        body: { ___class: 'Foo', bar: 123 }
      }))

      const result = await Backendless.Cache.get(cacheKey)

      expect(result instanceof Foo).to.equal(true)
      expect(result).to.eql({ ___class: 'Foo', bar: 123, foo: 'bar' })

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/cache/${cacheKey}`,
        headers: {},
      })
    })

    it('fails when key is not a string', async () => {
      const errorMsg = 'Cache Key must be non empty String'

      await expect(Backendless.Cache.get()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.get(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.get(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.get(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.get({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.get([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.get(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })
  })

  describe('Cache.remove', () => {
    it('should remove', async () => {
      const req1 = prepareMockRequest()

      await Backendless.Cache.remove(cacheKey)

      expect(req1).to.deep.include({
        method : 'DELETE',
        path   : `${APP_PATH}/cache/${cacheKey}`,
        headers: {},
      })
    })

    it('fails when key is not a string', async () => {
      const errorMsg = 'Cache Key must be non empty String'

      await expect(Backendless.Cache.remove()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.remove(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.remove(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.remove(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.remove({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.remove([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.remove(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })
  })

  describe('Cache.contains', () => {
    it('should contain', async () => {
      const req1 = prepareMockRequest()

      await Backendless.Cache.contains(cacheKey)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/cache/${cacheKey}/check`,
        headers: {},
      })
    })

    it('fails when key is not a string', async () => {
      const errorMsg = 'Cache Key must be non empty String'

      await expect(Backendless.Cache.contains()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.contains(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.contains(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.contains(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.contains({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.contains([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.contains(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })
  })

  describe('Cache.expireIn', () => {
    it('should expireIn', async () => {
      const req1 = prepareMockRequest()

      await Backendless.Cache.expireIn(cacheKey, 12345)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/cache/${cacheKey}/expireIn?timeout=12345`,
        headers: { 'Content-Type': 'application/json' },
      })
    })

    it('fails when key is not a string', async () => {
      const errorMsg = 'Cache Key must be non empty String'

      await expect(Backendless.Cache.expireIn()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.expireIn(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.expireIn(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.expireIn(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.expireIn({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.expireIn([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.expireIn(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    xit('fails when expireIn is not a positive number', async () => {
      const errorMsg = 'Cache Expiration must be provided and must be a number of seconds.'

      await expect(Backendless.Cache.expireIn(cacheKey)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.expireIn(cacheKey, 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.expireIn(cacheKey, -123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.expireIn(cacheKey, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.expireIn(cacheKey, 'str')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.expireIn(cacheKey, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.expireIn(cacheKey, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.expireIn(cacheKey, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })
  })

  describe('Cache.expireAt', () => {
    it('should expireAt timestamp', async () => {
      const req1 = prepareMockRequest()

      await Backendless.Cache.expireAt(cacheKey, 12345)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/cache/${cacheKey}/expireAt?timestamp=12345`,
        headers: { 'Content-Type': 'application/json' },
      })
    })

    it('should expireAt Date', async () => {
      const req1 = prepareMockRequest()

      const date = new Date()

      await Backendless.Cache.expireAt(cacheKey, date)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/cache/${cacheKey}/expireAt?timestamp=${date.getTime()}`,
        headers: { 'Content-Type': 'application/json' },
      })
    })

    it('fails when key is not a string', async () => {
      const errorMsg = 'Cache Key must be non empty String'

      await expect(Backendless.Cache.expireAt()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.expireAt(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.expireAt(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.expireAt(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.expireAt({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.expireAt([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.expireAt(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    xit('fails when expireAt is not a positive number', async () => {
      const errorMsg = 'Cache Expiration must be provided and must be a timestamp or an instance of Date.'

      await expect(Backendless.Cache.expireAt(cacheKey)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.expireAt(cacheKey, 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.expireAt(cacheKey, -123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.expireAt(cacheKey, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.expireAt(cacheKey, 'str')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.expireAt(cacheKey, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.expireAt(cacheKey, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Cache.expireAt(cacheKey, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })
  })

})
