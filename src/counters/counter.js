import Utils from '../utils'

import {
  incrementAndGet,
  decrementAndGet,
  get,
  getAndIncrement,
  getAndDecrement,
  getAndAdd,
  addAndGet,
  compareAndSet,
  reset
} from './methods'

class Counter {
  constructor(name, app) {
    if (!name || !Utils.isString(name)) {
      throw new Error('Counter Name must be non empty String')
    }

    this.name = name
    this.app = app
  }
}

const withCounterName = method => function(...args) {
  return method.call(this, this.name, ...args)
}

//TODO: will be removed when remove sync methods
const namespaceLabel = 'Backendless.Counter.of(<CounterName>)'

Object.assign(Counter.prototype, {

  incrementAndGet: Utils.promisified(withCounterName(incrementAndGet)),

  getAndIncrement: Utils.promisified(withCounterName(getAndIncrement)),

  decrementAndGet: Utils.promisified(withCounterName(decrementAndGet)),

  getAndDecrement: Utils.promisified(withCounterName(getAndDecrement)),

  reset: Utils.promisified(withCounterName(reset)),

  get: Utils.promisified(withCounterName(get)),

  addAndGet: Utils.promisified(withCounterName(addAndGet)),

  getAndAdd: Utils.promisified(withCounterName(getAndAdd)),

  compareAndSet: Utils.promisified(withCounterName(compareAndSet)),

})

export default Counter

