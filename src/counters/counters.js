import Utils from '../utils'
import { deprecated } from '../decorators'

import Counter from './counter'
import { incrementAndGet } from './increment-and-get'
import { decrementAndGet } from './decrement-and-get'
import { get } from './get'
import { getAndIncrement } from './get-and-increment'
import { getAndDecrement } from './get-and-decrement'
import { getAndAdd } from './get-and-add'
import { addAndGet } from './add-and-get'
import { compareAndSet } from './compare-and-set'
import { reset } from './reset'

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
