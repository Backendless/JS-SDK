import '../helpers/global'
import sandbox from '../helpers/sandbox'

const Backendless = sandbox.Backendless

describe('Backendless.Counters.of(<InstanceName>)', function() {

  sandbox.forSuite()

  it('feature accessible', function() {
    expect(Backendless.Counters).to.exist
  })

  it('incrementAndGet', function() {
    const counter = Backendless.Counters.of('instance_incrementAndGet')

    return Promise.resolve()
      .then(() => expect(counter.incrementAndGet()).to.eventually.be.equal(1))
      .then(() => expect(counter.incrementAndGet()).to.eventually.be.equal(2))
      .then(() => expect(counter.incrementAndGet()).to.eventually.be.equal(3))
  })

  it('getAndIncrement', function() {
    const counter = Backendless.Counters.of('instance_getAndIncrement')

    return Promise.resolve()
      .then(() => expect(counter.getAndIncrement()).to.eventually.be.equal(0))
      .then(() => expect(counter.get()).to.eventually.be.equal(1))
      .then(() => expect(counter.getAndIncrement()).to.eventually.be.equal(1))
      .then(() => expect(counter.get()).to.eventually.be.equal(2))
  })

  it('decrementAndGet', function() {
    const counter = Backendless.Counters.of('instance_decrementAndGet')

    return Promise.resolve()
      .then(() => expect(counter.decrementAndGet()).to.eventually.be.equal(-1))
      .then(() => expect(counter.get()).to.eventually.be.equal(-1))
      .then(() => expect(counter.decrementAndGet()).to.eventually.be.equal(-2))
      .then(() => expect(counter.get()).to.eventually.be.equal(-2))
  })

  it('getAndDecrement', function() {
    const counter = Backendless.Counters.of('instance_getAndDecrement')

    return Promise.resolve()
      .then(() => expect(counter.getAndDecrement()).to.eventually.be.equal(0))
      .then(() => expect(counter.get()).to.eventually.be.equal(-1))
      .then(() => expect(counter.getAndDecrement()).to.eventually.be.equal(-1))
      .then(() => expect(counter.get()).to.eventually.be.equal(-2))
  })

  it('addAndGet', function() {
    const counter = Backendless.Counters.of('instance_addAndGet')

    return Promise.resolve()
      .then(() => expect(counter.addAndGet(10)).to.eventually.be.equal(10, 'method should respond with new initial value'))
      .then(() => expect(counter.get()).to.eventually.be.equal(10, 'sequential addAndGet should return same value'))
      .then(() => expect(counter.addAndGet(20)).to.eventually.be.equal(30))
      .then(() => expect(counter.get()).to.eventually.be.equal(30))
  })

  it('getAndAdd', function() {
    const counter = Backendless.Counters.of('instance_getAndAdd')

    return Promise.resolve()
      .then(() => expect(counter.getAndAdd(1)).to.eventually.be.equal(0), 'initial value should be 0')
      .then(() => expect(counter.get()).to.eventually.be.equal(1))
      .then(() => expect(counter.getAndAdd(2)).to.eventually.be.equal(1))
      .then(() => expect(counter.get()).to.eventually.be.equal(3))
  })

  it('compareAndSet', function() {
    const counter = Backendless.Counters.of('instance_compareAndSet')

    return Promise.resolve()
      .then(() => expect(counter.compareAndSet(10, 10)).to.eventually.be.false)
      .then(() => expect(counter.get()).to.eventually.be.equal(0))
      .then(() => expect(counter.compareAndSet(0, 10)).to.eventually.be.true)
      .then(() => expect(counter.get()).to.eventually.be.equal(10))
      .then(() => expect(counter.compareAndSet(10, 20)).to.eventually.be.true)
      .then(() => expect(counter.get()).to.eventually.be.equal(20))
  })

  it('reset', function() {
    const counter = Backendless.Counters.of('instance_toBeReset')

    return counter.incrementAndGet()
      .then(() => expect(counter.get()).to.eventually.be.equal(1))
      .then(() => counter.reset())
      .then(() => expect(counter.get()).to.eventually.be.equal(0))
  })
})

