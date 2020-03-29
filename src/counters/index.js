import Utils from '../utils'

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

class Counters {
  constructor(app) {
    this.app = app
  }

  of(name) {
    return new Counter(name, this.app)
  }
}

Object.assign(Counters.prototype, {
  incrementAndGet: Utils.promisified(incrementAndGet),

  getAndIncrement: Utils.promisified(getAndIncrement),

  decrementAndGet: Utils.promisified(decrementAndGet),

  getAndDecrement: Utils.promisified(getAndDecrement),

  reset: Utils.promisified(reset),

  get: Utils.promisified(get),

  addAndGet: Utils.promisified(addAndGet),

  getAndAdd: Utils.promisified(getAndAdd),

  compareAndSet: Utils.promisified(compareAndSet),
})

export default Counters
