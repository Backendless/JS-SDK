import Utils from '../utils'

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

  incrementAndGet    : Utils.promisified(incrementAndGet),
  incrementAndGetSync: Utils.synchronized(incrementAndGet),

  getAndIncrement    : Utils.promisified(getAndIncrement),
  getAndIncrementSync: Utils.synchronized(getAndIncrement),

  decrementAndGet    : Utils.promisified(decrementAndGet),
  decrementAndGetSync: Utils.synchronized(decrementAndGet),

  getAndDecrement    : Utils.promisified(getAndDecrement),
  getAndDecrementSync: Utils.synchronized(getAndDecrement),

  reset    : Utils.promisified(reset),
  resetSync: Utils.synchronized(reset),

  get    : Utils.promisified(get),
  getSync: Utils.synchronized(get),

  addAndGet    : Utils.promisified(addAndGet),
  addAndGetSync: Utils.synchronized(addAndGet),

  getAndAdd    : Utils.promisified(getAndAdd),
  getAndAddSync: Utils.synchronized(getAndAdd),

  compareAndSet    : Utils.promisified(compareAndSet),
  compareAndSetSync: Utils.synchronized(compareAndSet),
}

export default Counters
