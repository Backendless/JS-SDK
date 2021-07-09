import Counter from './counter'

export default class Counters {
  constructor(app) {
    this.app = app
  }

  of(name) {
    return new Counter(name, this)
  }

  async list(pattern) {
    if (pattern !== null && pattern !== undefined && typeof pattern !== 'string') {
      throw new Error('Counters Pattern can be a string only')
    }

    return this.app.request.get({
      url: this.app.urls.countersList(pattern),
    })
  }

  async incrementAndGet(counterName) {
    if (!counterName || typeof counterName !== 'string') {
      throw new Error('Counter Name must be provided and must be a string.')
    }

    return this.app.request.put({
      url: this.app.urls.counterIncrementAndGet(counterName),
    })
  }

  async getAndIncrement(counterName) {
    if (!counterName || typeof counterName !== 'string') {
      throw new Error('Counter Name must be provided and must be a string.')
    }

    return this.app.request.put({
      url: this.app.urls.counterGetAndIncrement(counterName),
    })
  }

  async decrementAndGet(counterName) {
    if (!counterName || typeof counterName !== 'string') {
      throw new Error('Counter Name must be provided and must be a string.')
    }

    return this.app.request.put({
      url: this.app.urls.counterDecrementAndGet(counterName),
    })
  }

  async getAndDecrement(counterName) {
    if (!counterName || typeof counterName !== 'string') {
      throw new Error('Counter Name must be provided and must be a string.')
    }

    return this.app.request.put({
      url: this.app.urls.counterGetAndDecrement(counterName),
    })
  }

  async reset(counterName) {
    if (!counterName || typeof counterName !== 'string') {
      throw new Error('Counter Name must be provided and must be a string.')
    }

    return this.app.request.put({
      url: this.app.urls.counterReset(counterName),
    })
  }

  async get(counterName) {
    if (!counterName || typeof counterName !== 'string') {
      throw new Error('Counter Name must be provided and must be a string.')
    }

    return this.app.request.get({
      url: this.app.urls.counter(counterName),
    })
  }

  async addAndGet(counterName, value) {
    if (!counterName || typeof counterName !== 'string') {
      throw new Error('Counter Name must be provided and must be a string.')
    }

    if (typeof value !== 'number') {
      throw new Error('Counter Value must be a number.')
    }

    return this.app.request.put({
      url  : this.app.urls.counterAddAndGet(counterName),
      query: { value },
    })
  }

  async getAndAdd(counterName, value) {
    if (!counterName || typeof counterName !== 'string') {
      throw new Error('Counter Name must be provided and must be a string.')
    }

    if (typeof value !== 'number') {
      throw new Error('Counter Value must be a number.')
    }

    return this.app.request.put({
      url  : this.app.urls.counterGetAndAdd(counterName),
      query: { value },
    })
  }

  async compareAndSet(counterName, expected, updated) {
    if (!counterName || typeof counterName !== 'string') {
      throw new Error('Counter Name must be provided and must be a string.')
    }

    if (typeof expected !== 'number') {
      throw new Error('Counter Expected Value must be a number.')
    }

    if (typeof updated !== 'number') {
      throw new Error('Counter Updated Value must be a number.')
    }

    return this.app.request.put({
      url  : this.app.urls.counterCompareAndSet(counterName),
      query: { expected, updatedvalue: updated },
    })
  }
}
