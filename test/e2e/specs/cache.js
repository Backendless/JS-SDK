import '../helpers/global'
import sandbox from '../helpers/sandbox'
import { wait } from '../helpers/promise'

const Backendless = sandbox.Backendless

function Foo(opts) {
  Object.assign(this, opts || {})
}

const cacheValues = {
  string    : 'test value',
  number    : 123.123,
  boolean   : true,
  object    : { test: 'ok', nested: { value: null } },
  null      : null,
  customType: new Foo({ name: 'kk' })
}

const cacheKeys = Object.keys(cacheValues)

describe('Backendless.Cache', function() {

  sandbox.forSuite()

  it('put and get', function() {
    return Promise.resolve()
      .then(() => Backendless.Data.of(Foo).save(cacheValues.customType))
      //put all keys to cache
      .then(() => Promise.all(cacheKeys.map(key => Backendless.Cache.put(key, cacheValues[key]))))
      //get and validate each key in cache
      .then(() => Promise.all(cacheKeys.map(key => {
        return expect(Backendless.Cache.get(key)).to.eventually.eql(cacheValues[key])
      })))
      //check for some non-existent key
      .then(() => expect(Backendless.Cache.get('SOME_UNEXISTING_KEY')).to.eventually.be.null)
  })

  it('contains', function() {
    return Promise.resolve()
      .then(() => Backendless.Data.of(Foo).save(cacheValues.customType))
      //put all keys to cache
      .then(() => Promise.all(cacheKeys.map(key => Backendless.Cache.put(key, cacheValues[key]))))
      //validate contains
      .then(() => Promise.all(cacheKeys.map(key => {
        return expect(Backendless.Cache.contains(key)).to.eventually.equal(true)
      })))
      //check for some non-existent key
      .then(() => expect(Backendless.Cache.contains('SOME_UNEXISTING_KEY')).to.eventually.equal(false))
  })

  it('remove', function() {
    const Cache = Backendless.Cache

    return Promise.resolve()
      .then(() => Cache.put('foo', 'bar'))
      .then(() => expect(Cache.get('foo')).to.eventually.equal('bar'))
      .then(() => Cache.remove('foo'))
      .then(() => expect(Cache.get('foo')).to.eventually.be.null)
  })

  // TODO: this test gives floating results, need to be discovered
  it('ttl', function() {
    const a = 'a'
    const b = 'b'

    this.timeout(10000)

    return Promise.resolve()
      .then(() => Backendless.Cache.put('a', a))
      .then(() => Backendless.Cache.put('b', b))
      .then(() => Backendless.Cache.expireIn('a', 2)) //2 seconds to live
      .then(() => Backendless.Cache.expireAt('b', new Date().getTime() + 5000)) //5 seconds to live

      //check keys are still alive
      .then(() => expect(Backendless.Cache.get('a')).to.eventually.equal(a))
      .then(() => expect(Backendless.Cache.get('b')).to.eventually.equal(b))

      .then(() => wait(2000))

      //a should gone, b should still be alive
      .then(() => expect(Backendless.Cache.get('a')).to.eventually.be.null)
      .then(() => expect(Backendless.Cache.get('b')).to.eventually.equal(b))

      .then(() => wait(3000))
      .then(() => expect(Backendless.Cache.get('b')).to.eventually.be.null)
  })
})