describe('Backendless.Counters', function() {

  sandbox.forSuite()

  it('incrementAndGet', function() {
    const counterName = 'namespace_incrementAndGet'

    return Promise.resolve()
      .then(() => expect(Backendless.Counters.incrementAndGet(counterName)).to.eventually.be.equal(1))
      .then(() => expect(Backendless.Counters.incrementAndGet(counterName)).to.eventually.be.equal(2))
      .then(() => expect(Backendless.Counters.incrementAndGet(counterName)).to.eventually.be.equal(3))
  })

  it('getAndIncrement', function() {
    const counterName = 'namespace_getAndIncrement'

    return Promise.resolve()
      .then(() => expect(Backendless.Counters.getAndIncrement(counterName)).to.eventually.be.equal(0))
      .then(() => expect(Backendless.Counters.get(counterName)).to.eventually.be.equal(1))
      .then(() => expect(Backendless.Counters.getAndIncrement(counterName)).to.eventually.be.equal(1))
      .then(() => expect(Backendless.Counters.get(counterName)).to.eventually.be.equal(2))
  })

  it('decrementAndGet', function() {
    const counterName = 'namespace_decrementAndGet'

    return Promise.resolve()
      .then(() => expect(Backendless.Counters.decrementAndGet(counterName)).to.eventually.be.equal(-1))
      .then(() => expect(Backendless.Counters.get(counterName)).to.eventually.be.equal(-1))
      .then(() => expect(Backendless.Counters.decrementAndGet(counterName)).to.eventually.be.equal(-2))
      .then(() => expect(Backendless.Counters.get(counterName)).to.eventually.be.equal(-2))
  })

  it('getAndDecrement', function() {
    const counterName = 'namespace_getAndDecrement'

    return Promise.resolve()
      .then(() => expect(Backendless.Counters.getAndDecrement(counterName)).to.eventually.be.equal(0))
      .then(() => expect(Backendless.Counters.get(counterName)).to.eventually.be.equal(-1))
      .then(() => expect(Backendless.Counters.getAndDecrement(counterName)).to.eventually.be.equal(-1))
      .then(() => expect(Backendless.Counters.get(counterName)).to.eventually.be.equal(-2))
  })

  it('addAndGet', function() {
    const counterName = 'namespace_addAndGet'

    return Promise.resolve()
      .then(() => expect(Backendless.Counters.addAndGet(counterName, 10)).to.eventually.be.equal(10, 'method should respond with new initial value'))
      .then(() => expect(Backendless.Counters.get(counterName)).to.eventually.be.equal(10, 'sequential addAndGet should return same value'))
      .then(() => expect(Backendless.Counters.addAndGet(counterName, 20)).to.eventually.be.equal(30))
      .then(() => expect(Backendless.Counters.get(counterName)).to.eventually.be.equal(30))
  })

  it('getAndAdd', function() {
    const counterName = 'namespace_getAndAdd'

    return Promise.resolve()
      .then(() => expect(Backendless.Counters.getAndAdd(counterName, 1)).to.eventually.be.equal(0), 'initial value should be 0')
      .then(() => expect(Backendless.Counters.get(counterName)).to.eventually.be.equal(1))
      .then(() => expect(Backendless.Counters.getAndAdd(counterName, 2)).to.eventually.be.equal(1))
      .then(() => expect(Backendless.Counters.get(counterName)).to.eventually.be.equal(3))
  })

  it('compareAndSet', function() {
    const counterName = 'namespace_compareAndSet'

    return Promise.resolve()
      .then(() => expect(Backendless.Counters.compareAndSet(counterName, 10, 10)).to.eventually.be.false)
      .then(() => expect(Backendless.Counters.get(counterName)).to.eventually.be.equal(0))
      .then(() => expect(Backendless.Counters.compareAndSet(counterName, 0, 10)).to.eventually.be.true)
      .then(() => expect(Backendless.Counters.get(counterName)).to.eventually.be.equal(10))
      .then(() => expect(Backendless.Counters.compareAndSet(counterName, 10, 20)).to.eventually.be.true)
      .then(() => expect(Backendless.Counters.get(counterName)).to.eventually.be.equal(20))
  })

  it('reset', function() {
    const counterName = 'namespace_toBeReset'

    return Backendless.Counters.incrementAndGet(counterName)
      .then(() => expect(Backendless.Counters.get(counterName)).to.eventually.be.equal(1))
      .then(() => Backendless.Counters.reset(counterName))
      .then(() => expect(Backendless.Counters.get(counterName)).to.eventually.be.equal(0))
  })
})
