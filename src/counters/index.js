import Utils from '../utils'
import { deprecated } from '../decorators'

import Counter from './counter'
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

const Counters = {

  of(name) {
    return new Counter(name)
  },

  @deprecated('Backendless.Counters', 'Backendless.Counters.incrementAndGet')
  incrementAndGetSync: Utils.synchronized(incrementAndGet),
  incrementAndGet    : Utils.promisified(incrementAndGet),

  @deprecated('Backendless.Counters', 'Backendless.Counters.getAndIncrement')
  getAndIncrementSync: Utils.synchronized(getAndIncrement),
  getAndIncrement    : Utils.promisified(getAndIncrement),

  @deprecated('Backendless.Counters', 'Backendless.Counters.decrementAndGet')
  decrementAndGetSync: Utils.synchronized(decrementAndGet),
  decrementAndGet    : Utils.promisified(decrementAndGet),

  @deprecated('Backendless.Counters', 'Backendless.Counters.getAndDecrement')
  getAndDecrementSync: Utils.synchronized(getAndDecrement),
  getAndDecrement    : Utils.promisified(getAndDecrement),

  @deprecated('Backendless.Counters', 'Backendless.Counters.reset')
  resetSync: Utils.synchronized(reset),
  reset    : Utils.promisified(reset),

  @deprecated('Backendless.Counters', 'Backendless.Counters.get')
  getSync: Utils.synchronized(get),
  get    : Utils.promisified(get),

  @deprecated('Backendless.Counters', 'Backendless.Counters.addAndGet')
  addAndGetSync: Utils.synchronized(addAndGet),
  addAndGet    : Utils.promisified(addAndGet),

  @deprecated('Backendless.Counters', 'Backendless.Counters.getAndAdd')
  getAndAddSync: Utils.synchronized(getAndAdd),
  getAndAdd    : Utils.promisified(getAndAdd),

  @deprecated('Backendless.Counters', 'Backendless.Counters.compareAndSet')
  compareAndSetSync: Utils.synchronized(compareAndSet),
  compareAndSet    : Utils.promisified(compareAndSet),
}

export default Counters
