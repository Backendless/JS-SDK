import Utils from '../utils'

import Counters from './counters'

export default class Counter {
  constructor(name) {
    if (!name) {
      throw new Error('Missing value for the "counterName" argument. The argument must contain a string value.')
    }

    if (!Utils.isString(name)) {
      //TODO: fix me
      throw new Error('Invalid value for the "name" argument. The argument must contain only string values')
    }

    this.name = name
  }
}

const proxyToCounters = method => function(...args){
  return Counters[method](this.name, ...args)
}

Object.setPrototypeOf(Counter.prototype, {

  incrementAndGet: proxyToCounters('incrementAndGet'),
  incrementAndGetSync: proxyToCounters('incrementAndGetSync'),

  getAndIncrement: proxyToCounters('getAndIncrement'),
  getAndIncrementSync: proxyToCounters('getAndIncrementSync'),

  decrementAndGet: proxyToCounters('decrementAndGet'),
  decrementAndGetSync: proxyToCounters('decrementAndGetSync'),

  getAndDecrement: proxyToCounters('getAndDecrement'),
  getAndDecrementSync: proxyToCounters('getAndDecrementSync'),

  reset: proxyToCounters('reset'),
  resetSync: proxyToCounters('resetSync'),

  get: proxyToCounters('get'),
  getSync: proxyToCounters('getSync'),

  addAndGet: proxyToCounters('addAndGet'),
  addAndGetSync: proxyToCounters('addAndGetSync'),

  getAndAdd: proxyToCounters('getAndAdd'),
  getAndAddSync: proxyToCounters('getAndAddSync'),

  compareAndSet: proxyToCounters('compareAndSet'),
  compareAndSetSync: proxyToCounters('compareAndSetSync'),

})

