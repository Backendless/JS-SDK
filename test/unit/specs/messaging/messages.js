import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forSuite, prepareMockRequest, APP_PATH } from '../../helpers/sandbox'

describe('<Messaging> Messages', function() {

  forSuite(this)

  this.timeout(5000)

  const channelName = 'TEST_CHANNEL_NAME'
  const message = 'TEST_MESSAGE'
  const messageId = 'TEST_MESSAGE_ID'

  const fakeResult = { foo: 123 }

  describe('Subscribe', () => {
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

  })

  describe('Publish', () => {

    it('has all publish options headers', () => {
      expect(Backendless.Messaging.PublishOptionsHeaders.MESSAGE_TAG).to.be.equal('message')
      expect(Backendless.Messaging.PublishOptionsHeaders.IOS_ALERT_TAG).to.be.equal('ios-alert')
      expect(Backendless.Messaging.PublishOptionsHeaders.IOS_BADGE_TAG).to.be.equal('ios-badge')
      expect(Backendless.Messaging.PublishOptionsHeaders.IOS_SOUND_TAG).to.be.equal('ios-sound')
      expect(Backendless.Messaging.PublishOptionsHeaders.ANDROID_TICKER_TEXT_TAG).to.be.equal('android-ticker-text')
      expect(Backendless.Messaging.PublishOptionsHeaders.ANDROID_CONTENT_TITLE_TAG).to.be.equal('android-content-title')
      expect(Backendless.Messaging.PublishOptionsHeaders.ANDROID_CONTENT_TEXT_TAG).to.be.equal('android-content-text')
      expect(Backendless.Messaging.PublishOptionsHeaders.ANDROID_ACTION_TAG).to.be.equal('android-action')
      expect(Backendless.Messaging.PublishOptionsHeaders.WP_TYPE_TAG).to.be.equal('wp-type')
      expect(Backendless.Messaging.PublishOptionsHeaders.WP_TITLE_TAG).to.be.equal('wp-title')
      expect(Backendless.Messaging.PublishOptionsHeaders.WP_TOAST_SUBTITLE_TAG).to.be.equal('wp-subtitle')
      expect(Backendless.Messaging.PublishOptionsHeaders.WP_TOAST_PARAMETER_TAG).to.be.equal('wp-parameter')
      expect(Backendless.Messaging.PublishOptionsHeaders.WP_TILE_BACKGROUND_IMAGE).to.be.equal('wp-backgroundImage')
      expect(Backendless.Messaging.PublishOptionsHeaders.WP_TILE_COUNT).to.be.equal('wp-count')
      expect(Backendless.Messaging.PublishOptionsHeaders.WP_TILE_BACK_TITLE).to.be.equal('wp-backTitle')
      expect(Backendless.Messaging.PublishOptionsHeaders.WP_TILE_BACK_BACKGROUND_IMAGE).to.be.equal('wp-backImage')
      expect(Backendless.Messaging.PublishOptionsHeaders.WP_TILE_BACK_CONTENT).to.be.equal('wp-backContent')
      expect(Backendless.Messaging.PublishOptionsHeaders.WP_RAW_DATA).to.be.equal('wp-raw')
    })

    it('publishes a basic message', async () => {
      const req1 = prepareMockRequest({ fakeResult })

      const result1 = await Backendless.Messaging.publish(channelName, message)

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

      const result1 = await Backendless.Messaging.publish(channelName, { foo: 123, message })

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
      const req4 = prepareMockRequest({ fakeResult })

      const publishOptions1 = new Backendless.Messaging.PublishOptions({})

      const publishOptions2 = new Backendless.Messaging.PublishOptions({
        publisherId: 'test-publisherId',
        headers    : 'test-headers',
        subtopic   : 'test-subtopic',
        foo        : '111',
      })

      const publishOptions3 = new Backendless.Messaging.PublishOptions()
      publishOptions3.publisherId = 'test-publisherId'
      publishOptions3.headers = 'test-headers'
      publishOptions3.subtopic = 'test-subtopic'
      publishOptions3.foo = '222'

      const publishOptions4 = {
        publisherId: 'test-publisherId',
        headers    : 'test-headers',
        subtopic   : 'test-subtopic',
        foo        : '333',
      }

      const result1 = await Backendless.Messaging.publish(channelName, message, publishOptions1)
      const result2 = await Backendless.Messaging.publish(channelName, message, publishOptions2)
      const result3 = await Backendless.Messaging.publish(channelName, message, publishOptions3)
      const result4 = await Backendless.Messaging.publish(channelName, message, publishOptions4)

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

      expect(req4).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/messaging/${channelName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          message,
          publisherId: 'test-publisherId',
          headers    : 'test-headers',
          subtopic   : 'test-subtopic',
          foo        : '333',
        }
      })

      expect(result1).to.be.eql({ fakeResult })
      expect(result2).to.be.eql({ fakeResult })
      expect(result3).to.be.eql({ fakeResult })
      expect(result4).to.be.eql({ fakeResult })
    })

    it('publishes a basic message with deliveryOptions', async () => {
      const req1 = prepareMockRequest({ fakeResult })
      const req2 = prepareMockRequest({ fakeResult })
      const req3 = prepareMockRequest({ fakeResult })
      const req4 = prepareMockRequest({ fakeResult })

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

      const deliveryOptions3 = new Backendless.Messaging.DeliveryOptions()
      deliveryOptions3.publishPolicy = 'test-publishPolicy'
      deliveryOptions3.pushBroadcast = 'test-pushBroadcast'
      deliveryOptions3.pushSinglecast = 'test-pushSinglecast'
      deliveryOptions3.publishAt = 'test-publishAt'
      deliveryOptions3.repeatEvery = 'test-repeatEvery'
      deliveryOptions3.repeatExpiresAt = 'test-repeatExpiresAt'
      deliveryOptions3.foo = '222'

      const deliveryOptions4 = {
        publishPolicy  : 'test-publishPolicy',
        pushBroadcast  : 'test-pushBroadcast',
        pushSinglecast : 'test-pushSinglecast',
        publishAt      : 'test-publishAt',
        repeatEvery    : 'test-repeatEvery',
        repeatExpiresAt: 'test-repeatExpiresAt',
        foo            : '333',
      }

      const result1 = await Backendless.Messaging.publish(channelName, message, null, deliveryOptions1)
      const result2 = await Backendless.Messaging.publish(channelName, message, null, deliveryOptions2)
      const result3 = await Backendless.Messaging.publish(channelName, message, null, deliveryOptions3)
      const result4 = await Backendless.Messaging.publish(channelName, message, null, deliveryOptions4)

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

      expect(req4).to.deep.include({
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
          foo            : '333',
        }
      })

      expect(result1).to.be.eql({ fakeResult })
      expect(result2).to.be.eql({ fakeResult })
      expect(result3).to.be.eql({ fakeResult })
      expect(result4).to.be.eql({ fakeResult })
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

      const result1 = await Backendless.Messaging.publish(channelName, message, publishOptions1, deliveryOptions1)

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

      const result1 = await Backendless.Messaging.publish(channelName, true)
      const result2 = await Backendless.Messaging.publish(channelName, { foo: '123' })
      const result3 = await Backendless.Messaging.publish(channelName, [{ bar: 'str' }])

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

      await expect(Backendless.Messaging.publish()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.publish(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.publish(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.publish(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.publish(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.publish(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.publish(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.publish('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.publish({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.publish([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.publish(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when channelName has a slash char', async () => {
      const errorMsg = 'Channel Name can not contain slash chars'

      await expect(Backendless.Messaging.publish('/channelName')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.publish('channel/Name')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.publish('channelName/')).to.eventually.be.rejectedWith(errorMsg)
    })

    it('ignores publishOptions when it is invalid', async () => {
      const check = async publishOptions => {
        const req1 = prepareMockRequest({ fakeResult })

        const result1 = await Backendless.Messaging.publish(channelName, message, publishOptions)

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

        const result1 = await Backendless.Messaging.publish(channelName, message, null, deliveryOptions)

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

      await expect(Backendless.Messaging.publish(channelName, message, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.publish(channelName, message, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.publish(channelName, message, 'str')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.publish(channelName, message, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.publish(channelName, message, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when deliveryOptions is invalid', async () => {
      const errorMsg = '"deliveryOptions" argument must be an object.'

      await expect(Backendless.Messaging.publish(channelName, message, null, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.publish(channelName, message, null, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.publish(channelName, message, null, 'str')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.publish(channelName, message, null, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.publish(channelName, message, null, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

  })

  it('cancels message', async () => {
    const req1 = prepareMockRequest({ fakeResult })

    const result1 = await Backendless.Messaging.cancel(messageId)

    expect(req1).to.deep.include({
      method : 'DELETE',
      path   : `${APP_PATH}/messaging/${messageId}`,
      headers: {},
      body   : undefined
    })

    expect(result1).to.be.eql({ fakeResult })
  })

  it('gets message status', async () => {
    const req1 = prepareMockRequest({ fakeResult })

    const result1 = await Backendless.Messaging.getMessageStatus(messageId)

    expect(req1).to.deep.include({
      method : 'GET',
      path   : `${APP_PATH}/messaging/${messageId}`,
      headers: {},
      body   : undefined
    })

    expect(result1).to.be.eql({ fakeResult })
  })

  it('fails when messageId is invalid on getting Message Status', async () => {
    const errorMsg = 'Message ID must be provided and must be a string.'

    await expect(Backendless.Messaging.getMessageStatus()).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.getMessageStatus(undefined)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.getMessageStatus(null)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.getMessageStatus(true)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.getMessageStatus(false)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.getMessageStatus(0)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.getMessageStatus(123)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.getMessageStatus('')).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.getMessageStatus({})).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.getMessageStatus([])).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.getMessageStatus(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
  })

  it('fails when messageId is invalid on canceling Message', async () => {
    const errorMsg = 'Message ID must be provided and must be a string.'

    await expect(Backendless.Messaging.cancel()).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.cancel(undefined)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.cancel(null)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.cancel(true)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.cancel(false)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.cancel(0)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.cancel(123)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.cancel('')).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.cancel({})).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.cancel([])).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.cancel(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
  })

})
