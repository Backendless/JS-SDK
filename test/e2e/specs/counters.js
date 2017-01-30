import '../helpers/global'
import sandbox from '../helpers/sandbox'
import Backendless from '../../../src/backendless'

describe('Backendless.Counters', function() {

  sandbox.forSuite()

  it('feature accessible', function() {
    expect(Backendless.Counters).to.exist
  })

  it('incrementAndGet', function() {
    const counter = Backendless.Counters.of('incrementAndGet')

    return Promise.resolve()
      .then(() => expect(counter.incrementAndGet()).to.eventually.be.equal(1))
      .then(() => expect(counter.incrementAndGet()).to.eventually.be.equal(2))
      .then(() => expect(counter.incrementAndGet()).to.eventually.be.equal(3))
  })

  it('getAndIncrement', function() {
    const counter = Backendless.Counters.of('getAndIncrement')

    return Promise.resolve()
      .then(() => expect(counter.getAndIncrement()).to.eventually.be.equal(0))
      .then(() => expect(counter.get()).to.eventually.be.equal(1))
      .then(() => expect(counter.getAndIncrement()).to.eventually.be.equal(1))
      .then(() => expect(counter.get()).to.eventually.be.equal(2))
  })

  it('decrementAndGet', function() {
    const counter = Backendless.Counters.of('decrementAndGet')

    return Promise.resolve()
      .then(() => expect(counter.decrementAndGet()).to.eventually.be.equal(-1))
      .then(() => expect(counter.get()).to.eventually.be.equal(-1))
      .then(() => expect(counter.decrementAndGet()).to.eventually.be.equal(-2))
      .then(() => expect(counter.get()).to.eventually.be.equal(-2))
  })

  it('getAndDecrement', function() {
    const counter = Backendless.Counters.of('getAndDecrement')

    return Promise.resolve()
      .then(() => expect(counter.getAndDecrement()).to.eventually.be.equal(0))
      .then(() => expect(counter.get()).to.eventually.be.equal(-1))
      .then(() => expect(counter.getAndDecrement()).to.eventually.be.equal(-1))
      .then(() => expect(counter.get()).to.eventually.be.equal(-2))
  })

  it('addAndGet', function() {
    const counter = Backendless.Counters.of('addAndGet')

    return Promise.resolve()
      .then(() => expect(counter.addAndGet(10)).to.eventually.be.equal(10, 'method should respond with new initial value'))
      .then(() => expect(counter.get()).to.eventually.be.equal(10, 'sequential addAndGet should return same value'))
      .then(() => expect(counter.addAndGet(20)).to.eventually.be.equal(30))
      .then(() => expect(counter.get()).to.eventually.be.equal(30))
  })

  it('getAndAdd', function() {
    const counter = Backendless.Counters.of('getAndAdd')

    return Promise.resolve()
      .then(() => expect(counter.getAndAdd(1)).to.eventually.be.equal(0), 'initial value should be 0')
      .then(() => expect(counter.get()).to.eventually.be.equal(1))
      .then(() => expect(counter.getAndAdd(2)).to.eventually.be.equal(1))
      .then(() => expect(counter.get()).to.eventually.be.equal(3))
  })

  it('compareAndSet', function() {
    const counter = Backendless.Counters.of('compareAndSet')

    return Promise.resolve()
      .then(() => expect(counter.compareAndSet(10, 10)).to.eventually.be.false)
      .then(() => expect(counter.get()).to.eventually.be.equal(0))
      .then(() => expect(counter.compareAndSet(0, 10)).to.eventually.be.true)
      .then(() => expect(counter.get()).to.eventually.be.equal(10))
      .then(() => expect(counter.compareAndSet(10, 20)).to.eventually.be.true)
      .then(() => expect(counter.get()).to.eventually.be.equal(20))
  })

  it('reset', function() {
    const counter = Backendless.Counters.of('toBeReset')

    return counter.incrementAndGet()
      .then(() => expect(counter.get()).to.eventually.be.equal(1))
      .then(() => counter.reset())
      .then(() => expect(counter.get()).to.eventually.be.equal(0))
  })
})
