import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

const CounterMethods = {
  reset            : 'reset',
  incrementAndGet  : 'increment/get',
  getAndIncrement  : 'get/increment',
  decrementAndGet  : 'decrement/get',
  getAndDecrement  : 'get/decrement',
  incrementByAndGet: 'incrementby/get',
  getAndIncrementBy: 'get/incrementby',
  getCompareAndSet : 'get/compareandset'
}

class Counter {
  constructor(name /**, restUrl */) {
    this._nameValidation(name)

    // this.restUrl = restUrl
    this.name = name
  }
}

Object.assign(Counter.prototype, {

  _nameValidation(name) {
    if (!name) {
      throw new Error('Missing value for the "counterName" argument. The argument must contain a string value.')
    }

    if (!Utils.isString(name)) {
      throw new Error('Invalid value for the "value" argument. The argument must contain only string values')
    }
  },

  _implementMethod(method, urlPart/**, async */) {
    let responder = Utils.extractResponder(arguments)

    if (responder) {
      responder = Utils.wrapAsync(responder)
    }

    return Backendless._ajax({
      method      : method,
      url         : Urls.counterMethod(this.name, urlPart),
      isAsync     : !!responder,
      asyncHandler: responder
    })
  },

  _implementMethodWithValue(urlPart, value/**, async */) {
    if (!value) {
      throw new Error('Missing value for the "value" argument. The argument must contain a numeric value.')
    }

    if (!Utils.isNumber(value)) {
      throw new Error('Invalid value for the "value" argument. The argument must contain only numeric values')
    }

    let responder = Utils.extractResponder(arguments)
    const isAsync = !!responder

    if (responder) {
      responder = Utils.wrapAsync(responder)
    }

    return Backendless._ajax({
      method      : 'PUT',
      url         : Urls.counterMethod(this.name, urlPart) + ((value) ? value : ''),
      isAsync     : isAsync,
      asyncHandler: responder
    })
  },

  incrementAndGet: Utils.promisified('_incrementAndGet'),

  incrementAndGetSync: Utils.synchronized('_incrementAndGet'),

  _incrementAndGet(async) {
    return this._implementMethod('PUT', CounterMethods.incrementAndGet, async)
  },

  getAndIncrement: Utils.promisified('_getAndIncrement'),

  getAndIncrementSync: Utils.synchronized('_getAndIncrement'),

  _getAndIncrement(async) {
    return this._implementMethod('PUT', CounterMethods.getAndIncrement, async)
  },

  decrementAndGet: Utils.promisified('_decrementAndGet'),

  decrementAndGetSync: Utils.synchronized('_decrementAndGet'),

  _decrementAndGet(async) {
    return this._implementMethod('PUT', CounterMethods.decrementAndGet, async)
  },

  getAndDecrement: Utils.promisified('_getAndDecrement'),

  getAndDecrementSync: Utils.synchronized('_getAndDecrement'),

  _getAndDecrement(async) {
    return this._implementMethod('PUT', CounterMethods.getAndDecrement, async)
  },

  reset: Utils.promisified('_reset'),

  resetSync: Utils.synchronized('_reset'),

  _reset(async) {
    return this._implementMethod('PUT', CounterMethods.reset, async)
  },

  get: Utils.promisified('_get'),

  getSync: Utils.synchronized('_get'),

  _get(/** async */) {
    let responder = Utils.extractResponder(arguments)
    const isAsync = !!responder

    if (responder) {
      responder = Utils.wrapAsync(responder)
    }

    return Backendless._ajax({
      method      : 'GET',
      url         : Urls.counter(this.name),
      isAsync     : isAsync,
      asyncHandler: responder
    })
  },

  addAndGet: Utils.promisified('_addAndGet'),

  addAndGetSync: Utils.synchronized('_addAndGet'),

  _addAndGet(value, async) {
    return this._implementMethodWithValue(CounterMethods.incrementByAndGet + '?value=', value, async)
  },

  getAndAdd: Utils.promisified('_getAndAdd'),

  getAndAddSync: Utils.synchronized('_getAndAdd'),

  _getAndAdd(value, async) {
    return this._implementMethodWithValue(CounterMethods.getAndIncrementBy + '?value=', value, async)
  },

  compareAndSet: Utils.promisified('_compareAndSet'),

  compareAndSetSync: Utils.synchronized('_compareAndSet'),

  _compareAndSet(expected, updated/**, async */) {
    if (null == expected || null == updated) {
      throw new Error(
        'Missing values for the "expected" and/or "updated" arguments. The arguments must contain numeric values'
      )
    }

    if (!Utils.isNumber(expected) || !Utils.isNumber(updated)) {
      throw new Error(
        'Missing value for the "expected" and/or "updated" arguments. The arguments must contain a numeric value'
      )
    }

    let responder = Utils.extractResponder(arguments)
    const isAsync = !!responder

    if (responder) {
      responder = Utils.wrapAsync(responder)
    }

    const queryParams = '?expected=' + expected + '&updatedvalue=' + updated

    return Backendless._ajax({
      method      : 'PUT',
      url         : Urls.counterMethod(this.name, CounterMethods.getCompareAndSet) + queryParams,
      isAsync     : isAsync,
      asyncHandler: responder
    })
  },
})

export default class Counters {
  constructor() {
    // this.restUrl = Urls.counters()
  }

  of(name) {
    return new Counter(name /**, this.restUrl */)
  }
}

Object.getOwnPropertyNames(Counter.prototype).forEach(methodName => {
  const isConstructor = methodName === 'constructor'
  const isPrivateMethod = methodName[0].startsWith('_')

  if (!isConstructor && !isPrivateMethod) {
    Counters.prototype[methodName] = createCounterMethodInvoker(methodName)
  }
})

function createCounterMethodInvoker(methodName) {
  return function(name) {
    const counter = this.of(name)
    const args = Array.prototype.slice.call(arguments, 1)

    return counter[methodName].apply(counter, args)
  }
}