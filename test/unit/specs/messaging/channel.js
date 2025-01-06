import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { Utils, forTest, prepareMockRequest, createMockRTServer, APP_PATH } from '../../helpers/sandbox'

describe('<Messaging> Channel', function() {

  forTest(this)

  this.timeout(10000)

  const channelName = 'TEST_CHANNEL_NAME'
  const message = 'TEST_MESSAGE'
  const rtURL = 'http://localhost:12345'

  const fakeResult = { foo: 123 }

  let rtClient

  let channel


  beforeEach(async () => {
    rtClient = await createMockRTServer()

    Backendless.appInfoPromise = chai.spy(() =>
      Promise.resolve({ rtURL })
    )

    channel = Backendless.Messaging.subscribe(channelName)

    await rtClient.getNext_CONNECT()
  })

  afterEach(async () => {
    rtClient.stop()
  })

  describe('Publish', () => {

    it('publishes a basic message', async () => {
      const req1 = prepareMockRequest({ fakeResult })

      const result1 = await channel.publish(message)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/messaging/${channelName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          message,
        }
      })

      expect(result1).to.be.eql({ fakeResult })
    })

    it('publishes object message', async () => {
      const req1 = prepareMockRequest({ fakeResult })

      const result1 = await channel.publish({ foo: 123, message })

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/messaging/${channelName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          message: { foo: 123, message },
        }
      })

      expect(result1).to.be.eql({ fakeResult })
    })

    it('publishes a basic message with publishOptions', async () => {
      const req1 = prepareMockRequest({ fakeResult })
      const req2 = prepareMockRequest({ fakeResult })
      const req3 = prepareMockRequest({ fakeResult })

      const publishOptions1 = new Backendless.Messaging.PublishOptions({})

      const publishOptions2 = new Backendless.Messaging.PublishOptions({
        publisherId: 'test-publisherId',
        headers    : 'test-headers',
        subtopic   : 'test-subtopic',
        foo        : '111',
      })

      const publishOptions3 = {
        publisherId: 'test-publisherId',
        headers    : 'test-headers',
        subtopic   : 'test-subtopic',
        foo        : '222',
      }

      const result1 = await channel.publish(message, publishOptions1)
      const result2 = await channel.publish(message, publishOptions2)
      const result3 = await channel.publish(message, publishOptions3)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/messaging/${channelName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          message,
        }
      })

      expect(req2).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/messaging/${channelName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          message,
          publisherId: 'test-publisherId',
          headers    : 'test-headers',
          subtopic   : 'test-subtopic',
        }
      })

      expect(req3).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/messaging/${channelName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          message,
          publisherId: 'test-publisherId',
          headers    : 'test-headers',
          subtopic   : 'test-subtopic',
          foo        : '222',
        }
      })

      expect(result1).to.be.eql({ fakeResult })
      expect(result2).to.be.eql({ fakeResult })
      expect(result3).to.be.eql({ fakeResult })
    })

    it('publishes a basic message with deliveryOptions', async () => {
      const req1 = prepareMockRequest({ fakeResult })
      const req2 = prepareMockRequest({ fakeResult })
      const req3 = prepareMockRequest({ fakeResult })

      const deliveryOptions1 = new Backendless.Messaging.DeliveryOptions({})

      const deliveryOptions2 = new Backendless.Messaging.DeliveryOptions({
        publishPolicy  : 'test-publishPolicy',
        pushBroadcast  : 'test-pushBroadcast',
        pushSinglecast : 'test-pushSinglecast',
        publishAt      : 'test-publishAt',
        repeatEvery    : 'test-repeatEvery',
        repeatExpiresAt: 'test-repeatExpiresAt',
        foo            : '111',
      })

      const deliveryOptions3 = {
        publishPolicy  : 'test-publishPolicy',
        pushBroadcast  : 'test-pushBroadcast',
        pushSinglecast : 'test-pushSinglecast',
        publishAt      : 'test-publishAt',
        repeatEvery    : 'test-repeatEvery',
        repeatExpiresAt: 'test-repeatExpiresAt',
        foo            : '222',
      }

      const result1 = await channel.publish(message, null, deliveryOptions1)
      const result2 = await channel.publish(message, null, deliveryOptions2)
      const result3 = await channel.publish(message, null, deliveryOptions3)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/messaging/${channelName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          message,
        }
      })

      expect(req2).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/messaging/${channelName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          message,
          publishPolicy  : 'test-publishPolicy',
          pushBroadcast  : 'test-pushBroadcast',
          pushSinglecast : 'test-pushSinglecast',
          publishAt      : 'test-publishAt',
          repeatEvery    : 'test-repeatEvery',
          repeatExpiresAt: 'test-repeatExpiresAt',
        }
      })

      expect(req3).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/messaging/${channelName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          message,
          publishPolicy  : 'test-publishPolicy',
          pushBroadcast  : 'test-pushBroadcast',
          pushSinglecast : 'test-pushSinglecast',
          publishAt      : 'test-publishAt',
          repeatEvery    : 'test-repeatEvery',
          repeatExpiresAt: 'test-repeatExpiresAt',
          foo            : '222',
        }
      })

      expect(result1).to.be.eql({ fakeResult })
      expect(result2).to.be.eql({ fakeResult })
      expect(result3).to.be.eql({ fakeResult })
    })

    it('publishes a basic message with publishOptions and deliveryOptions', async () => {
      const req1 = prepareMockRequest({ fakeResult })

      const publishOptions1 = {
        publisherId: 'test-publisherId',
        headers    : 'test-headers',
        subtopic   : 'test-subtopic',
        foo        : '333',
      }

      const deliveryOptions1 = {
        publishPolicy  : 'test-publishPolicy',
        pushBroadcast  : 'test-pushBroadcast',
        pushSinglecast : 'test-pushSinglecast',
        publishAt      : 'test-publishAt',
        repeatEvery    : 'test-repeatEvery',
        repeatExpiresAt: 'test-repeatExpiresAt',
        bar            : '333',
      }

      const result1 = await channel.publish(message, publishOptions1, deliveryOptions1)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/messaging/${channelName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          message,
          publishPolicy  : 'test-publishPolicy',
          pushBroadcast  : 'test-pushBroadcast',
          pushSinglecast : 'test-pushSinglecast',
          publishAt      : 'test-publishAt',
          repeatEvery    : 'test-repeatEvery',
          repeatExpiresAt: 'test-repeatExpiresAt',
          publisherId    : 'test-publisherId',
          headers        : 'test-headers',
          subtopic       : 'test-subtopic',
          foo            : '333',
          bar            : '333',
        }
      })

      expect(result1).to.be.eql({ fakeResult })
    })

    it('publishes a non string message', async () => {
      const req1 = prepareMockRequest({ fakeResult })
      const req2 = prepareMockRequest({ fakeResult })
      const req3 = prepareMockRequest({ fakeResult })

      const result1 = await channel.publish(true)
      const result2 = await channel.publish({ foo: '123' })
      const result3 = await channel.publish([{ bar: 'str' }])

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/messaging/${channelName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          message: true,
        }
      })

      expect(req2).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/messaging/${channelName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          message: { foo: '123' },
        }
      })

      expect(req3).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/messaging/${channelName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          message: [{ bar: 'str' }],
        }
      })

      expect(result1).to.be.eql({ fakeResult })
      expect(result2).to.be.eql({ fakeResult })
      expect(result3).to.be.eql({ fakeResult })
    })

    it('fails when channelName is invalid', async () => {
      const errorMsg = 'Channel Name must be provided and must be a string.'

      expect(() => Backendless.Messaging.subscribe()).to.throw(errorMsg)
      expect(() => Backendless.Messaging.subscribe(undefined)).to.throw(errorMsg)
      expect(() => Backendless.Messaging.subscribe(null)).to.throw(errorMsg)
      expect(() => Backendless.Messaging.subscribe(true)).to.throw(errorMsg)
      expect(() => Backendless.Messaging.subscribe(false)).to.throw(errorMsg)
      expect(() => Backendless.Messaging.subscribe(0)).to.throw(errorMsg)
      expect(() => Backendless.Messaging.subscribe(123)).to.throw(errorMsg)
      expect(() => Backendless.Messaging.subscribe('')).to.throw(errorMsg)
      expect(() => Backendless.Messaging.subscribe({})).to.throw(errorMsg)
      expect(() => Backendless.Messaging.subscribe([])).to.throw(errorMsg)
      expect(() => Backendless.Messaging.subscribe(() => ({}))).to.throw(errorMsg)
    })

    it('fails when channelName has a slash char', async () => {
      const errorMsg = 'Channel Name can not contain slash chars'

      expect(() => Backendless.Messaging.subscribe('/channelName')).to.throw(errorMsg)
      expect(() => Backendless.Messaging.subscribe('channel/Name')).to.throw(errorMsg)
      expect(() => Backendless.Messaging.subscribe('channelName/')).to.throw(errorMsg)
    })

    it('ignores publishOptions when it is invalid', async () => {
      const check = async publishOptions => {
        const req1 = prepareMockRequest({ fakeResult })

        const result1 = await channel.publish(message, publishOptions)

        expect(req1).to.deep.include({
          method : 'POST',
          path   : `${APP_PATH}/messaging/${channelName}`,
          headers: { 'Content-Type': 'application/json' },
          body   : {
            message,
          }
        })

        expect(result1).to.be.eql({ fakeResult })
      }

      await check(undefined)
      await check(null)
      await check(false)
      await check('')
      await check(0)
    })

    it('ignores deliveryOptions when it is invalid', async () => {
      const check = async deliveryOptions => {
        const req1 = prepareMockRequest({ fakeResult })

        const result1 = await channel.publish(message, null, deliveryOptions)

        expect(req1).to.deep.include({
          method : 'POST',
          path   : `${APP_PATH}/messaging/${channelName}`,
          headers: { 'Content-Type': 'application/json' },
          body   : {
            message,
          }
        })

        expect(result1).to.be.eql({ fakeResult })
      }

      await check(undefined)
      await check(null)
      await check(false)
      await check('')
      await check(0)
    })

    it('fails when publishOptions is invalid', async () => {
      const errorMsg = '"publishOptions" argument must be an object.'

      await expect(channel.publish(message, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(channel.publish(message, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(channel.publish(message, 'str')).to.eventually.be.rejectedWith(errorMsg)
      await expect(channel.publish(message, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(channel.publish(message, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when deliveryOptions is invalid', async () => {
      const errorMsg = '"deliveryOptions" argument must be an object.'

      await expect(channel.publish(message, null, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(channel.publish(message, null, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(channel.publish(message, null, 'str')).to.eventually.be.rejectedWith(errorMsg)
      await expect(channel.publish(message, null, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(channel.publish(message, null, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

  })

  describe('Delete', () => {
    it('deletes the specified channel', async () => {
      const req1 = prepareMockRequest()

      await Backendless.Messaging.deleteChannel(channelName)

      expect(req1).to.deep.include({
        method: 'DELETE',
        path: `${APP_PATH}/messaging/channels/${channelName}`,
      })
    })

    it('fails when channelName is invalid', async () => {
      const errorMsg = 'Channel Name must be provided and must be a string.'

      await expect( Backendless.Messaging.deleteChannel()).to.eventually.be.rejectedWith(errorMsg)
      await expect( Backendless.Messaging.deleteChannel(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect( Backendless.Messaging.deleteChannel(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect( Backendless.Messaging.deleteChannel(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect( Backendless.Messaging.deleteChannel(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect( Backendless.Messaging.deleteChannel(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect( Backendless.Messaging.deleteChannel(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect( Backendless.Messaging.deleteChannel('')).to.eventually.be.rejectedWith(errorMsg)
      await expect( Backendless.Messaging.deleteChannel({})).to.eventually.be.rejectedWith(errorMsg)
      await expect( Backendless.Messaging.deleteChannel([])).to.eventually.be.rejectedWith(errorMsg)
      await expect( Backendless.Messaging.deleteChannel(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when channelName has a slash char', async () => {
      const errorMsg = 'Channel Name can not contain slash chars'

      await expect(Backendless.Messaging.deleteChannel('/channelName')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.deleteChannel('channel/Name')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.deleteChannel('channelName/')).to.eventually.be.rejectedWith(errorMsg)
    })
  })

  describe('Connection', () => {
    it('can join and leave the channel', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // PUB_SUB_CONNECT
      const sub2Promise = rtClient.getNext_SUB_ON() // PUB_SUB_CONNECT

      expect(channel.isJoined()).to.be.equal(false)
      expect(channel.isConnected()).to.be.equal(false)

      const sub1 = await sub1Promise

      rtClient.subReady(sub1.id)

      await Utils.wait(100)

      expect(channel.isJoined()).to.be.equal(true)
      expect(channel.isConnected()).to.be.equal(true)

      channel.leave()

      await Utils.wait(100)

      expect(channel.isJoined()).to.be.equal(false)
      expect(channel.isConnected()).to.be.equal(false)

      channel.join()

      const sub3 = await sub2Promise

      rtClient.subReady(sub3.id)

      await Utils.wait(100)

      expect(channel.isJoined()).to.be.equal(true)
      expect(channel.isConnected()).to.be.equal(true)
    })

    it('adds connect listener', async () => {
      const sub1 = await rtClient.getNext_SUB_ON() // PUB_SUB_CONNECT

      const callbackPromise = new Promise(resolve => {
        channel.addConnectListener(resolve)
      })

      rtClient.subReady(sub1.id)

      const result = await callbackPromise

      expect(result).to.be.equal(undefined)
    })

    it('removes connect listener', async () => {
      const callback = () => ({})

      channel.addConnectListener(callback)
      channel.removeConnectListeners(callback)
    })

  })

  describe('Messages', () => {
    afterEach(async () => {
      await Utils.wait(100)

      const unprocessedEvents = rtClient.getUnprocessedEvents()

      expect(unprocessedEvents).to.be.eql([])
    })

    it('adds simple listener', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON()
      const sub2Promise = rtClient.getNext_SUB_ON()

      const newMessagePromise = new Promise(resolve => {
        channel.addMessageListener(message => {
          resolve(message)
        })
      })

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('PUB_SUB_CONNECT')
      expect(sub1.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME' })

      rtClient.subReady(sub1.id)

      const sub2 = await sub2Promise

      expect(sub2.id).to.be.a('string')
      expect(sub2.name).to.be.equal('PUB_SUB_MESSAGES')
      expect(sub2.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME' })

      rtClient.subRes(sub2.id, { message: 'test', foo: 123 })

      const newMessage = await newMessagePromise

      expect(newMessage).to.be.eql({ message: 'test', foo: 123 })
    })

    it('adds listener with condition', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON()
      const sub2Promise = rtClient.getNext_SUB_ON()

      const newMessagePromise = new Promise(resolve => {
        channel.addMessageListener('foo=123 & age>35', message => {
          resolve(message)
        })
      })

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('PUB_SUB_CONNECT')
      expect(sub1.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME' })

      rtClient.subReady(sub1.id)

      const sub2 = await sub2Promise

      expect(sub2.id).to.be.a('string')
      expect(sub2.name).to.be.equal('PUB_SUB_MESSAGES')
      expect(sub2.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME', selector: 'foo=123 & age>35' })

      rtClient.subRes(sub2.id, { message: 'test', foo: 123 })

      const newMessage = await newMessagePromise

      expect(newMessage).to.be.eql({ message: 'test', foo: 123 })
    })

    it('adds several listeners', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON()
      const sub2Promise = rtClient.getNext_SUB_ON()
      const sub3Promise = rtClient.getNext_SUB_ON()

      const newMessage1Promise = new Promise(resolve => {
        channel.addMessageListener(message => {
          resolve(message)
        })
      })

      const newMessage2Promise = new Promise(resolve => {
        channel.addMessageListener(message => {
          resolve(message)
        })
      })

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('PUB_SUB_CONNECT')
      expect(sub1.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME' })

      rtClient.subReady(sub1.id)

      const sub2 = await sub2Promise

      expect(sub2.id).to.be.a('string')
      expect(sub2.name).to.be.equal('PUB_SUB_MESSAGES')
      expect(sub2.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME' })

      const sub3 = await sub3Promise

      expect(sub3.id).to.be.a('string')
      expect(sub3.name).to.be.equal('PUB_SUB_MESSAGES')
      expect(sub3.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME' })

      rtClient.subRes(sub2.id, { message: 'test-1', foo: 111 })
      rtClient.subRes(sub3.id, { message: 'test-2', foo: 222 })

      const newMessage1 = await newMessage1Promise
      const newMessage2 = await newMessage2Promise

      expect(newMessage1).to.be.eql({ message: 'test-1', foo: 111 })
      expect(newMessage2).to.be.eql({ message: 'test-2', foo: 222 })
    })

    it('removes listeners', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // PUB_SUB_CONNECT
      const sub2Promise = rtClient.getNext_SUB_ON() // PUB_SUB_MESSAGES
      const sub3Promise = rtClient.getNext_SUB_ON() // PUB_SUB_MESSAGES
      const sub4Promise = rtClient.getNext_SUB_OFF() // PUB_SUB_MESSAGES
      const sub5Promise = rtClient.getNext_SUB_OFF() // PUB_SUB_MESSAGES

      const callback1 = () => ({})
      const callback2 = () => ({})

      channel.addMessageListener(callback1)
      channel.addMessageListener(callback2)

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('PUB_SUB_CONNECT')
      expect(sub1.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME' })

      rtClient.subReady(sub1.id)

      const sub2 = await sub2Promise

      expect(sub2.id).to.be.a('string')
      expect(sub2.name).to.be.equal('PUB_SUB_MESSAGES')
      expect(sub2.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME' })

      const sub3 = await sub3Promise

      expect(sub3.id).to.be.a('string')
      expect(sub3.name).to.be.equal('PUB_SUB_MESSAGES')
      expect(sub3.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME' })

      channel.removeMessageListener(callback1)
      channel.removeMessageListener(callback2)

      const sub4 = await sub4Promise
      const sub5 = await sub5Promise

      expect(sub4.id).to.be.equal(sub2.id)
      expect(sub5.id).to.be.equal(sub3.id)
    })

    it('removes listeners with conditions', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // PUB_SUB_CONNECT
      const sub2Promise = rtClient.getNext_SUB_ON() // PUB_SUB_MESSAGES
      const sub3Promise = rtClient.getNext_SUB_ON() // PUB_SUB_MESSAGES
      const sub4Promise = rtClient.getNext_SUB_ON() // PUB_SUB_MESSAGES
      const sub5Promise = rtClient.getNext_SUB_OFF() // PUB_SUB_MESSAGES
      const sub6Promise = rtClient.getNext_SUB_OFF() // PUB_SUB_MESSAGES

      const callback1 = () => ({})
      const callback2 = () => ({})

      channel.addMessageListener(callback1)
      channel.addMessageListener('foo=1', callback1)
      channel.addMessageListener('foo=2', callback2)

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('PUB_SUB_CONNECT')
      expect(sub1.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME' })

      rtClient.subReady(sub1.id)

      const sub2 = await sub2Promise

      expect(sub2.id).to.be.a('string')
      expect(sub2.name).to.be.equal('PUB_SUB_MESSAGES')
      expect(sub2.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME' })

      const sub3 = await sub3Promise

      expect(sub3.id).to.be.a('string')
      expect(sub3.name).to.be.equal('PUB_SUB_MESSAGES')
      expect(sub3.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME', selector: 'foo=1' })

      const sub4 = await sub4Promise

      expect(sub4.id).to.be.a('string')
      expect(sub4.name).to.be.equal('PUB_SUB_MESSAGES')
      expect(sub4.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME', selector: 'foo=2' })

      channel.removeMessageListener('foo=1', callback1)
      channel.removeMessageListener('foo=2', callback2)

      const sub5 = await sub5Promise
      const sub6 = await sub6Promise

      expect(sub5.id).to.be.equal(sub3.id)
      expect(sub6.id).to.be.equal(sub4.id)
    })

    it('removes listeners by select', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // PUB_SUB_CONNECT
      const sub2Promise = rtClient.getNext_SUB_ON() // PUB_SUB_MESSAGES
      const sub3Promise = rtClient.getNext_SUB_ON() // PUB_SUB_MESSAGES
      const sub4Promise = rtClient.getNext_SUB_ON() // PUB_SUB_MESSAGES
      const sub5Promise = rtClient.getNext_SUB_OFF() // PUB_SUB_MESSAGES
      const sub6Promise = rtClient.getNext_SUB_OFF() // PUB_SUB_MESSAGES

      const callback1 = () => ({})
      const callback2 = () => ({})

      channel.addMessageListener('foo=1', callback1)
      channel.addMessageListener('foo=2', callback1)
      channel.addMessageListener('foo=2', callback2)

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('PUB_SUB_CONNECT')
      expect(sub1.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME' })

      rtClient.subReady(sub1.id)

      const sub2 = await sub2Promise

      expect(sub2.id).to.be.a('string')
      expect(sub2.name).to.be.equal('PUB_SUB_MESSAGES')
      expect(sub2.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME', selector: 'foo=1' })

      const sub3 = await sub3Promise

      expect(sub3.id).to.be.a('string')
      expect(sub3.name).to.be.equal('PUB_SUB_MESSAGES')
      expect(sub3.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME', selector: 'foo=2' })

      const sub4 = await sub4Promise

      expect(sub4.id).to.be.a('string')
      expect(sub4.name).to.be.equal('PUB_SUB_MESSAGES')
      expect(sub4.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME', selector: 'foo=2' })

      channel.removeMessageListeners('foo=2')

      const sub5 = await sub5Promise
      const sub6 = await sub6Promise

      expect(sub5.id).to.be.equal(sub3.id)
      expect(sub6.id).to.be.equal(sub4.id)
    })

    it('removes all listeners', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // PUB_SUB_CONNECT
      const sub2Promise = rtClient.getNext_SUB_ON() // PUB_SUB_MESSAGES
      const sub3Promise = rtClient.getNext_SUB_ON() // PUB_SUB_MESSAGES
      const sub4Promise = rtClient.getNext_SUB_ON() // PUB_SUB_MESSAGES
      const sub5Promise = rtClient.getNext_SUB_OFF() // PUB_SUB_MESSAGES
      const sub6Promise = rtClient.getNext_SUB_OFF() // PUB_SUB_MESSAGES
      const sub7Promise = rtClient.getNext_SUB_OFF() // PUB_SUB_MESSAGES

      const callback1 = () => ({})
      const callback2 = () => ({})

      channel.addMessageListener(callback1)
      channel.addMessageListener('foo=1', callback1)
      channel.addMessageListener('foo=2', callback2)

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('PUB_SUB_CONNECT')
      expect(sub1.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME' })

      rtClient.subReady(sub1.id)

      const sub2 = await sub2Promise

      expect(sub2.id).to.be.a('string')
      expect(sub2.name).to.be.equal('PUB_SUB_MESSAGES')
      expect(sub2.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME' })

      const sub3 = await sub3Promise

      expect(sub3.id).to.be.a('string')
      expect(sub3.name).to.be.equal('PUB_SUB_MESSAGES')
      expect(sub3.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME', selector: 'foo=1' })

      const sub4 = await sub4Promise

      expect(sub4.id).to.be.a('string')
      expect(sub4.name).to.be.equal('PUB_SUB_MESSAGES')
      expect(sub4.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME', selector: 'foo=2' })

      channel.removeAllMessageListeners()

      const sub5 = await sub5Promise
      const sub6 = await sub6Promise
      const sub7 = await sub7Promise

      expect(sub5.id).to.be.equal(sub2.id)
      expect(sub6.id).to.be.equal(sub3.id)
      expect(sub7.id).to.be.equal(sub4.id)
    })

    it('fails when selector is invalid', async () => {
      await rtClient.getNext_SUB_ON() // PUB_SUB_CONNECT

      const errorMsg = 'Selector must be a string.'

      expect(() => channel.removeMessageListener(true)).to.throw(errorMsg)
      expect(() => channel.removeMessageListener(123)).to.throw(errorMsg)
      expect(() => channel.removeMessageListener({})).to.throw(errorMsg)
      expect(() => channel.removeMessageListener([])).to.throw(errorMsg)

      expect(() => channel.removeMessageListeners(true)).to.throw(errorMsg)
      expect(() => channel.removeMessageListeners(123)).to.throw(errorMsg)
      expect(() => channel.removeMessageListeners({})).to.throw(errorMsg)
      expect(() => channel.removeMessageListeners([])).to.throw(errorMsg)
    })

    it('fails when callback is invalid', async () => {
      await rtClient.getNext_SUB_ON() // PUB_SUB_CONNECT

      const errorMsg = 'Callback must be a function.'

      expect(() => channel.removeMessageListener()).to.throw(errorMsg)
      expect(() => channel.removeMessageListener(undefined)).to.throw(errorMsg)
      expect(() => channel.removeMessageListener(null)).to.throw(errorMsg)
      expect(() => channel.removeMessageListener(false)).to.throw(errorMsg)
      expect(() => channel.removeMessageListener(0)).to.throw(errorMsg)
      expect(() => channel.removeMessageListener('')).to.throw(errorMsg)

      expect(() => channel.removeMessageListener('foo=1')).to.throw(errorMsg)
      expect(() => channel.removeMessageListener('foo=1', undefined)).to.throw(errorMsg)
      expect(() => channel.removeMessageListener('foo=1', null)).to.throw(errorMsg)
      expect(() => channel.removeMessageListener('foo=1', true)).to.throw(errorMsg)
      expect(() => channel.removeMessageListener('foo=1', false)).to.throw(errorMsg)
      expect(() => channel.removeMessageListener('foo=1', 0)).to.throw(errorMsg)
      expect(() => channel.removeMessageListener('foo=1', 123)).to.throw(errorMsg)
      expect(() => channel.removeMessageListener('foo=1', '')).to.throw(errorMsg)
      expect(() => channel.removeMessageListener('foo=1', {})).to.throw(errorMsg)
      expect(() => channel.removeMessageListener('foo=1', [])).to.throw(errorMsg)
    })
  })

  describe('UserStatus', () => {
    it('adds simple listener', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // PUB_SUB_CONNECT
      const sub2Promise = rtClient.getNext_SUB_ON() // PUB_SUB_USERS

      const userStatusPromise = new Promise(resolve => {
        channel.addUserStatusListener(userStatus => {
          resolve(userStatus)
        })
      })

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('PUB_SUB_CONNECT')
      expect(sub1.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME' })

      rtClient.subReady(sub1.id)

      const sub2 = await sub2Promise

      expect(sub2.id).to.be.a('string')
      expect(sub2.name).to.be.equal('PUB_SUB_USERS')
      expect(sub2.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME' })

      rtClient.subRes(sub2.id, { message: 'test', foo: 123 })

      const userStatus = await userStatusPromise

      expect(userStatus).to.be.eql({ message: 'test', foo: 123 })
    })

    it('removes simple listener', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // PUB_SUB_CONNECT
      const sub2Promise = rtClient.getNext_SUB_ON() // PUB_SUB_USERS
      const sub3Promise = rtClient.getNext_SUB_ON() // PUB_SUB_USERS
      const subOff1Promise = rtClient.getNext_SUB_OFF() // PUB_SUB_USERS
      const subOff2Promise = rtClient.getNext_SUB_OFF() // PUB_SUB_USERS

      const callback1 = () => ({})
      const callback2 = () => ({})

      channel.addUserStatusListener(callback1)
      channel.addUserStatusListener(callback2)

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('PUB_SUB_CONNECT')
      expect(sub1.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME' })

      rtClient.subReady(sub1.id)

      const sub2 = await sub2Promise

      expect(sub2.id).to.be.a('string')
      expect(sub2.name).to.be.equal('PUB_SUB_USERS')
      expect(sub2.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME' })

      const sub3 = await sub3Promise

      expect(sub3.id).to.be.a('string')
      expect(sub3.name).to.be.equal('PUB_SUB_USERS')
      expect(sub3.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME' })

      channel.removeUserStatusListeners(callback1)
      channel.removeUserStatusListeners(callback2)

      const subOff1 = await subOff1Promise
      const subOff2 = await subOff2Promise

      expect(sub2.id).to.be.equal(subOff1.id)
      expect(sub3.id).to.be.equal(subOff2.id)
    })
  })

  describe('Commands', () => {
    it('adds simple listener', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // PUB_SUB_CONNECT
      const sub2Promise = rtClient.getNext_SUB_ON() // PUB_SUB_COMMANDS

      const commandPromise = new Promise(resolve => {
        channel.addCommandListener(userStatus => {
          resolve(userStatus)
        })
      })

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('PUB_SUB_CONNECT')
      expect(sub1.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME' })

      rtClient.subReady(sub1.id)

      const sub2 = await sub2Promise

      expect(sub2.id).to.be.a('string')
      expect(sub2.name).to.be.equal('PUB_SUB_COMMANDS')
      expect(sub2.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME' })

      rtClient.subRes(sub2.id, { message: 'test', foo: 123 })

      const command = await commandPromise

      expect(command).to.be.eql({ message: 'test', foo: 123 })
    })

    it('removes simple listener', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // PUB_SUB_CONNECT
      const sub2Promise = rtClient.getNext_SUB_ON() // PUB_SUB_COMMANDS
      const sub3Promise = rtClient.getNext_SUB_ON() // PUB_SUB_COMMANDS
      const subOff1Promise = rtClient.getNext_SUB_OFF() // PUB_SUB_COMMANDS
      const subOff2Promise = rtClient.getNext_SUB_OFF() // PUB_SUB_COMMANDS

      const callback1 = () => ({})
      const callback2 = () => ({})

      channel.addCommandListener(callback1)
      channel.addCommandListener(callback2)

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('PUB_SUB_CONNECT')
      expect(sub1.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME' })

      rtClient.subReady(sub1.id)

      const sub2 = await sub2Promise

      expect(sub2.id).to.be.a('string')
      expect(sub2.name).to.be.equal('PUB_SUB_COMMANDS')
      expect(sub2.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME' })

      const sub3 = await sub3Promise

      expect(sub3.id).to.be.a('string')
      expect(sub3.name).to.be.equal('PUB_SUB_COMMANDS')
      expect(sub3.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME' })

      channel.removeCommandListener(callback1)
      channel.removeCommandListener(callback2)

      const subOff1 = await subOff1Promise
      const subOff2 = await subOff2Promise

      expect(sub2.id).to.be.equal(subOff1.id)
      expect(sub3.id).to.be.equal(subOff2.id)

    })

    it('removes all simple listeners', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // PUB_SUB_CONNECT
      const sub2Promise = rtClient.getNext_SUB_ON() // PUB_SUB_COMMANDS
      const sub3Promise = rtClient.getNext_SUB_ON() // PUB_SUB_COMMANDS
      const subOff1Promise = rtClient.getNext_SUB_OFF() // PUB_SUB_COMMANDS
      const subOff2Promise = rtClient.getNext_SUB_OFF() // PUB_SUB_COMMANDS

      const callback1 = () => ({})
      const callback2 = () => ({})

      channel.addCommandListener(callback1)
      channel.addCommandListener(callback2)

      const sub1 = await sub1Promise

      expect(sub1.id).to.be.a('string')
      expect(sub1.name).to.be.equal('PUB_SUB_CONNECT')
      expect(sub1.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME' })

      rtClient.subReady(sub1.id)

      const sub2 = await sub2Promise

      expect(sub2.id).to.be.a('string')
      expect(sub2.name).to.be.equal('PUB_SUB_COMMANDS')
      expect(sub2.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME' })

      const sub3 = await sub3Promise

      expect(sub3.id).to.be.a('string')
      expect(sub3.name).to.be.equal('PUB_SUB_COMMANDS')
      expect(sub3.options).to.be.eql({ channel: 'TEST_CHANNEL_NAME' })

      channel.removeCommandListeners()

      const subOff1 = await subOff1Promise
      const subOff2 = await subOff2Promise

      expect(sub2.id).to.be.equal(subOff1.id)
      expect(sub3.id).to.be.equal(subOff2.id)
    })

    it('sends command', async () => {
      const sub1Promise = rtClient.getNext_SUB_ON() // PUB_SUB_CONNECT

      const met1Promise = rtClient.getNext_MET_REQ() // PUB_SUB_COMMANDS

      const sendCommandPromise = channel.send('TEST-COMMAND', { foo: 123, bar: 'str' })

      const sub1 = await sub1Promise

      rtClient.subReady(sub1.id)

      const met1 = await met1Promise

      expect(met1.id).to.be.a('string')
      expect(met1.name).to.be.equal('PUB_SUB_COMMAND')
      expect(met1.options).to.be.eql({
        channel: 'TEST_CHANNEL_NAME',
        type   : 'TEST-COMMAND',
        data   : { foo: 123, bar: 'str' }
      })

      rtClient.metRes(met1.id, { restResult: 'foo', bar: 123 })

      const sendCommand = await sendCommandPromise

      expect(sendCommand).to.be.eql({ restResult: 'foo', bar: 123 })
    })
  })

  it('removes all listeners', async () => {
    const con1 = await rtClient.getNext_SUB_ON() // PUB_SUB_CONNECT

    rtClient.subReady(con1.id)

    const sub1Promise = rtClient.getNext_SUB_ON() // PUB_SUB_MESSAGES
    const sub2Promise = rtClient.getNext_SUB_ON() // PUB_SUB_MESSAGES
    const sub3Promise = rtClient.getNext_SUB_ON() // PUB_SUB_MESSAGES
    const sub4Promise = rtClient.getNext_SUB_ON() // PUB_SUB_MESSAGES
    const sub5Promise = rtClient.getNext_SUB_ON() // PUB_SUB_COMMANDS
    const sub6Promise = rtClient.getNext_SUB_ON() // PUB_SUB_USERS

    const subOff1Promise = rtClient.getNext_SUB_OFF() // PUB_SUB_MESSAGES
    const subOff2Promise = rtClient.getNext_SUB_OFF() // PUB_SUB_MESSAGES
    const subOff3Promise = rtClient.getNext_SUB_OFF() // PUB_SUB_MESSAGES
    const subOff4Promise = rtClient.getNext_SUB_OFF() // PUB_SUB_MESSAGES
    const subOff5Promise = rtClient.getNext_SUB_OFF() // PUB_SUB_COMMANDS
    const subOff6Promise = rtClient.getNext_SUB_OFF() // PUB_SUB_USERS

    const callback1 = () => ({})
    const callback2 = () => ({})

    channel.addMessageListener(callback1)
    channel.addMessageListener(callback2)
    channel.addMessageListener('foo=1', callback1)
    channel.addMessageListener('foo=1', callback2)

    channel.addCommandListener(callback1)
    channel.addUserStatusListener(callback1)

    const sub1 = await sub1Promise
    const sub2 = await sub2Promise
    const sub3 = await sub3Promise
    const sub4 = await sub4Promise
    const sub5 = await sub5Promise
    const sub6 = await sub6Promise

    expect(sub1.name).to.be.equal('PUB_SUB_MESSAGES')
    expect(sub2.name).to.be.equal('PUB_SUB_MESSAGES')
    expect(sub3.name).to.be.equal('PUB_SUB_MESSAGES')
    expect(sub4.name).to.be.equal('PUB_SUB_MESSAGES')
    expect(sub5.name).to.be.equal('PUB_SUB_COMMANDS')
    expect(sub6.name).to.be.equal('PUB_SUB_USERS')

    channel.removeAllListeners()

    const subOff1 = await subOff1Promise
    const subOff2 = await subOff2Promise
    const subOff3 = await subOff3Promise
    const subOff4 = await subOff4Promise
    const subOff5 = await subOff5Promise
    const subOff6 = await subOff6Promise

    expect(sub1.id).to.be.equal(subOff1.id)
    expect(sub2.id).to.be.equal(subOff2.id)
    expect(sub3.id).to.be.equal(subOff3.id)
    expect(sub4.id).to.be.equal(subOff4.id)
    expect(sub5.id).to.be.equal(subOff5.id)
    expect(sub6.id).to.be.equal(subOff6.id)

  })

})
