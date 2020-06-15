import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forTest, prepareMockRequest, createMockRTServer } from '../../helpers/sandbox'

describe('<Data> RT', function() {

  forTest(this)

  this.timeout(15000)

  const tableName = 'TEST_TABLE_NAME'

  let rtClient

  let dataStore
  let rtHandlers

  beforeEach(async () => {
    rtClient = await createMockRTServer()

    prepareMockRequest(rtClient.host)

    dataStore = Backendless.Data.of(tableName)
    rtHandlers = dataStore.rt()

  })

  afterEach(async () => {
    rtClient.stop()
  })

  describe('Create Listener', () => {
    it('should add a simple listener', async () => {

      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES

      const callbackPromise = new Promise(resolve => {
        rtHandlers.addCreateListener(data => {
          resolve(data)
        })
      })

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub1.options).to.be.eql({
        event    : 'created',
        tableName: 'TEST_TABLE_NAME',
      })

      rtClient.subRes(sub1.id, { bar: 'test', foo: 123 })

      const callbackResult = await callbackPromise

      expect(callbackResult).to.be.eql({ bar: 'test', foo: 123 })
    })

    it('should add a simple listener with condition', async () => {

      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES

      const callbackPromise = new Promise(resolve => {
        rtHandlers.addCreateListener('foo>123', data => {
          resolve(data)
        })
      })

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub1.options).to.be.eql({
        event      : 'created',
        tableName  : 'TEST_TABLE_NAME',
        whereClause: 'foo>123',
      })

      rtClient.subRes(sub1.id, { bar: 'test', foo: 123 })

      const callbackResult = await callbackPromise

      expect(callbackResult).to.be.eql({ bar: 'test', foo: 123 })
    })

    it('should add several listeners', async () => {

      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES

      const callback1Promise = new Promise(resolve => {
        rtHandlers.addCreateListener(data => {
          resolve(data)
        })
      })

      const callback2Promise = new Promise(resolve => {
        rtHandlers.addCreateListener(data => {
          resolve(data)
        })
      })

      const callback3Promise = new Promise(resolve => {
        rtHandlers.addCreateListener(data => {
          resolve(data)
        })
      })

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub1.options).to.be.eql({
        event    : 'created',
        tableName: 'TEST_TABLE_NAME',
      })

      expect(sub2.id).to.be.a('string')
      expect(sub2.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub2.options).to.be.eql({
        event    : 'created',
        tableName: 'TEST_TABLE_NAME',
      })

      expect(sub3.id).to.be.a('string')
      expect(sub3.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub3.options).to.be.eql({
        event    : 'created',
        tableName: 'TEST_TABLE_NAME',
      })

      rtClient.subRes(sub1.id, { bar: 'test-1', foo: 123 })
      rtClient.subRes(sub2.id, { bar: 'test-2', foo: 123 })
      rtClient.subRes(sub3.id, { bar: 'test-3', foo: 123 })

      const callback1Result = await callback1Promise
      const callback2Result = await callback2Promise
      const callback3Result = await callback3Promise

      expect(callback1Result).to.be.eql({ bar: 'test-1', foo: 123 })
      expect(callback2Result).to.be.eql({ bar: 'test-2', foo: 123 })
      expect(callback3Result).to.be.eql({ bar: 'test-3', foo: 123 })
    })

    it('should transform result into an instance', async () => {
      class Foo {
      }

      dataStore = Backendless.Data.of(Foo)
      rtHandlers = dataStore.rt()

      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES

      const callbackPromise = new Promise(resolve => {
        rtHandlers.addCreateListener(data => {
          resolve(data)
        })
      })

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub1.options).to.be.eql({
        event    : 'created',
        tableName: 'Foo',
      })

      rtClient.subRes(sub1.id, { bar: 'test', foo: 123 })

      const callbackResult = await callbackPromise

      expect(callbackResult).to.be.eql({ bar: 'test', foo: 123 })
      expect(callbackResult).to.be.instanceof(Foo)
    })

    it('should remove listeners', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub4Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
      const sub5Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES

      const callback1 = () => ({})
      const callback2 = () => ({})
      const callback3 = () => ({})

      rtHandlers.addCreateListener(callback1)
      rtHandlers.addCreateListener(callback2)
      rtHandlers.addCreateListener(callback3)

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      rtHandlers.removeCreateListener(callback2)
      rtHandlers.removeCreateListener(callback3)

      const sub4 = await sub4Promise
      const sub5 = await sub5Promise

      expect(sub4.id).to.be.equal(sub2.id)
      expect(sub5.id).to.be.equal(sub3.id)
    })

    it('should remove listeners with condition #1', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub4Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
      const sub5Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES

      const callback1 = () => ({})
      const callback2 = () => ({})

      rtHandlers.addCreateListener('foo>111', callback1)
      rtHandlers.addCreateListener('foo>222', callback2)
      rtHandlers.addCreateListener(callback2)

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      rtHandlers.removeCreateListener(callback2)

      const sub4 = await sub4Promise
      const sub5 = await sub5Promise

      expect(sub4.id).to.be.equal(sub2.id)
      expect(sub5.id).to.be.equal(sub3.id)
    })

    it('should remove listeners with condition #2', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub4Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
      const sub5Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES

      const callback1 = () => ({})
      const callback2 = () => ({})

      rtHandlers.addCreateListener('foo>123', callback1)
      rtHandlers.addCreateListener('foo>123', callback2)
      rtHandlers.addCreateListener(callback2)

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      rtHandlers.removeCreateListeners('foo>123', callback1)
      rtHandlers.removeCreateListeners(callback2)

      const sub4 = await sub4Promise
      const sub5 = await sub5Promise

      expect(sub4.id).to.be.equal(sub1.id)
      expect(sub5.id).to.be.equal(sub2.id)
    })

    it('should remove listeners with condition #3', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub4Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
      const sub5Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES

      const callback1 = () => ({})
      const callback2 = () => ({})

      rtHandlers.addCreateListener('foo>123', callback1)
      rtHandlers.addCreateListener('foo>123', callback2)
      rtHandlers.addCreateListener(callback2)

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      rtHandlers.removeCreateListeners('foo>123')

      const sub4 = await sub4Promise
      const sub5 = await sub5Promise

      expect(sub4.id).to.be.equal(sub1.id)
      expect(sub5.id).to.be.equal(sub2.id)
    })

    it('fails when callback is not a function on adding listener', async () => {
      const errorMsg = 'Listener Function must be passed.'

      expect(() => rtHandlers.addCreateListener()).to.throw(errorMsg)
      expect(() => rtHandlers.addCreateListener(undefined)).to.throw(errorMsg)
      expect(() => rtHandlers.addCreateListener(null)).to.throw(errorMsg)
      expect(() => rtHandlers.addCreateListener(true)).to.throw(errorMsg)
      expect(() => rtHandlers.addCreateListener(false)).to.throw(errorMsg)
      expect(() => rtHandlers.addCreateListener(0)).to.throw(errorMsg)
      expect(() => rtHandlers.addCreateListener(123)).to.throw(errorMsg)
      expect(() => rtHandlers.addCreateListener('')).to.throw(errorMsg)
      expect(() => rtHandlers.addCreateListener('str')).to.throw(errorMsg)
      expect(() => rtHandlers.addCreateListener({})).to.throw(errorMsg)
      expect(() => rtHandlers.addCreateListener([])).to.throw(errorMsg)

      expect(() => rtHandlers.addCreateListener('foo')).to.throw(errorMsg)
      expect(() => rtHandlers.addCreateListener('foo', undefined)).to.throw(errorMsg)
      expect(() => rtHandlers.addCreateListener('foo', null)).to.throw(errorMsg)
      expect(() => rtHandlers.addCreateListener('foo', true)).to.throw(errorMsg)
      expect(() => rtHandlers.addCreateListener('foo', false)).to.throw(errorMsg)
      expect(() => rtHandlers.addCreateListener('foo', 0)).to.throw(errorMsg)
      expect(() => rtHandlers.addCreateListener('foo', 123)).to.throw(errorMsg)
      expect(() => rtHandlers.addCreateListener('foo', '')).to.throw(errorMsg)
      expect(() => rtHandlers.addCreateListener('foo', 'str')).to.throw(errorMsg)
      expect(() => rtHandlers.addCreateListener('foo', {})).to.throw(errorMsg)
      expect(() => rtHandlers.addCreateListener('foo', [])).to.throw(errorMsg)
    })

    it('fails when callback is not a function on removing listener', async () => {
      const errorMsg = 'Listener Function must be passed.'

      expect(() => rtHandlers.removeCreateListener()).to.throw(errorMsg)
      expect(() => rtHandlers.removeCreateListener(undefined)).to.throw(errorMsg)
      expect(() => rtHandlers.removeCreateListener(null)).to.throw(errorMsg)
      expect(() => rtHandlers.removeCreateListener(true)).to.throw(errorMsg)
      expect(() => rtHandlers.removeCreateListener(false)).to.throw(errorMsg)
      expect(() => rtHandlers.removeCreateListener(0)).to.throw(errorMsg)
      expect(() => rtHandlers.removeCreateListener(123)).to.throw(errorMsg)
      expect(() => rtHandlers.removeCreateListener('')).to.throw(errorMsg)
      expect(() => rtHandlers.removeCreateListener('str')).to.throw(errorMsg)
      expect(() => rtHandlers.removeCreateListener({})).to.throw(errorMsg)
      expect(() => rtHandlers.removeCreateListener([])).to.throw(errorMsg)
    })
  })

  describe('Update Listener', () => {
    it('should add a simple listener', async () => {

      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES

      const callbackPromise = new Promise(resolve => {
        rtHandlers.addUpdateListener(data => {
          resolve(data)
        })
      })

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub1.options).to.be.eql({
        event    : 'updated',
        tableName: 'TEST_TABLE_NAME',
      })

      rtClient.subRes(sub1.id, { bar: 'test', foo: 123 })

      const callbackResult = await callbackPromise

      expect(callbackResult).to.be.eql({ bar: 'test', foo: 123 })
    })

    it('should add a simple listener with condition', async () => {

      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES

      const callbackPromise = new Promise(resolve => {
        rtHandlers.addUpdateListener('foo>123', data => {
          resolve(data)
        })
      })

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub1.options).to.be.eql({
        event      : 'updated',
        tableName  : 'TEST_TABLE_NAME',
        whereClause: 'foo>123',
      })

      rtClient.subRes(sub1.id, { bar: 'test', foo: 123 })

      const callbackResult = await callbackPromise

      expect(callbackResult).to.be.eql({ bar: 'test', foo: 123 })
    })

    it('should add several listeners', async () => {

      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES

      const callback1Promise = new Promise(resolve => {
        rtHandlers.addUpdateListener(data => {
          resolve(data)
        })
      })

      const callback2Promise = new Promise(resolve => {
        rtHandlers.addUpdateListener(data => {
          resolve(data)
        })
      })

      const callback3Promise = new Promise(resolve => {
        rtHandlers.addUpdateListener(data => {
          resolve(data)
        })
      })

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub1.options).to.be.eql({
        event    : 'updated',
        tableName: 'TEST_TABLE_NAME',
      })

      expect(sub2.id).to.be.a('string')
      expect(sub2.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub2.options).to.be.eql({
        event    : 'updated',
        tableName: 'TEST_TABLE_NAME',
      })

      expect(sub3.id).to.be.a('string')
      expect(sub3.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub3.options).to.be.eql({
        event    : 'updated',
        tableName: 'TEST_TABLE_NAME',
      })

      rtClient.subRes(sub1.id, { bar: 'test-1', foo: 123 })
      rtClient.subRes(sub2.id, { bar: 'test-2', foo: 123 })
      rtClient.subRes(sub3.id, { bar: 'test-3', foo: 123 })

      const callback1Result = await callback1Promise
      const callback2Result = await callback2Promise
      const callback3Result = await callback3Promise

      expect(callback1Result).to.be.eql({ bar: 'test-1', foo: 123 })
      expect(callback2Result).to.be.eql({ bar: 'test-2', foo: 123 })
      expect(callback3Result).to.be.eql({ bar: 'test-3', foo: 123 })
    })

    it('should transform result into an instance', async () => {
      class Foo {
      }

      dataStore = Backendless.Data.of(Foo)
      rtHandlers = dataStore.rt()

      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES

      const callbackPromise = new Promise(resolve => {
        rtHandlers.addUpdateListener(data => {
          resolve(data)
        })
      })

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub1.options).to.be.eql({
        event    : 'updated',
        tableName: 'Foo',
      })

      rtClient.subRes(sub1.id, { bar: 'test', foo: 123 })

      const callbackResult = await callbackPromise

      expect(callbackResult).to.be.eql({ bar: 'test', foo: 123 })
      expect(callbackResult).to.be.instanceof(Foo)
    })

    it('should remove listeners', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub4Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
      const sub5Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES

      const callback1 = () => ({})
      const callback2 = () => ({})
      const callback3 = () => ({})

      rtHandlers.addUpdateListener(callback1)
      rtHandlers.addUpdateListener(callback2)
      rtHandlers.addUpdateListener(callback3)

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      rtHandlers.removeUpdateListener(callback2)
      rtHandlers.removeUpdateListener(callback3)

      const sub4 = await sub4Promise
      const sub5 = await sub5Promise

      expect(sub4.id).to.be.equal(sub2.id)
      expect(sub5.id).to.be.equal(sub3.id)
    })

    it('should remove listeners with condition #1', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub4Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
      const sub5Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES

      const callback1 = () => ({})
      const callback2 = () => ({})

      rtHandlers.addUpdateListener('foo>111', callback1)
      rtHandlers.addUpdateListener('foo>222', callback2)
      rtHandlers.addUpdateListener(callback2)

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      rtHandlers.removeUpdateListener(callback2)

      const sub4 = await sub4Promise
      const sub5 = await sub5Promise

      expect(sub4.id).to.be.equal(sub2.id)
      expect(sub5.id).to.be.equal(sub3.id)
    })

    it('should remove listeners with condition #2', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub4Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
      const sub5Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES

      const callback1 = () => ({})
      const callback2 = () => ({})

      rtHandlers.addUpdateListener('foo>123', callback1)
      rtHandlers.addUpdateListener('foo>123', callback2)
      rtHandlers.addUpdateListener(callback2)

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      rtHandlers.removeUpdateListeners('foo>123', callback1)
      rtHandlers.removeUpdateListeners(callback2)

      const sub4 = await sub4Promise
      const sub5 = await sub5Promise

      expect(sub4.id).to.be.equal(sub1.id)
      expect(sub5.id).to.be.equal(sub2.id)
    })

    it('should remove listeners with condition #3', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub4Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
      const sub5Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES

      const callback1 = () => ({})
      const callback2 = () => ({})

      rtHandlers.addUpdateListener('foo>123', callback1)
      rtHandlers.addUpdateListener('foo>123', callback2)
      rtHandlers.addUpdateListener(callback2)

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      rtHandlers.removeUpdateListeners('foo>123')

      const sub4 = await sub4Promise
      const sub5 = await sub5Promise

      expect(sub4.id).to.be.equal(sub1.id)
      expect(sub5.id).to.be.equal(sub2.id)
    })

    it('fails when callback is not a function on adding listener', async () => {
      const errorMsg = 'Listener Function must be passed.'

      expect(() => rtHandlers.addUpdateListener()).to.throw(errorMsg)
      expect(() => rtHandlers.addUpdateListener(undefined)).to.throw(errorMsg)
      expect(() => rtHandlers.addUpdateListener(null)).to.throw(errorMsg)
      expect(() => rtHandlers.addUpdateListener(true)).to.throw(errorMsg)
      expect(() => rtHandlers.addUpdateListener(false)).to.throw(errorMsg)
      expect(() => rtHandlers.addUpdateListener(0)).to.throw(errorMsg)
      expect(() => rtHandlers.addUpdateListener(123)).to.throw(errorMsg)
      expect(() => rtHandlers.addUpdateListener('')).to.throw(errorMsg)
      expect(() => rtHandlers.addUpdateListener('str')).to.throw(errorMsg)
      expect(() => rtHandlers.addUpdateListener({})).to.throw(errorMsg)
      expect(() => rtHandlers.addUpdateListener([])).to.throw(errorMsg)

      expect(() => rtHandlers.addUpdateListener('foo')).to.throw(errorMsg)
      expect(() => rtHandlers.addUpdateListener('foo', undefined)).to.throw(errorMsg)
      expect(() => rtHandlers.addUpdateListener('foo', null)).to.throw(errorMsg)
      expect(() => rtHandlers.addUpdateListener('foo', true)).to.throw(errorMsg)
      expect(() => rtHandlers.addUpdateListener('foo', false)).to.throw(errorMsg)
      expect(() => rtHandlers.addUpdateListener('foo', 0)).to.throw(errorMsg)
      expect(() => rtHandlers.addUpdateListener('foo', 123)).to.throw(errorMsg)
      expect(() => rtHandlers.addUpdateListener('foo', '')).to.throw(errorMsg)
      expect(() => rtHandlers.addUpdateListener('foo', 'str')).to.throw(errorMsg)
      expect(() => rtHandlers.addUpdateListener('foo', {})).to.throw(errorMsg)
      expect(() => rtHandlers.addUpdateListener('foo', [])).to.throw(errorMsg)
    })

    it('fails when callback is not a function on removing listener', async () => {
      const errorMsg = 'Listener Function must be passed.'

      expect(() => rtHandlers.removeUpdateListener()).to.throw(errorMsg)
      expect(() => rtHandlers.removeUpdateListener(undefined)).to.throw(errorMsg)
      expect(() => rtHandlers.removeUpdateListener(null)).to.throw(errorMsg)
      expect(() => rtHandlers.removeUpdateListener(true)).to.throw(errorMsg)
      expect(() => rtHandlers.removeUpdateListener(false)).to.throw(errorMsg)
      expect(() => rtHandlers.removeUpdateListener(0)).to.throw(errorMsg)
      expect(() => rtHandlers.removeUpdateListener(123)).to.throw(errorMsg)
      expect(() => rtHandlers.removeUpdateListener('')).to.throw(errorMsg)
      expect(() => rtHandlers.removeUpdateListener('str')).to.throw(errorMsg)
      expect(() => rtHandlers.removeUpdateListener({})).to.throw(errorMsg)
      expect(() => rtHandlers.removeUpdateListener([])).to.throw(errorMsg)
    })
  })

  describe('Delete Listener', () => {
    it('should add a simple listener', async () => {

      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES

      const callbackPromise = new Promise(resolve => {
        rtHandlers.addDeleteListener(data => {
          resolve(data)
        })
      })

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub1.options).to.be.eql({
        event    : 'deleted',
        tableName: 'TEST_TABLE_NAME',
      })

      rtClient.subRes(sub1.id, { bar: 'test', foo: 123 })

      const callbackResult = await callbackPromise

      expect(callbackResult).to.be.eql({ bar: 'test', foo: 123 })
    })

    it('should add a simple listener with condition', async () => {

      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES

      const callbackPromise = new Promise(resolve => {
        rtHandlers.addDeleteListener('foo>123', data => {
          resolve(data)
        })
      })

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub1.options).to.be.eql({
        event      : 'deleted',
        tableName  : 'TEST_TABLE_NAME',
        whereClause: 'foo>123',
      })

      rtClient.subRes(sub1.id, { bar: 'test', foo: 123 })

      const callbackResult = await callbackPromise

      expect(callbackResult).to.be.eql({ bar: 'test', foo: 123 })
    })

    it('should add several listeners', async () => {

      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES

      const callback1Promise = new Promise(resolve => {
        rtHandlers.addDeleteListener(data => {
          resolve(data)
        })
      })

      const callback2Promise = new Promise(resolve => {
        rtHandlers.addDeleteListener(data => {
          resolve(data)
        })
      })

      const callback3Promise = new Promise(resolve => {
        rtHandlers.addDeleteListener(data => {
          resolve(data)
        })
      })

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub1.options).to.be.eql({
        event    : 'deleted',
        tableName: 'TEST_TABLE_NAME',
      })

      expect(sub2.id).to.be.a('string')
      expect(sub2.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub2.options).to.be.eql({
        event    : 'deleted',
        tableName: 'TEST_TABLE_NAME',
      })

      expect(sub3.id).to.be.a('string')
      expect(sub3.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub3.options).to.be.eql({
        event    : 'deleted',
        tableName: 'TEST_TABLE_NAME',
      })

      rtClient.subRes(sub1.id, { bar: 'test-1', foo: 123 })
      rtClient.subRes(sub2.id, { bar: 'test-2', foo: 123 })
      rtClient.subRes(sub3.id, { bar: 'test-3', foo: 123 })

      const callback1Result = await callback1Promise
      const callback2Result = await callback2Promise
      const callback3Result = await callback3Promise

      expect(callback1Result).to.be.eql({ bar: 'test-1', foo: 123 })
      expect(callback2Result).to.be.eql({ bar: 'test-2', foo: 123 })
      expect(callback3Result).to.be.eql({ bar: 'test-3', foo: 123 })
    })

    it('should transform result into an instance', async () => {
      class Foo {
      }

      dataStore = Backendless.Data.of(Foo)
      rtHandlers = dataStore.rt()

      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES

      const callbackPromise = new Promise(resolve => {
        rtHandlers.addDeleteListener(data => {
          resolve(data)
        })
      })

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub1.options).to.be.eql({
        event    : 'deleted',
        tableName: 'Foo',
      })

      rtClient.subRes(sub1.id, { bar: 'test', foo: 123 })

      const callbackResult = await callbackPromise

      expect(callbackResult).to.be.eql({ bar: 'test', foo: 123 })
      expect(callbackResult).to.be.instanceof(Foo)
    })

    it('should remove listeners', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub4Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
      const sub5Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES

      const callback1 = () => ({})
      const callback2 = () => ({})
      const callback3 = () => ({})

      rtHandlers.addDeleteListener(callback1)
      rtHandlers.addDeleteListener(callback2)
      rtHandlers.addDeleteListener(callback3)

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      rtHandlers.removeDeleteListener(callback2)
      rtHandlers.removeDeleteListener(callback3)

      const sub4 = await sub4Promise
      const sub5 = await sub5Promise

      expect(sub4.id).to.be.equal(sub2.id)
      expect(sub5.id).to.be.equal(sub3.id)
    })

    it('should remove listeners with condition #1', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub4Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
      const sub5Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES

      const callback1 = () => ({})
      const callback2 = () => ({})

      rtHandlers.addDeleteListener('foo>111', callback1)
      rtHandlers.addDeleteListener('foo>222', callback2)
      rtHandlers.addDeleteListener(callback2)

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      rtHandlers.removeDeleteListener(callback2)

      const sub4 = await sub4Promise
      const sub5 = await sub5Promise

      expect(sub4.id).to.be.equal(sub2.id)
      expect(sub5.id).to.be.equal(sub3.id)
    })

    it('should remove listeners with condition #2', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub4Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
      const sub5Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES

      const callback1 = () => ({})
      const callback2 = () => ({})

      rtHandlers.addDeleteListener('foo>123', callback1)
      rtHandlers.addDeleteListener('foo>123', callback2)
      rtHandlers.addDeleteListener(callback2)

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      rtHandlers.removeDeleteListeners('foo>123', callback1)
      rtHandlers.removeDeleteListeners(callback2)

      const sub4 = await sub4Promise
      const sub5 = await sub5Promise

      expect(sub4.id).to.be.equal(sub1.id)
      expect(sub5.id).to.be.equal(sub2.id)
    })

    it('should remove listeners with condition #3', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub4Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
      const sub5Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES

      const callback1 = () => ({})
      const callback2 = () => ({})

      rtHandlers.addDeleteListener('foo>123', callback1)
      rtHandlers.addDeleteListener('foo>123', callback2)
      rtHandlers.addDeleteListener(callback2)

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      rtHandlers.removeDeleteListeners('foo>123')

      const sub4 = await sub4Promise
      const sub5 = await sub5Promise

      expect(sub4.id).to.be.equal(sub1.id)
      expect(sub5.id).to.be.equal(sub2.id)
    })

    it('fails when callback is not a function on adding listener', async () => {
      const errorMsg = 'Listener Function must be passed.'

      expect(() => rtHandlers.addDeleteListener()).to.throw(errorMsg)
      expect(() => rtHandlers.addDeleteListener(undefined)).to.throw(errorMsg)
      expect(() => rtHandlers.addDeleteListener(null)).to.throw(errorMsg)
      expect(() => rtHandlers.addDeleteListener(true)).to.throw(errorMsg)
      expect(() => rtHandlers.addDeleteListener(false)).to.throw(errorMsg)
      expect(() => rtHandlers.addDeleteListener(0)).to.throw(errorMsg)
      expect(() => rtHandlers.addDeleteListener(123)).to.throw(errorMsg)
      expect(() => rtHandlers.addDeleteListener('')).to.throw(errorMsg)
      expect(() => rtHandlers.addDeleteListener('str')).to.throw(errorMsg)
      expect(() => rtHandlers.addDeleteListener({})).to.throw(errorMsg)
      expect(() => rtHandlers.addDeleteListener([])).to.throw(errorMsg)

      expect(() => rtHandlers.addDeleteListener('foo')).to.throw(errorMsg)
      expect(() => rtHandlers.addDeleteListener('foo', undefined)).to.throw(errorMsg)
      expect(() => rtHandlers.addDeleteListener('foo', null)).to.throw(errorMsg)
      expect(() => rtHandlers.addDeleteListener('foo', true)).to.throw(errorMsg)
      expect(() => rtHandlers.addDeleteListener('foo', false)).to.throw(errorMsg)
      expect(() => rtHandlers.addDeleteListener('foo', 0)).to.throw(errorMsg)
      expect(() => rtHandlers.addDeleteListener('foo', 123)).to.throw(errorMsg)
      expect(() => rtHandlers.addDeleteListener('foo', '')).to.throw(errorMsg)
      expect(() => rtHandlers.addDeleteListener('foo', 'str')).to.throw(errorMsg)
      expect(() => rtHandlers.addDeleteListener('foo', {})).to.throw(errorMsg)
      expect(() => rtHandlers.addDeleteListener('foo', [])).to.throw(errorMsg)
    })

    it('fails when callback is not a function on removing listener', async () => {
      const errorMsg = 'Listener Function must be passed.'

      expect(() => rtHandlers.removeDeleteListener()).to.throw(errorMsg)
      expect(() => rtHandlers.removeDeleteListener(undefined)).to.throw(errorMsg)
      expect(() => rtHandlers.removeDeleteListener(null)).to.throw(errorMsg)
      expect(() => rtHandlers.removeDeleteListener(true)).to.throw(errorMsg)
      expect(() => rtHandlers.removeDeleteListener(false)).to.throw(errorMsg)
      expect(() => rtHandlers.removeDeleteListener(0)).to.throw(errorMsg)
      expect(() => rtHandlers.removeDeleteListener(123)).to.throw(errorMsg)
      expect(() => rtHandlers.removeDeleteListener('')).to.throw(errorMsg)
      expect(() => rtHandlers.removeDeleteListener('str')).to.throw(errorMsg)
      expect(() => rtHandlers.removeDeleteListener({})).to.throw(errorMsg)
      expect(() => rtHandlers.removeDeleteListener([])).to.throw(errorMsg)
    })
  })

  describe('Bulk Create Listener', () => {
    it('should add a simple listener', async () => {

      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES

      const callbackPromise = new Promise(resolve => {
        rtHandlers.addBulkCreateListener(data => {
          resolve(data)
        })
      })

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub1.options).to.be.eql({
        event    : 'bulk-created',
        tableName: 'TEST_TABLE_NAME',
      })

      rtClient.subRes(sub1.id, { bar: 'test', foo: 123 })

      const callbackResult = await callbackPromise

      expect(callbackResult).to.be.eql({ bar: 'test', foo: 123 })
    })

    it('should add a simple listener with condition', async () => {

      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES

      const callbackPromise = new Promise(resolve => {
        rtHandlers.addBulkCreateListener('foo>123', data => {
          resolve(data)
        })
      })

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub1.options).to.be.eql({
        event      : 'bulk-created',
        tableName  : 'TEST_TABLE_NAME',
        whereClause: 'foo>123',
      })

      rtClient.subRes(sub1.id, { bar: 'test', foo: 123 })

      const callbackResult = await callbackPromise

      expect(callbackResult).to.be.eql({ bar: 'test', foo: 123 })
    })

    it('should add several listeners', async () => {

      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES

      const callback1Promise = new Promise(resolve => {
        rtHandlers.addBulkCreateListener(data => {
          resolve(data)
        })
      })

      const callback2Promise = new Promise(resolve => {
        rtHandlers.addBulkCreateListener(data => {
          resolve(data)
        })
      })

      const callback3Promise = new Promise(resolve => {
        rtHandlers.addBulkCreateListener(data => {
          resolve(data)
        })
      })

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub1.options).to.be.eql({
        event    : 'bulk-created',
        tableName: 'TEST_TABLE_NAME',
      })

      expect(sub2.id).to.be.a('string')
      expect(sub2.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub2.options).to.be.eql({
        event    : 'bulk-created',
        tableName: 'TEST_TABLE_NAME',
      })

      expect(sub3.id).to.be.a('string')
      expect(sub3.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub3.options).to.be.eql({
        event    : 'bulk-created',
        tableName: 'TEST_TABLE_NAME',
      })

      rtClient.subRes(sub1.id, { bar: 'test-1', foo: 123 })
      rtClient.subRes(sub2.id, { bar: 'test-2', foo: 123 })
      rtClient.subRes(sub3.id, { bar: 'test-3', foo: 123 })

      const callback1Result = await callback1Promise
      const callback2Result = await callback2Promise
      const callback3Result = await callback3Promise

      expect(callback1Result).to.be.eql({ bar: 'test-1', foo: 123 })
      expect(callback2Result).to.be.eql({ bar: 'test-2', foo: 123 })
      expect(callback3Result).to.be.eql({ bar: 'test-3', foo: 123 })
    })

    it('should not transform result into an instance', async () => {
      class Foo {
      }

      dataStore = Backendless.Data.of(Foo)
      rtHandlers = dataStore.rt()

      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES

      const callbackPromise = new Promise(resolve => {
        rtHandlers.addBulkCreateListener(data => {
          resolve(data)
        })
      })

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub1.options).to.be.eql({
        event    : 'bulk-created',
        tableName: 'Foo',
      })

      rtClient.subRes(sub1.id, { bar: 'test', foo: 123 })

      const callbackResult = await callbackPromise

      expect(callbackResult).to.be.eql({ bar: 'test', foo: 123 })
      expect(callbackResult).to.be.not.instanceof(Foo)
    })

    it('should remove listeners', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub4Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
      const sub5Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES

      const callback1 = () => ({})
      const callback2 = () => ({})
      const callback3 = () => ({})

      rtHandlers.addBulkCreateListener(callback1)
      rtHandlers.addBulkCreateListener(callback2)
      rtHandlers.addBulkCreateListener(callback3)

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      rtHandlers.removeBulkCreateListener(callback2)
      rtHandlers.removeBulkCreateListener(callback3)

      const sub4 = await sub4Promise
      const sub5 = await sub5Promise

      expect(sub4.id).to.be.equal(sub2.id)
      expect(sub5.id).to.be.equal(sub3.id)
    })

    it('should remove listeners with condition #1', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub4Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
      const sub5Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES

      const callback1 = () => ({})
      const callback2 = () => ({})

      rtHandlers.addBulkCreateListener('foo>111', callback1)
      rtHandlers.addBulkCreateListener('foo>222', callback2)
      rtHandlers.addBulkCreateListener(callback2)

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      rtHandlers.removeBulkCreateListener(callback2)

      const sub4 = await sub4Promise
      const sub5 = await sub5Promise

      expect(sub4.id).to.be.equal(sub2.id)
      expect(sub5.id).to.be.equal(sub3.id)
    })

    it('should remove listeners with condition #2', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub4Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
      const sub5Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES

      const callback1 = () => ({})
      const callback2 = () => ({})

      rtHandlers.addBulkCreateListener('foo>123', callback1)
      rtHandlers.addBulkCreateListener('foo>123', callback2)
      rtHandlers.addBulkCreateListener(callback2)

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      rtHandlers.removeBulkCreateListeners('foo>123', callback1)
      rtHandlers.removeBulkCreateListeners(callback2)

      const sub4 = await sub4Promise
      const sub5 = await sub5Promise

      expect(sub4.id).to.be.equal(sub1.id)
      expect(sub5.id).to.be.equal(sub2.id)
    })

    it('should remove listeners with condition #3', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub4Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
      const sub5Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES

      const callback1 = () => ({})
      const callback2 = () => ({})

      rtHandlers.addBulkCreateListener('foo>123', callback1)
      rtHandlers.addBulkCreateListener('foo>123', callback2)
      rtHandlers.addBulkCreateListener(callback2)

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      rtHandlers.removeBulkCreateListeners('foo>123')

      const sub4 = await sub4Promise
      const sub5 = await sub5Promise

      expect(sub4.id).to.be.equal(sub1.id)
      expect(sub5.id).to.be.equal(sub2.id)
    })

    it('fails when callback is not a function on adding listener', async () => {
      const errorMsg = 'Listener Function must be passed.'

      expect(() => rtHandlers.addBulkCreateListener()).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkCreateListener(undefined)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkCreateListener(null)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkCreateListener(true)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkCreateListener(false)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkCreateListener(0)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkCreateListener(123)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkCreateListener('')).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkCreateListener('str')).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkCreateListener({})).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkCreateListener([])).to.throw(errorMsg)

      expect(() => rtHandlers.addBulkCreateListener('foo')).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkCreateListener('foo', undefined)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkCreateListener('foo', null)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkCreateListener('foo', true)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkCreateListener('foo', false)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkCreateListener('foo', 0)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkCreateListener('foo', 123)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkCreateListener('foo', '')).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkCreateListener('foo', 'str')).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkCreateListener('foo', {})).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkCreateListener('foo', [])).to.throw(errorMsg)
    })

    it('fails when callback is not a function on removing listener', async () => {
      const errorMsg = 'Listener Function must be passed.'

      expect(() => rtHandlers.removeBulkCreateListener()).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkCreateListener(undefined)).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkCreateListener(null)).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkCreateListener(true)).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkCreateListener(false)).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkCreateListener(0)).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkCreateListener(123)).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkCreateListener('')).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkCreateListener('str')).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkCreateListener({})).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkCreateListener([])).to.throw(errorMsg)
    })
  })

  describe('Bulk Update Listener', () => {
    it('should add a simple listener', async () => {

      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES

      const callbackPromise = new Promise(resolve => {
        rtHandlers.addBulkUpdateListener(data => {
          resolve(data)
        })
      })

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub1.options).to.be.eql({
        event    : 'bulk-updated',
        tableName: 'TEST_TABLE_NAME',
      })

      rtClient.subRes(sub1.id, { bar: 'test', foo: 123 })

      const callbackResult = await callbackPromise

      expect(callbackResult).to.be.eql({ bar: 'test', foo: 123 })
    })

    it('should add a simple listener with condition', async () => {

      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES

      const callbackPromise = new Promise(resolve => {
        rtHandlers.addBulkUpdateListener('foo>123', data => {
          resolve(data)
        })
      })

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub1.options).to.be.eql({
        event      : 'bulk-updated',
        tableName  : 'TEST_TABLE_NAME',
        whereClause: 'foo>123',
      })

      rtClient.subRes(sub1.id, { bar: 'test', foo: 123 })

      const callbackResult = await callbackPromise

      expect(callbackResult).to.be.eql({ bar: 'test', foo: 123 })
    })

    it('should add several listeners', async () => {

      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES

      const callback1Promise = new Promise(resolve => {
        rtHandlers.addBulkUpdateListener(data => {
          resolve(data)
        })
      })

      const callback2Promise = new Promise(resolve => {
        rtHandlers.addBulkUpdateListener(data => {
          resolve(data)
        })
      })

      const callback3Promise = new Promise(resolve => {
        rtHandlers.addBulkUpdateListener(data => {
          resolve(data)
        })
      })

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub1.options).to.be.eql({
        event    : 'bulk-updated',
        tableName: 'TEST_TABLE_NAME',
      })

      expect(sub2.id).to.be.a('string')
      expect(sub2.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub2.options).to.be.eql({
        event    : 'bulk-updated',
        tableName: 'TEST_TABLE_NAME',
      })

      expect(sub3.id).to.be.a('string')
      expect(sub3.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub3.options).to.be.eql({
        event    : 'bulk-updated',
        tableName: 'TEST_TABLE_NAME',
      })

      rtClient.subRes(sub1.id, { bar: 'test-1', foo: 123 })
      rtClient.subRes(sub2.id, { bar: 'test-2', foo: 123 })
      rtClient.subRes(sub3.id, { bar: 'test-3', foo: 123 })

      const callback1Result = await callback1Promise
      const callback2Result = await callback2Promise
      const callback3Result = await callback3Promise

      expect(callback1Result).to.be.eql({ bar: 'test-1', foo: 123 })
      expect(callback2Result).to.be.eql({ bar: 'test-2', foo: 123 })
      expect(callback3Result).to.be.eql({ bar: 'test-3', foo: 123 })
    })

    it('should not transform result into an instance', async () => {
      class Foo {
      }

      dataStore = Backendless.Data.of(Foo)
      rtHandlers = dataStore.rt()

      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES

      const callbackPromise = new Promise(resolve => {
        rtHandlers.addBulkUpdateListener(data => {
          resolve(data)
        })
      })

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub1.options).to.be.eql({
        event    : 'bulk-updated',
        tableName: 'Foo',
      })

      rtClient.subRes(sub1.id, { bar: 'test', foo: 123 })

      const callbackResult = await callbackPromise

      expect(callbackResult).to.be.eql({ bar: 'test', foo: 123 })
      expect(callbackResult).to.be.not.instanceof(Foo)
    })

    it('should remove listeners', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub4Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
      const sub5Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES

      const callback1 = () => ({})
      const callback2 = () => ({})
      const callback3 = () => ({})

      rtHandlers.addBulkUpdateListener(callback1)
      rtHandlers.addBulkUpdateListener(callback2)
      rtHandlers.addBulkUpdateListener(callback3)

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      rtHandlers.removeBulkUpdateListener(callback2)
      rtHandlers.removeBulkUpdateListener(callback3)

      const sub4 = await sub4Promise
      const sub5 = await sub5Promise

      expect(sub4.id).to.be.equal(sub2.id)
      expect(sub5.id).to.be.equal(sub3.id)
    })

    it('should remove listeners with condition #1', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub4Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
      const sub5Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES

      const callback1 = () => ({})
      const callback2 = () => ({})

      rtHandlers.addBulkUpdateListener('foo>111', callback1)
      rtHandlers.addBulkUpdateListener('foo>222', callback2)
      rtHandlers.addBulkUpdateListener(callback2)

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      rtHandlers.removeBulkUpdateListener(callback2)

      const sub4 = await sub4Promise
      const sub5 = await sub5Promise

      expect(sub4.id).to.be.equal(sub2.id)
      expect(sub5.id).to.be.equal(sub3.id)
    })

    it('should remove listeners with condition #2', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub4Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
      const sub5Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES

      const callback1 = () => ({})
      const callback2 = () => ({})

      rtHandlers.addBulkUpdateListener('foo>123', callback1)
      rtHandlers.addBulkUpdateListener('foo>123', callback2)
      rtHandlers.addBulkUpdateListener(callback2)

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      rtHandlers.removeBulkUpdateListeners('foo>123', callback1)
      rtHandlers.removeBulkUpdateListeners(callback2)

      const sub4 = await sub4Promise
      const sub5 = await sub5Promise

      expect(sub4.id).to.be.equal(sub1.id)
      expect(sub5.id).to.be.equal(sub2.id)
    })

    it('should remove listeners with condition #3', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub4Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
      const sub5Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES

      const callback1 = () => ({})
      const callback2 = () => ({})

      rtHandlers.addBulkUpdateListener('foo>123', callback1)
      rtHandlers.addBulkUpdateListener('foo>123', callback2)
      rtHandlers.addBulkUpdateListener(callback2)

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      rtHandlers.removeBulkUpdateListeners('foo>123')

      const sub4 = await sub4Promise
      const sub5 = await sub5Promise

      expect(sub4.id).to.be.equal(sub1.id)
      expect(sub5.id).to.be.equal(sub2.id)
    })

    it('fails when callback is not a function on adding listener', async () => {
      const errorMsg = 'Listener Function must be passed.'

      expect(() => rtHandlers.addBulkUpdateListener()).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkUpdateListener(undefined)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkUpdateListener(null)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkUpdateListener(true)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkUpdateListener(false)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkUpdateListener(0)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkUpdateListener(123)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkUpdateListener('')).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkUpdateListener('str')).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkUpdateListener({})).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkUpdateListener([])).to.throw(errorMsg)

      expect(() => rtHandlers.addBulkUpdateListener('foo')).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkUpdateListener('foo', undefined)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkUpdateListener('foo', null)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkUpdateListener('foo', true)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkUpdateListener('foo', false)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkUpdateListener('foo', 0)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkUpdateListener('foo', 123)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkUpdateListener('foo', '')).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkUpdateListener('foo', 'str')).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkUpdateListener('foo', {})).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkUpdateListener('foo', [])).to.throw(errorMsg)
    })

    it('fails when callback is not a function on removing listener', async () => {
      const errorMsg = 'Listener Function must be passed.'

      expect(() => rtHandlers.removeBulkUpdateListener()).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkUpdateListener(undefined)).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkUpdateListener(null)).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkUpdateListener(true)).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkUpdateListener(false)).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkUpdateListener(0)).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkUpdateListener(123)).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkUpdateListener('')).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkUpdateListener('str')).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkUpdateListener({})).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkUpdateListener([])).to.throw(errorMsg)
    })
  })

  describe('Bulk Delete Listener', () => {
    it('should add a simple listener', async () => {

      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES

      const callbackPromise = new Promise(resolve => {
        rtHandlers.addBulkDeleteListener(data => {
          resolve(data)
        })
      })

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub1.options).to.be.eql({
        event    : 'bulk-deleted',
        tableName: 'TEST_TABLE_NAME',
      })

      rtClient.subRes(sub1.id, { bar: 'test', foo: 123 })

      const callbackResult = await callbackPromise

      expect(callbackResult).to.be.eql({ bar: 'test', foo: 123 })
    })

    it('should add a simple listener with condition', async () => {

      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES

      const callbackPromise = new Promise(resolve => {
        rtHandlers.addBulkDeleteListener('foo>123', data => {
          resolve(data)
        })
      })

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub1.options).to.be.eql({
        event      : 'bulk-deleted',
        tableName  : 'TEST_TABLE_NAME',
        whereClause: 'foo>123',
      })

      rtClient.subRes(sub1.id, { bar: 'test', foo: 123 })

      const callbackResult = await callbackPromise

      expect(callbackResult).to.be.eql({ bar: 'test', foo: 123 })
    })

    it('should add several listeners', async () => {

      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES

      const callback1Promise = new Promise(resolve => {
        rtHandlers.addBulkDeleteListener(data => {
          resolve(data)
        })
      })

      const callback2Promise = new Promise(resolve => {
        rtHandlers.addBulkDeleteListener(data => {
          resolve(data)
        })
      })

      const callback3Promise = new Promise(resolve => {
        rtHandlers.addBulkDeleteListener(data => {
          resolve(data)
        })
      })

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub1.options).to.be.eql({
        event    : 'bulk-deleted',
        tableName: 'TEST_TABLE_NAME',
      })

      expect(sub2.id).to.be.a('string')
      expect(sub2.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub2.options).to.be.eql({
        event    : 'bulk-deleted',
        tableName: 'TEST_TABLE_NAME',
      })

      expect(sub3.id).to.be.a('string')
      expect(sub3.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub3.options).to.be.eql({
        event    : 'bulk-deleted',
        tableName: 'TEST_TABLE_NAME',
      })

      rtClient.subRes(sub1.id, { bar: 'test-1', foo: 123 })
      rtClient.subRes(sub2.id, { bar: 'test-2', foo: 123 })
      rtClient.subRes(sub3.id, { bar: 'test-3', foo: 123 })

      const callback1Result = await callback1Promise
      const callback2Result = await callback2Promise
      const callback3Result = await callback3Promise

      expect(callback1Result).to.be.eql({ bar: 'test-1', foo: 123 })
      expect(callback2Result).to.be.eql({ bar: 'test-2', foo: 123 })
      expect(callback3Result).to.be.eql({ bar: 'test-3', foo: 123 })
    })

    it('should not transform result into an instance', async () => {
      class Foo {
      }

      dataStore = Backendless.Data.of(Foo)
      rtHandlers = dataStore.rt()

      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES

      const callbackPromise = new Promise(resolve => {
        rtHandlers.addBulkDeleteListener(data => {
          resolve(data)
        })
      })

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('OBJECTS_CHANGES')
      expect(sub1.options).to.be.eql({
        event    : 'bulk-deleted',
        tableName: 'Foo',
      })

      rtClient.subRes(sub1.id, { bar: 'test', foo: 123 })

      const callbackResult = await callbackPromise

      expect(callbackResult).to.be.eql({ bar: 'test', foo: 123 })
      expect(callbackResult).to.be.not.instanceof(Foo)
    })

    it('should remove listeners', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub4Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
      const sub5Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES

      const callback1 = () => ({})
      const callback2 = () => ({})
      const callback3 = () => ({})

      rtHandlers.addBulkDeleteListener(callback1)
      rtHandlers.addBulkDeleteListener(callback2)
      rtHandlers.addBulkDeleteListener(callback3)

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      rtHandlers.removeBulkDeleteListener(callback2)
      rtHandlers.removeBulkDeleteListener(callback3)

      const sub4 = await sub4Promise
      const sub5 = await sub5Promise

      expect(sub4.id).to.be.equal(sub2.id)
      expect(sub5.id).to.be.equal(sub3.id)
    })

    it('should remove listeners with condition #1', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub4Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
      const sub5Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES

      const callback1 = () => ({})
      const callback2 = () => ({})

      rtHandlers.addBulkDeleteListener('foo>111', callback1)
      rtHandlers.addBulkDeleteListener('foo>222', callback2)
      rtHandlers.addBulkDeleteListener(callback2)

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      rtHandlers.removeBulkDeleteListener(callback2)

      const sub4 = await sub4Promise
      const sub5 = await sub5Promise

      expect(sub4.id).to.be.equal(sub2.id)
      expect(sub5.id).to.be.equal(sub3.id)
    })

    it('should remove listeners with condition #2', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub4Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
      const sub5Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES

      const callback1 = () => ({})
      const callback2 = () => ({})

      rtHandlers.addBulkDeleteListener('foo>123', callback1)
      rtHandlers.addBulkDeleteListener('foo>123', callback2)
      rtHandlers.addBulkDeleteListener(callback2)

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      rtHandlers.removeBulkDeleteListeners('foo>123', callback1)
      rtHandlers.removeBulkDeleteListeners(callback2)

      const sub4 = await sub4Promise
      const sub5 = await sub5Promise

      expect(sub4.id).to.be.equal(sub1.id)
      expect(sub5.id).to.be.equal(sub2.id)
    })

    it('should remove listeners with condition #3', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
      const sub4Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
      const sub5Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES

      const callback1 = () => ({})
      const callback2 = () => ({})

      rtHandlers.addBulkDeleteListener('foo>123', callback1)
      rtHandlers.addBulkDeleteListener('foo>123', callback2)
      rtHandlers.addBulkDeleteListener(callback2)

      const sub1 = await sub1Promise
      const sub2 = await sub2Promise
      const sub3 = await sub3Promise

      rtHandlers.removeBulkDeleteListeners('foo>123')

      const sub4 = await sub4Promise
      const sub5 = await sub5Promise

      expect(sub4.id).to.be.equal(sub1.id)
      expect(sub5.id).to.be.equal(sub2.id)
    })

    it('fails when callback is not a function on adding listener', async () => {
      const errorMsg = 'Listener Function must be passed.'

      expect(() => rtHandlers.addBulkDeleteListener()).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkDeleteListener(undefined)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkDeleteListener(null)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkDeleteListener(true)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkDeleteListener(false)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkDeleteListener(0)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkDeleteListener(123)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkDeleteListener('')).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkDeleteListener('str')).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkDeleteListener({})).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkDeleteListener([])).to.throw(errorMsg)

      expect(() => rtHandlers.addBulkDeleteListener('foo')).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkDeleteListener('foo', undefined)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkDeleteListener('foo', null)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkDeleteListener('foo', true)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkDeleteListener('foo', false)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkDeleteListener('foo', 0)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkDeleteListener('foo', 123)).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkDeleteListener('foo', '')).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkDeleteListener('foo', 'str')).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkDeleteListener('foo', {})).to.throw(errorMsg)
      expect(() => rtHandlers.addBulkDeleteListener('foo', [])).to.throw(errorMsg)
    })

    it('fails when callback is not a function on removing listener', async () => {
      const errorMsg = 'Listener Function must be passed.'

      expect(() => rtHandlers.removeBulkDeleteListener()).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkDeleteListener(undefined)).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkDeleteListener(null)).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkDeleteListener(true)).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkDeleteListener(false)).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkDeleteListener(0)).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkDeleteListener(123)).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkDeleteListener('')).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkDeleteListener('str')).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkDeleteListener({})).to.throw(errorMsg)
      expect(() => rtHandlers.removeBulkDeleteListener([])).to.throw(errorMsg)
    })
  })

  it('should remove only particular listener', async () => {
    const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
    const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
    const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES

    const subOff2Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES

    const callback1 = () => ({})

    rtHandlers.addCreateListener(callback1)
    rtHandlers.addUpdateListener(callback1)
    rtHandlers.addDeleteListener(callback1)

    const sub1 = await sub1Promise
    const sub2 = await sub2Promise
    const sub3 = await sub3Promise

    expect(sub1.options.event).to.be.equal('created')
    expect(sub2.options.event).to.be.equal('updated')
    expect(sub3.options.event).to.be.equal('deleted')

    rtHandlers.removeUpdateListener(callback1)

    const subOff2 = await subOff2Promise

    expect(sub2.id).to.be.equal(subOff2.id)
  })

  it('should remove all listeners', async () => {
    const sub1Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
    const sub2Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
    const sub3Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
    const sub4Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
    const sub5Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
    const sub6Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
    const sub7Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
    const sub8Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES
    const sub9Promise = rtClient.getNext_SUB_ON() // OBJECTS_CHANGES

    const subOff1Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
    const subOff2Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
    const subOff3Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
    const subOff4Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
    const subOff5Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
    const subOff6Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
    const subOff7Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
    const subOff8Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES
    const subOff9Promise = rtClient.getNext_SUB_OFF() // OBJECTS_CHANGES

    const callback1 = () => ({})
    const callback2 = () => ({})

    rtHandlers.addCreateListener(callback1)
    rtHandlers.addUpdateListener(callback2)
    rtHandlers.addDeleteListener(callback1)

    rtHandlers.addCreateListener('foo=1', callback1)
    rtHandlers.addUpdateListener('foo=1', callback2)
    rtHandlers.addDeleteListener('foo=1', callback1)

    rtHandlers.addBulkCreateListener('foo=1', callback2)
    rtHandlers.addBulkUpdateListener('foo=1', callback2)
    rtHandlers.addBulkDeleteListener('foo=1', callback2)

    const sub1 = await sub1Promise
    const sub2 = await sub2Promise
    const sub3 = await sub3Promise
    const sub4 = await sub4Promise
    const sub5 = await sub5Promise
    const sub6 = await sub6Promise
    const sub7 = await sub7Promise
    const sub8 = await sub8Promise
    const sub9 = await sub9Promise

    expect(sub1.options.event).to.be.equal('created')
    expect(sub2.options.event).to.be.equal('updated')
    expect(sub3.options.event).to.be.equal('deleted')
    expect(sub4.options.event).to.be.equal('created')
    expect(sub5.options.event).to.be.equal('updated')
    expect(sub6.options.event).to.be.equal('deleted')
    expect(sub7.options.event).to.be.equal('bulk-created')
    expect(sub8.options.event).to.be.equal('bulk-updated')
    expect(sub9.options.event).to.be.equal('bulk-deleted')

    rtHandlers.removeAllListeners()

    const subOff1 = await subOff1Promise
    const subOff2 = await subOff2Promise
    const subOff3 = await subOff3Promise
    const subOff4 = await subOff4Promise
    const subOff5 = await subOff5Promise
    const subOff6 = await subOff6Promise
    const subOff7 = await subOff7Promise
    const subOff8 = await subOff8Promise
    const subOff9 = await subOff9Promise

    const subIds = [sub1.id, sub2.id, sub3.id, sub4.id, sub5.id, sub6.id, sub7.id, sub8.id, sub9.id]
    const subOffIds = [subOff1.id, subOff2.id, subOff3.id, subOff4.id, subOff5.id, subOff6.id, subOff7.id, subOff8.id, subOff9.id]

    expect(subIds.sort()).to.be.eql(subOffIds.sort())
  })

})
