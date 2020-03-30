import Utils from '../utils'

import Channel from './channel'

import {
  PublishOptionsHeaders,
  PublishOptions,
  DeliveryOptions,
  Bodyparts,
  SubscriptionOptions,
  EmailEnvelope
} from './helpers'

import Async from '../request/async'

export default class Messaging {
  constructor(app) {
    this.app = app

    this.Bodyparts = Bodyparts
    this.PublishOptions = PublishOptions
    this.DeliveryOptions = DeliveryOptions
    this.PublishOptionsHeaders = PublishOptionsHeaders
    this.EmailEnvelope = EmailEnvelope

    /** @deprecated */
    this.SubscriptionOptions = SubscriptionOptions
  }

  subscribe(channelName) {
    if (!channelName || typeof channelName !== 'string') {
      throw new Error('"channelName" must be non empty string')
    }

    if (channelName.indexOf('/') >= 0) {
      throw new Error('"channelName" can not contains slash chars')
    }

    return new Channel({ name: channelName.trim() }, this.app)
  }

  async publish(channelName, message, publishOptions, deliveryTarget, asyncHandler) {
    if (publishOptions instanceof Async) {
      asyncHandler = publishOptions
      publishOptions = undefined
      deliveryTarget = undefined
    }

    if (deliveryTarget instanceof Async) {
      asyncHandler = deliveryTarget
      deliveryTarget = undefined
    }

    const data = {
      message: message
    }

    if (publishOptions) {
      if (!(publishOptions instanceof PublishOptions)) {
        throw new Error('Use PublishOption as publishOptions argument')
      }

      Utils.deepExtend(data, publishOptions)
    }

    if (deliveryTarget) {
      if (!(deliveryTarget instanceof DeliveryOptions)) {
        throw new Error('Use DeliveryOptions as deliveryTarget argument')
      }

      Utils.deepExtend(data, deliveryTarget)
    }

    return this.app.request.post({
      url         : this.app.urls.messagingChannel(channelName),
      asyncHandler: asyncHandler,
      data        : data
    })
  }

  async pushWithTemplate(templateName, templateValues, asyncHandler) {
    if (templateValues instanceof Async) {
      asyncHandler = templateValues
      templateValues = undefined
    }

    if (!templateName || !Utils.isString(templateName)) {
      throw new Error('Push Template Name must be non empty string!')
    }

    const data = {}

    if (templateValues) {
      data.templateValues = templateValues
    }

    return this.app.request.post({
      url: this.app.urls.messagingPushWithTemplate(templateName),
      asyncHandler,
      data
    })
  }

  async sendEmail(subject, bodyParts, recipients, attachments/**, async */) {
    const responder = Utils.extractResponder(arguments)
    const data = {}

    if (subject && !Utils.isEmpty(subject) && Utils.isString(subject)) {
      data.subject = subject
    } else {
      throw new Error('Subject is required parameter and must be a nonempty string')
    }

    if ((bodyParts instanceof Bodyparts) && !Utils.isEmpty(bodyParts)) {
      data.bodyparts = bodyParts
    } else {
      throw new Error('Use Bodyparts as bodyParts argument, must contain at least one property')
    }

    if (recipients && Utils.isArray(recipients) && !Utils.isEmpty(recipients)) {
      data.to = recipients
    } else {
      throw new Error('Recipients is required parameter, must be a nonempty array')
    }

    if (attachments) {
      if (Utils.isArray(attachments)) {
        if (!Utils.isEmpty(attachments)) {
          data.attachment = attachments
        }
      }
    }

    function responseMessageStatus(res) {
      return res.status
    }

    return this.app.request.post({
      url         : this.app.urls.messagingEmail(),
      asyncHandler: Utils.wrapAsync(responder, responseMessageStatus),
      data        : data
    })
  }

  async sendEmailFromTemplate(templateName, envelopeObject, templateValues/**, async */) {
    const responder = Utils.extractResponder(arguments)

    if (typeof templateName !== 'string' || !templateName) {
      throw new Error('Template name is required and must be a string')
    }

    if (!(envelopeObject instanceof EmailEnvelope)) {
      throw new Error('EmailEnvelope is required and should be instance of Backendless.Messaging.EmailEnvelope')
    }

    const data = envelopeObject.toJSON()

    data['template-name'] = templateName

    if (templateValues) {
      data['template-values'] = templateValues
    }

    return this.app.request.post({
      url         : this.app.urls.emailTemplateSend(),
      asyncHandler: responder,
      data        : data
    })
  }

  async cancel(messageId, asyncHandler) {
    return this.app.request.delete({
      url         : this.app.urls.messagingMessage(messageId),
      asyncHandler: asyncHandler
    })
  }

  async registerDevice(deviceToken, channels, expiration, asyncHandler) {
    const device = this.app.device

    asyncHandler = Utils.extractResponder(arguments)

    const data = {
      deviceToken: deviceToken,
      deviceId   : device.uuid,
      os         : device.platform,
      osVersion  : device.version
    }

    if (Utils.isArray(channels)) {
      data.channels = channels
    }

    if (Utils.isNumber(expiration) || expiration instanceof Date) {
      data.expiration = (expiration instanceof Date)
        ? expiration.getTime() / 1000
        : expiration
    }

    return this.app.request.post({
      url         : this.app.urls.messagingRegistrations(),
      data        : data,
      asyncHandler: asyncHandler
    })
  }

  async getRegistrations(asyncHandler) {
    const device = this.app.device

    return this.app.request.get({
      url         : this.app.urls.messagingRegistrationDevice(device.uuid),
      asyncHandler: asyncHandler
    })
  }

  async unregisterDevice(asyncHandler) {
    const device = this.app.device

    return this.app.request.delete({
      url         : this.app.urls.messagingRegistrationDevice(device.uuid),
      asyncHandler: asyncHandler
    })
  }

  async getMessageStatus(messageId, asyncHandler) {
    if (!messageId) {
      throw Error('Message ID is required.')
    }

    return this.app.request.get({
      url         : this.app.urls.messagingMessage(messageId),
      asyncHandler: asyncHandler
    })
  }

  async getPushTemplates(deviceType, asyncHandler) {
    return this.app.request.get({
      url         : this.app.urls.messagingPushTemplates(deviceType),
      asyncHandler: asyncHandler
    })
  }

}
