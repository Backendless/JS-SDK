import Utils from '../utils'

import Counter from './counter'

export default class Counters {
  constructor(app) {
    this.app = app

    Utils.enableAsyncHandlers(this, [
      'incrementAndGet',
      'getAndIncrement',
      'decrementAndGet',
      'getAndDecrement',
      'reset',
      'get',
      'addAndGet',
      'getAndAdd',
      'compareAndSet',
    ])
  }

  of(name) {
    return new Counter(name, this)
  }

  async incrementAndGet(counterName) {
    if (!counterName || !Utils.isString(counterName)) {
      throw new Error('Counter Name must be non empty String')
    }

    return this.app.request.put({
      url: this.app.urls.counterIncrementAndGet(counterName),
    })
  }

  async getAndIncrement(counterName) {
    if (!counterName || !Utils.isString(counterName)) {
      throw new Error('Counter Name must be non empty String')
    }

    return this.app.request.put({
      url: this.app.urls.counterGetAndIncrement(counterName),
    })
  }

  async decrementAndGet(counterName) {
    if (!counterName || !Utils.isString(counterName)) {
      throw new Error('Counter Name must be non empty String')
    }

    return this.app.request.put({
      url: this.app.urls.counterDecrementAndGet(counterName),
    })
  }

  async getAndDecrement(counterName) {
    if (!counterName || !Utils.isString(counterName)) {
      throw new Error('Counter Name must be non empty String')
    }

    return this.app.request.put({
      url: this.app.urls.counterGetAndDecrement(counterName),
    })
  }

  async reset(counterName) {
    if (!counterName || !Utils.isString(counterName)) {
      throw new Error('Counter Name must be non empty String')
    }

    return this.app.request.put({
      url: this.app.urls.counterReset(counterName),
    })
  }

  async get(counterName) {
    if (!counterName || !Utils.isString(counterName)) {
      throw new Error('Counter Name must be non empty String')
    }

    return this.app.request.get({
      url: this.app.urls.counter(counterName),
    })
  }

  async addAndGet(counterName, value) {
    if (!counterName || !Utils.isString(counterName)) {
      throw new Error('Counter Name must be non empty String')
    }

    if (!Utils.isNumber(value)) {
      throw new Error('Counter Value must number')
    }

    return this.app.request.put({
      url  : this.app.urls.counterAddAndGet(counterName),
      query: { value },
    })
  }

  async getAndAdd(counterName, value) {
    if (!counterName || !Utils.isString(counterName)) {
      throw new Error('Counter Name must be non empty String')
    }

    if (!Utils.isNumber(value)) {
      throw new Error('Counter "value" must be Number')
    }

    return this.app.request.put({
      url  : this.app.urls.counterGetAndAdd(counterName),
      query: { value },
    })
  }

  async compareAndSet(counterName, expected, updated) {
    if (!counterName || !Utils.isString(counterName)) {
      throw new Error('Counter Name must be non empty String')
    }

    if (!Utils.isNumber(expected)) {
      throw new Error('Counter "expected" value must be Number')
    }

    if (!Utils.isNumber(updated)) {
      throw new Error('Counter "updated" value must be Number')
    }

    return this.app.request.put({
      url  : this.app.urls.counterCompareAndSet(counterName),
      query: { expected, updatedvalue: updated },
    })
  }
}
