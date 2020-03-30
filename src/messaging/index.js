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

    Utils.enableAsyncHandlers(this, [
      'publish',
      'pushWithTemplate',
      'sendEmail',
      'sendEmailFromTemplate',
      'cancel',
      'registerDevice',
      'getRegistrations',
      'unregisterDevice',
      'getMessageStatus',
      'getPushTemplates',
    ])
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

  async publish(channelName, message, publishOptions, deliveryTarget) {
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
      url : this.app.urls.messagingChannel(channelName),
      data: data
    })
  }

  async pushWithTemplate(templateName, templateValues) {
    if (!templateName || !Utils.isString(templateName)) {
      throw new Error('Push Template Name must be non empty string!')
    }

    const data = {}

    if (templateValues) {
      data.templateValues = templateValues
    }

    return this.app.request.post({
      url: this.app.urls.messagingPushWithTemplate(templateName),
      data
    })
  }

  async sendEmail(subject, bodyParts, recipients, attachments) {
    const data = {}

    if (subject && Utils.isString(subject)) {
      data.subject = subject
    } else {
      throw new Error('Subject is required parameter and must be a nonempty string')
    }

    if (bodyParts instanceof Bodyparts) {
      if (!bodyParts.textmessage && !bodyParts.htmlmessage) {
        throw new Error('Use Bodyparts as bodyParts argument, must contain at least one property')
      }

      data.bodyparts = bodyParts
    }

    if (Utils.isArray(recipients) && recipients.length) {
      data.to = recipients
    } else {
      throw new Error('Recipients is required parameter, must be a nonempty array')
    }

    if (Utils.isArray(attachments) && attachments.length) {
      data.attachment = attachments
    }

    return this.app.request.post({
      url   : this.app.urls.messagingEmail(),
      parser: data => data.status,
      data  : data
    })
  }

  async sendEmailFromTemplate(templateName, envelopeObject, templateValues) {
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
      url : this.app.urls.emailTemplateSend(),
      data: data
    })
  }

  async cancel(messageId) {
    return this.app.request.delete({
      url: this.app.urls.messagingMessage(messageId),
    })
  }

  async registerDevice(deviceToken, channels, expiration) {
    const device = this.app.device

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
      url : this.app.urls.messagingRegistrations(),
      data: data,
    })
  }

  async getRegistrations() {
    const device = this.app.device

    return this.app.request.get({
      url: this.app.urls.messagingRegistrationDevice(device.uuid),
    })
  }

  async unregisterDevice() {
    const device = this.app.device

    return this.app.request.delete({
      url: this.app.urls.messagingRegistrationDevice(device.uuid),
    })
  }

  async getMessageStatus(messageId) {
    if (!messageId) {
      throw Error('Message ID is required.')
    }

    return this.app.request.get({
      url: this.app.urls.messagingMessage(messageId),
    })
  }

  async getPushTemplates(deviceType) {
    return this.app.request.get({
      url: this.app.urls.messagingPushTemplates(deviceType),
    })
  }

}
