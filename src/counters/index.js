import Utils from '../utils'

import Counter from './counter'

export default class Counters {
  constructor(app) {
    this.app = app
  }

  of(name) {
    return new Counter(name, this)
  }

  async incrementAndGet(counterName, asyncHandler) {
    if (!counterName || !Utils.isString(counterName)) {
      throw new Error('Counter Name must be non empty String')
    }

    if (asyncHandler) {
      asyncHandler = Utils.wrapAsync(asyncHandler)
    }

    return this.app.request.put({
      url         : this.app.urls.counterIncrementAndGet(counterName),
      asyncHandler: asyncHandler
    })
  }

  async getAndIncrement(counterName, asyncHandler) {
    if (!counterName || !Utils.isString(counterName)) {
      throw new Error('Counter Name must be non empty String')
    }

    if (asyncHandler) {
      asyncHandler = Utils.wrapAsync(asyncHandler)
    }

    return this.app.request.put({
      url         : this.app.urls.counterGetAndIncrement(counterName),
      asyncHandler: asyncHandler
    })
  }

  async decrementAndGet(counterName, asyncHandler) {
    if (!counterName || !Utils.isString(counterName)) {
      throw new Error('Counter Name must be non empty String')
    }

    if (asyncHandler) {
      asyncHandler = Utils.wrapAsync(asyncHandler)
    }

    return this.app.request.put({
      url         : this.app.urls.counterDecrementAndGet(counterName),
      asyncHandler: asyncHandler
    })
  }

  async getAndDecrement(counterName, asyncHandler) {
    if (!counterName || !Utils.isString(counterName)) {
      throw new Error('Counter Name must be non empty String')
    }

    if (asyncHandler) {
      asyncHandler = Utils.wrapAsync(asyncHandler)
    }

    return this.app.request.put({
      url         : this.app.urls.counterGetAndDecrement(counterName),
      asyncHandler: asyncHandler
    })
  }

  async reset(counterName, asyncHandler) {
    if (!counterName || !Utils.isString(counterName)) {
      throw new Error('Counter Name must be non empty String')
    }

    if (asyncHandler) {
      asyncHandler = Utils.wrapAsync(asyncHandler)
    }

    return this.app.request.put({
      url         : this.app.urls.counterReset(counterName),
      asyncHandler: asyncHandler
    })
  }

  async get(counterName, asyncHandler) {
    if (!counterName || !Utils.isString(counterName)) {
      throw new Error('Counter Name must be non empty String')
    }

    if (asyncHandler) {
      asyncHandler = Utils.wrapAsync(asyncHandler)
    }

    return this.app.request.get({
      url         : this.app.urls.counter(counterName),
      asyncHandler: asyncHandler
    })
  }

  async addAndGet(counterName, value, asyncHandler) {
    if (!counterName || !Utils.isString(counterName)) {
      throw new Error('Counter Name must be non empty String')
    }

    if (!Utils.isNumber(value)) {
      throw new Error('Counter Value must number')
    }

    if (asyncHandler) {
      asyncHandler = Utils.wrapAsync(asyncHandler)
    }

    return this.app.request.put({
      url         : this.app.urls.counterAddAndGet(counterName),
      query       : { value },
      asyncHandler: asyncHandler
    })
  }

  async getAndAdd(counterName, value, asyncHandler) {
    if (!counterName || !Utils.isString(counterName)) {
      throw new Error('Counter Name must be non empty String')
    }

    if (!Utils.isNumber(value)) {
      throw new Error('Counter "value" must be Number')
    }

    if (asyncHandler) {
      asyncHandler = Utils.wrapAsync(asyncHandler)
    }

    return this.app.request.put({
      url         : this.app.urls.counterGetAndAdd(counterName),
      query       : { value },
      asyncHandler: asyncHandler
    })
  }

  async compareAndSet(counterName, expected, updated, asyncHandler) {
    if (!counterName || !Utils.isString(counterName)) {
      throw new Error('Counter Name must be non empty String')
    }

    if (!Utils.isNumber(expected)) {
      throw new Error('Counter "expected" value must be Number')
    }

    if (!Utils.isNumber(updated)) {
      throw new Error('Counter "updated" value must be Number')
    }

    if (asyncHandler) {
      asyncHandler = Utils.wrapAsync(asyncHandler)
    }

    return this.app.request.put({
      url         : this.app.urls.counterCompareAndSet(counterName),
      query       : { expected, updatedvalue: updated },
      asyncHandler: asyncHandler
    })
  }
}
