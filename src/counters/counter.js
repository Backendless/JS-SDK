import Utils from '../utils'

export default class Counter {
  constructor(name, counters) {
    if (!name || !Utils.isString(name)) {
      throw new Error('Counter Name must be non empty String')
    }

    this.name = name
    this.counters = counters
  }

  incrementAndGet(asyncHandler) {
    return this.counters.incrementAndGet(this.name, asyncHandler)
  }

  getAndIncrement(asyncHandler) {
    return this.counters.getAndIncrement(this.name, asyncHandler)
  }

  decrementAndGet(asyncHandler) {
    return this.counters.decrementAndGet(this.name, asyncHandler)
  }

  getAndDecrement(asyncHandler) {
    return this.counters.getAndDecrement(this.name, asyncHandler)
  }

  reset(asyncHandler) {
    return this.counters.reset(this.name, asyncHandler)
  }

  get(asyncHandler) {
    return this.counters.get(this.name, asyncHandler)
  }

  addAndGet(value, asyncHandler) {
    return this.counters.addAndGet(this.name, value, asyncHandler)
  }

  getAndAdd(value, asyncHandler) {
    return this.counters.getAndAdd(this.name, value, asyncHandler)
  }

  compareAndSet(expected, updated, asyncHandler) {
    return this.counters.compareAndSet(this.name, expected, updated, asyncHandler)
  }
}


