import '../../helpers/global'
import sandbox from '../../helpers/sandbox'
import * as Utils from '../../helpers/utils'
import { runRTHandler, TIMEOUT_ERROR, beforeHook, afterHook } from '../../helpers/rt'

const Backendless = sandbox.Backendless

describe('RT - Messaging', function() {

  let testCaseMarker

  sandbox.forSuite()

  beforeEach(async function() {
    testCaseMarker = Utils.uidShort()

    await beforeHook(Backendless)
  })

  afterEach(async function() {
    await afterHook(Backendless)
  })

  const createChannel = (channelName = 'default') => {
    return new Promise((resolve, reject) => {
      const channel = Backendless.Messaging.subscribe(channelName)

      channel.addConnectListener(() => resolve(channel), reject)
    })
  }

  describe('Messages', function() {
    it('default channel', async () => {
      const rtChannel = await createChannel()

      const rtHandler = await runRTHandler(({ callback, onError }) => {
        rtChannel.addMessageListener(callback, onError)
      })

      await rtChannel.publish('test message')

      const rtMessage = await rtHandler.next()

      try {
        await rtHandler.next()
      } catch (e) {
        expect(e.message).to.be.equal(TIMEOUT_ERROR)
      }

      expect(rtHandler.results).to.have.length(1)

      expect(rtMessage.messageId).to.be.a('string')
      expect(rtMessage.timestamp).to.be.a('number')
      expect(rtMessage.message).to.be.equal('test message')
      expect(rtMessage.publisherId).to.be.equal(null)
      expect(rtMessage.subtopic).to.be.equal(null)
      expect(rtMessage.pushSinglecast).to.be.equal(null)
      expect(rtMessage.pushBroadcast).to.be.equal(null)
      expect(rtMessage.publishPolicy).to.be.equal(null)
      expect(rtMessage.templateValues).to.be.equal(null)
      expect(rtMessage.query).to.be.equal(null)
      expect(rtMessage.publishAt).to.be.equal(0)
      expect(rtMessage.repeatEvery).to.be.equal(0)
      expect(rtMessage.repeatExpiresAt).to.be.equal(0)
      expect(rtMessage.headers).to.be.an('object')
    })

    it('new channel', async () => {
      const rtChannel = await createChannel('new_channel')

      const rtHandler = await runRTHandler(({ callback, onError }) => {
        rtChannel.addMessageListener(callback, onError)
      })

      await rtChannel.publish('test message')

      const rtMessage = await rtHandler.next()

      try {
        await rtHandler.next()
      } catch (e) {
        expect(e.message).to.be.equal(TIMEOUT_ERROR)
      }

      expect(rtHandler.results).to.have.length(1)

      expect(rtMessage.messageId).to.be.a('string')
      expect(rtMessage.timestamp).to.be.a('number')
      expect(rtMessage.message).to.be.equal('test message')
      expect(rtMessage.publisherId).to.be.equal(null)
      expect(rtMessage.subtopic).to.be.equal(null)
      expect(rtMessage.pushSinglecast).to.be.equal(null)
      expect(rtMessage.pushBroadcast).to.be.equal(null)
      expect(rtMessage.publishPolicy).to.be.equal(null)
      expect(rtMessage.templateValues).to.be.equal(null)
      expect(rtMessage.query).to.be.equal(null)
      expect(rtMessage.publishAt).to.be.equal(0)
      expect(rtMessage.repeatEvery).to.be.equal(0)
      expect(rtMessage.repeatExpiresAt).to.be.equal(0)
      expect(rtMessage.headers).to.be.an('object')
    })

    it('with selector', async () => {
      const rtChannel = await createChannel()

      const rtHandler = await runRTHandler(({ callback, onError }) => {
        rtChannel.addMessageListener('foo > 10', callback, onError)
      })

      await rtChannel.publish('test message 1', new Backendless.PublishOptions({ headers: { foo: 20 } }))
      await rtChannel.publish('test message 2', new Backendless.PublishOptions({ headers: { foo: 10 } }))
      await rtChannel.publish('test message 3', new Backendless.PublishOptions({ headers: { foo: 50 } }))
      await rtChannel.publish('test message 4', new Backendless.PublishOptions({ headers: { foo: 5 } }))
      await rtChannel.publish('test message 4', new Backendless.PublishOptions({ headers: {} }))
      await rtChannel.publish('test message 4', new Backendless.PublishOptions())

      await rtHandler.next()
      await rtHandler.next()

      try {
        await rtHandler.next()
      } catch (e) {
        expect(e.message).to.be.equal(TIMEOUT_ERROR)
      }

      expect(rtHandler.results).to.have.length(2)
      console.log(rtHandler.results)

      expect(rtHandler.results[0].message).to.be.equal('test message 1')
      expect(rtHandler.results[0].headers.foo).to.equal('20')

      expect(rtHandler.results[1].message).to.be.equal('test message 3')
      expect(rtHandler.results[1].headers.foo).to.equal('50')
    })
  })

})
