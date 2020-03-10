import '../helpers/global'
import sandbox from '../helpers/sandbox'
import { wait } from '../helpers/promise'
import * as Utils from "../helpers/utils";

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

  let testCaseMarker

  sandbox.forSuite()

  beforeEach(async function() {
    testCaseMarker = Utils.uidShort()
  })

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

  it('ttl expireIn', async () => {
    const key = `a-${testCaseMarker}`
    const value = 'a'

    await Backendless.Cache.put(key, value)

    await Backendless.Cache.expireIn(key, 2) //2 seconds to live

    //check keys are still alive
    expect(await Backendless.Cache.get(key)).to.equal(value)

    await wait(2000)

    //a should gone, b should still be alive
    expect(await Backendless.Cache.get(key)).to.equal(null)
  })

  it('ttl expireAt', async () => {
    const key = `b-${testCaseMarker}`
    const value = 'b'

    await Backendless.Cache.put(key, value)

    await Backendless.Cache.expireAt(key, new Date().getTime() + 5000) //5 seconds to live

    //check keys are still alive
    expect(await Backendless.Cache.get(key)).to.equal(value)

    await wait(1000)

    //a should gone, b should still be alive
    expect(await Backendless.Cache.get(key)).to.equal(value)

    await wait(5000)

    expect(await Backendless.Cache.get(key)).to.equal(null)
  })
})
