import Utils from '../utils'
import { Validators } from '../validators'

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
    Validators.requiredString('Counter Name', counterName)

    return this.app.request.put({
      url: this.app.urls.counterIncrementAndGet(counterName),
    })
  }

  async getAndIncrement(counterName) {
    Validators.requiredString('Counter Name', counterName)

    return this.app.request.put({
      url: this.app.urls.counterGetAndIncrement(counterName),
    })
  }

  async decrementAndGet(counterName) {
    Validators.requiredString('Counter Name', counterName)

    return this.app.request.put({
      url: this.app.urls.counterDecrementAndGet(counterName),
    })
  }

  async getAndDecrement(counterName) {
    Validators.requiredString('Counter Name', counterName)

    return this.app.request.put({
      url: this.app.urls.counterGetAndDecrement(counterName),
    })
  }

  async reset(counterName) {
    Validators.requiredString('Counter Name', counterName)

    return this.app.request.put({
      url: this.app.urls.counterReset(counterName),
    })
  }

  async get(counterName) {
    Validators.requiredString('Counter Name', counterName)

    return this.app.request.get({
      url: this.app.urls.counter(counterName),
    })
  }

  async addAndGet(counterName, value) {
    Validators.requiredString('Counter Name', counterName)
    Validators.anyNumber('Counter Value', value)

    return this.app.request.put({
      url  : this.app.urls.counterAddAndGet(counterName),
      query: { value },
    })
  }

  async getAndAdd(counterName, value) {
    Validators.requiredString('Counter Name', counterName)
    Validators.anyNumber('Counter Value', value)

    return this.app.request.put({
      url  : this.app.urls.counterGetAndAdd(counterName),
      query: { value },
    })
  }

  async compareAndSet(counterName, expected, updated) {
    Validators.requiredString('Counter Name', counterName)
    Validators.anyNumber('Counter Expected Value', expected)
    Validators.anyNumber('Counter Updated Value', updated)

    return this.app.request.put({
      url  : this.app.urls.counterCompareAndSet(counterName),
      query: { expected, updatedvalue: updated },
    })
  }
}
