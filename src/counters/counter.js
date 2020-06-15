export default class Counter {
  constructor(name, counters) {
    if (!name || typeof name !== 'string') {
      throw new Error('Counter Name must be non empty String')
    }

    this.name = name
    this.counters = counters
  }

  incrementAndGet() {
    return this.counters.incrementAndGet(this.name)
  }

  getAndIncrement() {
    return this.counters.getAndIncrement(this.name)
  }

  decrementAndGet() {
    return this.counters.decrementAndGet(this.name)
  }

  getAndDecrement() {
    return this.counters.getAndDecrement(this.name)
  }

  reset() {
    return this.counters.reset(this.name)
  }

  get() {
    return this.counters.get(this.name)
  }

  addAndGet(value) {
    return this.counters.addAndGet(this.name, value)
  }

  getAndAdd(value) {
    return this.counters.getAndAdd(this.name, value)
  }

  compareAndSet(expected, updated) {
    return this.counters.compareAndSet(this.name, expected, updated)
  }
}


