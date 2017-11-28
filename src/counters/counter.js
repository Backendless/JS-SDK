import Utils from '../utils'
import { deprecated } from '../decorators'

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

export default class Counter {
  constructor(name) {
    if (!name || !Utils.isString(name)) {
      throw new Error('Counter Name must be non empty String')
    }

    this.name = name
  }
}

const withCounterName = method => function(...args) {
  return method(this.name, ...args)
}

//TODO: will be removed when remove sync methods
const namespaceLabel = 'Backendless.Counter.of(<CounterName>)'

Object.assign(Counter.prototype, {

  @deprecated(namespaceLabel, `${namespaceLabel}.incrementAndGet`)
  incrementAndGetSync: Utils.synchronized(withCounterName(incrementAndGet)),
  incrementAndGet    : Utils.promisified(withCounterName(incrementAndGet)),

  @deprecated(namespaceLabel, `${namespaceLabel}.getAndIncrement`)
  getAndIncrementSync: Utils.synchronized(withCounterName(getAndIncrement)),
  getAndIncrement    : Utils.promisified(withCounterName(getAndIncrement)),

  @deprecated(namespaceLabel, `${namespaceLabel}.decrementAndGet`)
  decrementAndGetSync: Utils.synchronized(withCounterName(decrementAndGet)),
  decrementAndGet    : Utils.promisified(withCounterName(decrementAndGet)),

  @deprecated(namespaceLabel, `${namespaceLabel}.getAndDecrement`)
  getAndDecrementSync: Utils.synchronized(withCounterName(getAndDecrement)),
  getAndDecrement    : Utils.promisified(withCounterName(getAndDecrement)),

  @deprecated(namespaceLabel, `${namespaceLabel}.reset`)
  resetSync: Utils.synchronized(withCounterName(reset)),
  reset    : Utils.promisified(withCounterName(reset)),

  @deprecated(namespaceLabel, `${namespaceLabel}.get`)
  getSync: Utils.synchronized(withCounterName(get)),
  get    : Utils.promisified(withCounterName(get)),

  @deprecated(namespaceLabel, `${namespaceLabel}.addAndGet`)
  addAndGetSync: Utils.synchronized(withCounterName(addAndGet)),
  addAndGet    : Utils.promisified(withCounterName(addAndGet)),

  @deprecated(namespaceLabel, `${namespaceLabel}.getAndAdd`)
  getAndAddSync: Utils.synchronized(withCounterName(getAndAdd)),
  getAndAdd    : Utils.promisified(withCounterName(getAndAdd)),

  @deprecated(namespaceLabel, `${namespaceLabel}.compareAndSet`)
  compareAndSetSync: Utils.synchronized(withCounterName(compareAndSet)),
  compareAndSet    : Utils.promisified(withCounterName(compareAndSet)),

})

