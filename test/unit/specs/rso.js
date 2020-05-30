import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { Utils, forTest, prepareMockRequest, createMockRTServer } from '../helpers/sandbox'

describe('RSO', function() {
  forTest(this)

  const rsoName = 'TEST_RSO_NAME'

  let rtClient

  let rso

  beforeEach(async () => {
    rtClient = await createMockRTServer()

    prepareMockRequest(rtClient.host)

    rso = Backendless.SharedObject.connect(rsoName)

    await rtClient.getNext_CONNECT()
  })

  afterEach(async () => {
    rtClient.stop()
  })

  describe('Connection', () => {
    it('can connect and disconnect', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // RSO_CONNECT
      const sub2Promise = rtClient.getNext_SUB_ON() // RSO_INVOKE
      const sub3Promise = rtClient.getNext_SUB_ON() // RSO_CONNECT
      const sub4Promise = rtClient.getNext_SUB_ON() // RSO_INVOKE

      const subOff1Promise = rtClient.getNext_SUB_OFF() // RSO_CONNECT
      const subOff2Promise = rtClient.getNext_SUB_OFF() // RSO_INVOKE

      expect(rso.isConnected()).to.be.equal(false)

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('RSO_CONNECT')
      expect(sub1.options).to.be.eql({ name: 'TEST_RSO_NAME' })

      rtClient.subReady(sub1.id)

      const sub2 = await sub2Promise

      expect(sub2.id).to.be.a('string')
      expect(sub2.name).to.be.equal('RSO_INVOKE')
      expect(sub2.options).to.be.eql({ name: 'TEST_RSO_NAME' })

      rtClient.subReady(sub2.id)

      await Utils.wait(100)

      expect(rso.isConnected()).to.be.equal(true)

      rso.disconnect()

      const subOff1 = await subOff1Promise

      expect(subOff1.id).to.be.equal(sub1.id)

      const subOff2 = await subOff2Promise

      expect(subOff2.id).to.be.equal(sub2.id)

      await Utils.wait(100)

      expect(rso.isConnected()).to.be.equal(false)

      rso.connect()

      const sub3 = await sub3Promise

      expect(sub3.id).to.be.a('string')
      expect(sub3.name).to.be.equal('RSO_CONNECT')
      expect(sub3.options).to.be.eql({ name: 'TEST_RSO_NAME' })

      rtClient.subReady(sub3.id)

      const sub4 = await sub4Promise

      expect(sub4.id).to.be.a('string')
      expect(sub4.name).to.be.equal('RSO_INVOKE')
      expect(sub4.options).to.be.eql({ name: 'TEST_RSO_NAME' })

      rtClient.subReady(sub4.id)

      await Utils.wait(100)

      expect(rso.isConnected()).to.be.equal(true)
    })

    it('adds connect listener', async () => {
      const sub1 = await rtClient.getNext_SUB_ON() // RSO_CONNECT

      const callbackPromise = new Promise(resolve => {
        rso.addConnectListener(resolve)
      })

      rtClient.subReady(sub1.id)

      const result = await callbackPromise

      expect(result).to.be.equal(undefined)
    })

    it('removes connect listener', async () => {
      const callback = () => ({})

      rso.addConnectListener(callback)
      rso.removeConnectListeners(callback)
    })

  })

  describe('UserStatus', () => {
    it('adds simple listener', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // RSO_CONNECT
      const sub2Promise = rtClient.getNext_SUB_ON() // RSO_USERS

      const userStatusPromise = new Promise(resolve => {
        rso.addUserStatusListener(userStatus => {
          resolve(userStatus)
        })
      })

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('RSO_CONNECT')
      expect(sub1.options).to.be.eql({ name: 'TEST_RSO_NAME' })

      rtClient.subReady(sub1.id)

      const sub2 = await sub2Promise

      expect(sub2.id).to.be.a('string')
      expect(sub2.name).to.be.equal('RSO_USERS')
      expect(sub2.options).to.be.eql({ name: 'TEST_RSO_NAME' })

      rtClient.subRes(sub2.id, { message: 'test', foo: 123 })

      const userStatus = await userStatusPromise

      expect(userStatus).to.be.eql({ message: 'test', foo: 123 })
    })

    it('removes simple listener', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // RSO_CONNECT
      const sub2Promise = rtClient.getNext_SUB_ON() // RSO_USERS
      const sub3Promise = rtClient.getNext_SUB_ON() // RSO_USERS
      const subOff1Promise = rtClient.getNext_SUB_OFF() // RSO_USERS
      const subOff2Promise = rtClient.getNext_SUB_OFF() // RSO_USERS

      const callback1 = () => ({})
      const callback2 = () => ({})

      rso.addUserStatusListener(callback1)
      rso.addUserStatusListener(callback2)

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('RSO_CONNECT')
      expect(sub1.options).to.be.eql({ name: 'TEST_RSO_NAME' })

      rtClient.subReady(sub1.id)

      const sub2 = await sub2Promise

      expect(sub2.id).to.be.a('string')
      expect(sub2.name).to.be.equal('RSO_USERS')
      expect(sub2.options).to.be.eql({ name: 'TEST_RSO_NAME' })

      const sub3 = await sub3Promise

      expect(sub3.id).to.be.a('string')
      expect(sub3.name).to.be.equal('RSO_USERS')
      expect(sub3.options).to.be.eql({ name: 'TEST_RSO_NAME' })

      rso.removeUserStatusListeners(callback1)
      rso.removeUserStatusListeners(callback2)

      const subOff1 = await subOff1Promise
      const subOff2 = await subOff2Promise

      expect(sub2.id).to.be.equal(subOff1.id)
      expect(sub3.id).to.be.equal(subOff2.id)
    })
  })

  describe('Commands', () => {
    it('adds simple listener', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // RSO_CONNECT
      const sub2Promise = rtClient.getNext_SUB_ON() // RSO_COMMAND

      const commandPromise = new Promise(resolve => {
        rso.addCommandListener(userStatus => {
          resolve(userStatus)
        })
      })

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('RSO_CONNECT')
      expect(sub1.options).to.be.eql({ name: 'TEST_RSO_NAME' })

      rtClient.subReady(sub1.id)

      const sub2 = await sub2Promise

      expect(sub2.id).to.be.a('string')
      expect(sub2.name).to.be.equal('RSO_COMMANDS')
      expect(sub2.options).to.be.eql({ name: 'TEST_RSO_NAME' })

      rtClient.subRes(sub2.id, { message: 'test', foo: 123 })

      const command = await commandPromise

      expect(command).to.be.eql({ message: 'test', foo: 123 })
    })

    it('removes simple listener', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // RSO_CONNECT
      const sub2Promise = rtClient.getNext_SUB_ON() // RSO_COMMANDS
      const sub3Promise = rtClient.getNext_SUB_ON() // RSO_COMMANDS
      const subOff1Promise = rtClient.getNext_SUB_OFF() // RSO_COMMANDS
      const subOff2Promise = rtClient.getNext_SUB_OFF() // RSO_COMMANDS

      const callback1 = () => ({})
      const callback2 = () => ({})

      rso.addCommandListener(callback1)
      rso.addCommandListener(callback2)

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('RSO_CONNECT')
      expect(sub1.options).to.be.eql({ name: 'TEST_RSO_NAME' })

      rtClient.subReady(sub1.id)

      const sub2 = await sub2Promise

      expect(sub2.id).to.be.a('string')
      expect(sub2.name).to.be.equal('RSO_COMMANDS')
      expect(sub2.options).to.be.eql({ name: 'TEST_RSO_NAME' })

      const sub3 = await sub3Promise

      expect(sub3.id).to.be.a('string')
      expect(sub3.name).to.be.equal('RSO_COMMANDS')
      expect(sub3.options).to.be.eql({ name: 'TEST_RSO_NAME' })

      rso.removeCommandListeners(callback1)
      rso.removeCommandListeners(callback2)

      const subOff1 = await subOff1Promise
      const subOff2 = await subOff2Promise

      expect(sub2.id).to.be.equal(subOff1.id)
      expect(sub3.id).to.be.equal(subOff2.id)

    })

    it('sends command', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // RSO_CONNECT

      const met1Promise = rtClient.getNext_MET_REQ() // RSO_COMMAND

      const sendCommandPromise = rso.send('TEST-COMMAND', { foo: 123, bar: 'str' })

      const sub1 = await sub1Promise

      rtClient.subReady(sub1.id)

      const met1 = await met1Promise

      expect(met1.id).to.be.a('string')
      expect(met1.name).to.be.equal('RSO_COMMAND')
      expect(met1.options).to.be.eql({
        name: 'TEST_RSO_NAME',
        type: 'TEST-COMMAND',
        data: { foo: 123, bar: 'str' }
      })

      rtClient.metRes(met1.id, { restResult: 'foo', bar: 123 })

      const sendCommand = await sendCommandPromise

      expect(sendCommand).to.be.eql({ restResult: 'foo', bar: 123 })
    })
  })

  describe('Invoke', () => {
    let invocationTarget
    let fooPromise
    let barPromise

    let conSub
    let invokeSub

    beforeEach(async () => {
      rso.setInvocationTarget(invocationTarget = {})

      fooPromise = new Promise(resolve => {
        invocationTarget.foo = (...args) => resolve(args)
      })

      barPromise = new Promise(resolve => {
        invocationTarget.bar = (...args) => resolve(args)
      })

      conSub = await rtClient.getNext_SUB_ON() // RSO_CONNECT

      rtClient.subReady(conSub.id)

      invokeSub = await rtClient.getNext_SUB_ON() // RSO_INVOKE

      rtClient.subReady(invokeSub.id)
    })

    it('invokes methods', async () => {
      const met1Promise = rtClient.getNext_MET_REQ() // RSO_INVOKE
      const met2Promise = rtClient.getNext_MET_REQ() // RSO_INVOKE

      const invoke1Promise = rso.invoke('foo', { foo: 123 }, 123, 'bar')

      const met1 = await met1Promise

      expect(met1.id).to.be.a('string')
      expect(met1.name).to.be.equal('RSO_INVOKE')
      expect(met1.options.targets).to.be.equal(undefined)
      expect(met1.options).to.be.eql({
        args  : [{ 'foo': 123 }, 123, 'bar'],
        method: 'foo',
        name  : 'TEST_RSO_NAME',
      })

      rtClient.metRes(met1.id, { result: 'test-ok-1' })

      const invoke1 = await invoke1Promise

      expect(invoke1).to.be.eql({ result: 'test-ok-1' })

      rtClient.subRes(invokeSub.id, { method: met1.options.method, args: met1.options.args })

      const fooResult = await fooPromise

      expect(fooResult).to.be.eql([{ 'foo': 123 }, 123, 'bar'])

      const invoke2Promise = rso.invoke('bar', ['foo', 'bar'], true, null)

      const met2 = await met2Promise

      expect(met2.id).to.be.a('string')
      expect(met2.name).to.be.equal('RSO_INVOKE')
      expect(met2.options.targets).to.be.equal(undefined)
      expect(met2.options).to.be.eql({
        args  : [['foo', 'bar'], true, null],
        method: 'bar',
        name  : 'TEST_RSO_NAME',
      })

      rtClient.metRes(met2.id, { result: 'test-ok-2' })

      const invoke2 = await invoke2Promise

      expect(invoke2).to.be.eql({ result: 'test-ok-2' })

      rtClient.subRes(invokeSub.id, { method: met2.options.method, args: met2.options.args })

      const barResult = await barPromise

      expect(barResult).to.be.eql([['foo', 'bar'], true, null])
    })

    it('invokes methods on targets', async () => {
      const met1Promise = rtClient.getNext_MET_REQ() // RSO_INVOKE
      const met2Promise = rtClient.getNext_MET_REQ() // RSO_INVOKE

      const invoke1Promise = rso.invokeOn('foo', null, { foo: 123 }, 123, 'bar')

      const met1 = await met1Promise

      expect(met1.id).to.be.a('string')
      expect(met1.name).to.be.equal('RSO_INVOKE')
      expect(met1.options).to.be.eql({
        args   : [{ 'foo': 123 }, 123, 'bar'],
        method : 'foo',
        name   : 'TEST_RSO_NAME',
        targets: null,
      })

      rtClient.metRes(met1.id, { result: 'test-ok-1' })

      const invoke1 = await invoke1Promise

      expect(invoke1).to.be.eql({ result: 'test-ok-1' })

      rtClient.subRes(invokeSub.id, { method: met1.options.method, args: met1.options.args })

      const fooResult = await fooPromise

      expect(fooResult).to.be.eql([{ 'foo': 123 }, 123, 'bar'])

      const invoke2Promise = rso.invokeOn('bar', ['user-1', 'user-2'], ['foo', 'bar'], true, null)

      const met2 = await met2Promise

      expect(met2.id).to.be.a('string')
      expect(met2.name).to.be.equal('RSO_INVOKE')
      expect(met2.options).to.be.eql({
        args   : [['foo', 'bar'], true, null],
        method : 'bar',
        name   : 'TEST_RSO_NAME',
        targets: ['user-1', 'user-2'],
      })

      rtClient.metRes(met2.id, { result: 'test-ok-2' })

      const invoke2 = await invoke2Promise

      expect(invoke2).to.be.eql({ result: 'test-ok-2' })

      rtClient.subRes(invokeSub.id, { method: met2.options.method, args: met2.options.args })

      const barResult = await barPromise

      expect(barResult).to.be.eql([['foo', 'bar'], true, null])
    })

    it('fails on invoke methods when invocationTarget is not specified', async () => {
      rso.setInvocationTarget(null)

      const errorMsg = '"invocationTarget" is not specified'

      await expect(rso.invoke('foo')).to.eventually.be.rejectedWith(errorMsg)
      await expect(rso.invokeOn('foo')).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails on invoke methods when invocationTarget has no the target method', async () => {
      const errorMsg = 'Method "not-existed-method" of invocationTarget is not function'

      await expect(rso.invoke('not-existed-method')).to.eventually.be.rejectedWith(errorMsg)
      await expect(rso.invokeOn('not-existed-method')).to.eventually.be.rejectedWith(errorMsg)
    })

  })

  describe('Data', () => {
    let conSub

    beforeEach(async () => {
      conSub = await rtClient.getNext_SUB_ON() // RSO_CONNECT

      rtClient.subReady(conSub.id)
    })

    it('get data', async () => {
      const met1Promise = rtClient.getNext_MET_REQ() // RSO_GET
      const met2Promise = rtClient.getNext_MET_REQ() // RSO_GET

      const get1Promise = rso.get('get-value-1')

      const met1 = await met1Promise

      expect(met1.id).to.be.a('string')
      expect(met1.name).to.be.equal('RSO_GET')
      expect(met1.options).to.be.eql({
        key : 'get-value-1',
        name: 'TEST_RSO_NAME',
      })

      rtClient.metRes(met1.id, { result: 'test-ok-1' })

      const get1Result = await get1Promise

      expect(get1Result).to.be.eql({ result: 'test-ok-1' })

      const get2Promise = rso.get('get-value-2')

      const met2 = await met2Promise

      expect(met2.id).to.be.a('string')
      expect(met2.name).to.be.equal('RSO_GET')
      expect(met2.options).to.be.eql({
        key : 'get-value-2',
        name: 'TEST_RSO_NAME',
      })

      rtClient.metRes(met2.id, { result: 'test-ok-2' })

      const get2Result = await get2Promise

      expect(get2Result).to.be.eql({ result: 'test-ok-2' })
    })

    it('set data', async () => {
      const met1Promise = rtClient.getNext_MET_REQ() // RSO_SET
      const met2Promise = rtClient.getNext_MET_REQ() // RSO_SET

      const get1Promise = rso.set('get-value-1', { foo: [1, 2, 3], bar: true })

      const met1 = await met1Promise

      expect(met1.id).to.be.a('string')
      expect(met1.name).to.be.equal('RSO_SET')
      expect(met1.options).to.be.eql({
        key : 'get-value-1',
        data: { foo: [1, 2, 3], bar: true },
        name: 'TEST_RSO_NAME',
      })

      rtClient.metRes(met1.id, { result: 'test-ok-1' })

      const get1Result = await get1Promise

      expect(get1Result).to.be.eql({ result: 'test-ok-1' })

      const get2Promise = rso.set('get-value-2', 'some-string')

      const met2 = await met2Promise

      expect(met2.id).to.be.a('string')
      expect(met2.name).to.be.equal('RSO_SET')
      expect(met2.options).to.be.eql({
        key : 'get-value-2',
        data: 'some-string',
        name: 'TEST_RSO_NAME',
      })

      rtClient.metRes(met2.id, { result: 'test-ok-2' })

      const get2Result = await get2Promise

      expect(get2Result).to.be.eql({ result: 'test-ok-2' })
    })

    it('clear data', async () => {
      const met1Promise = rtClient.getNext_MET_REQ() // RSO_CLEAR
      const met2Promise = rtClient.getNext_MET_REQ() // RSO_CLEAR

      const get1Promise = rso.clear()

      const met1 = await met1Promise

      expect(met1.id).to.be.a('string')
      expect(met1.name).to.be.equal('RSO_CLEAR')
      expect(met1.options).to.be.eql({
        name: 'TEST_RSO_NAME',
      })

      rtClient.metRes(met1.id, { result: 'test-ok-1' })

      const get1Result = await get1Promise

      expect(get1Result).to.be.eql({ result: 'test-ok-1' })

      const get2Promise = rso.clear()

      const met2 = await met2Promise

      expect(met2.id).to.be.a('string')
      expect(met2.name).to.be.equal('RSO_CLEAR')
      expect(met2.options).to.be.eql({
        name: 'TEST_RSO_NAME',
      })

      rtClient.metRes(met2.id, { result: 'test-ok-2' })

      const get2Result = await get2Promise

      expect(get2Result).to.be.eql({ result: 'test-ok-2' })
    })

    describe('Listeners', () => {
      it('add/remove ChangesListener', async () => {
        const sub1Promise = rtClient.getNext_SUB_ON() // RSO_CHANGES
        const sub2Promise = rtClient.getNext_SUB_OFF() // RSO_CHANGES

        const changesPromise = new Promise(resolve => {
          rso.addChangesListener(userStatus => {
            resolve(userStatus)
          })
        })

        const sub1 = await sub1Promise

        expect(sub1.id).to.be.a('string')
        expect(sub1.name).to.be.equal('RSO_CHANGES')
        expect(sub1.options).to.be.eql({ name: 'TEST_RSO_NAME' })

        rtClient.subRes(sub1.id, { data: 'test', foo: 123 })

        const changes = await changesPromise

        expect(changes).to.be.eql({ data: 'test', foo: 123 })

        rso.removeChangesListeners()

        const sub2 = await sub2Promise

        expect(sub2).to.be.eql({ id: sub1.id })
      })

      it('add/remove ClearListener', async () => {
        const sub1Promise = rtClient.getNext_SUB_ON() // RSO_CLEARED
        const sub2Promise = rtClient.getNext_SUB_OFF() // RSO_CLEARED

        const changesPromise = new Promise(resolve => {
          rso.addClearListener(userStatus => {
            resolve(userStatus)
          })
        })

        const sub1 = await sub1Promise

        expect(sub1.id).to.be.a('string')
        expect(sub1.name).to.be.equal('RSO_CLEARED')
        expect(sub1.options).to.be.eql({ name: 'TEST_RSO_NAME' })

        rtClient.subRes(sub1.id, { data: 'test', foo: 123 })

        const changes = await changesPromise

        expect(changes).to.be.eql({ data: 'test', foo: 123 })

        rso.removeClearListeners()

        const sub2 = await sub2Promise

        expect(sub2).to.be.eql({ id: sub1.id })
      })
    })
  })

  it('removes all listeners', async () => {
    const con1 = await rtClient.getNext_SUB_ON() // RSO_CONNECT

    rtClient.subReady(con1.id)

    const sub1Promise = rtClient.getNext_SUB_ON() // RSO_INVOKE

    const sub1 = await sub1Promise

    const sub2Promise = rtClient.getNext_SUB_ON() // RSO_CHANGES
    const sub3Promise = rtClient.getNext_SUB_ON() // RSO_CLEARED
    const sub4Promise = rtClient.getNext_SUB_ON() // RSO_COMMANDS
    const sub5Promise = rtClient.getNext_SUB_ON() // RSO_USERS

    const subOff1Promise = rtClient.getNext_SUB_OFF() // RSO_INVOKE
    const subOff2Promise = rtClient.getNext_SUB_OFF() // RSO_CHANGES
    const subOff3Promise = rtClient.getNext_SUB_OFF() // RSO_CLEARED
    const subOff4Promise = rtClient.getNext_SUB_OFF() // RSO_COMMANDS
    const subOff5Promise = rtClient.getNext_SUB_OFF() // RSO_USERS

    const callback1 = () => ({})

    rso.addChangesListener(callback1)
    rso.addClearListener(callback1)
    rso.addCommandListener(callback1)
    rso.addUserStatusListener(callback1)

    const sub2 = await sub2Promise
    const sub3 = await sub3Promise
    const sub4 = await sub4Promise
    const sub5 = await sub5Promise

    expect(sub1.name).to.be.equal('RSO_INVOKE')
    expect(sub2.name).to.be.equal('RSO_CHANGES')
    expect(sub3.name).to.be.equal('RSO_CLEARED')
    expect(sub4.name).to.be.equal('RSO_COMMANDS')
    expect(sub5.name).to.be.equal('RSO_USERS')

    rso.removeAllListeners()

    const subOff1 = await subOff1Promise
    const subOff2 = await subOff2Promise
    const subOff3 = await subOff3Promise
    const subOff4 = await subOff4Promise
    const subOff5 = await subOff5Promise

    expect(sub1.id).to.be.equal(subOff1.id)
    expect(sub2.id).to.be.equal(subOff2.id)
    expect(sub3.id).to.be.equal(subOff3.id)
    expect(sub4.id).to.be.equal(subOff4.id)
    expect(sub5.id).to.be.equal(subOff5.id)

  })

})
