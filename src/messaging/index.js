import Channel from './channel'

import {
  PublishOptionsHeaders,
  PublishOptions,
  DeliveryOptions,
  Bodyparts,
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
  }

  subscribe(channelName) {
    validateChannelName(channelName)

    return new Channel({ name: channelName }, this.app)
  }

  async publish(channelName, message, publishOptions, deliveryOptions) {
    validateChannelName(channelName)

    const data = {
      message: message
    }

    if (publishOptions) {
      if (Array.isArray(publishOptions) || typeof publishOptions !== 'object') {
        throw new Error('"publishOptions" argument must be an object.')
      }

      Object.assign(data, publishOptions)
    }

    if (deliveryOptions) {
      if (Array.isArray(deliveryOptions) || typeof deliveryOptions !== 'object') {
        throw new Error('"deliveryOptions" argument must be an object.')
      }

      Object.assign(data, deliveryOptions)
    }

    return this.app.request.post({
      url : this.app.urls.messagingChannel(channelName),
      data: data
    })
  }

  async deleteChannel(channelName) {
    validateChannelName(channelName)

    return this.app.request.delete({
      url: this.app.urls.messagingChannelName(channelName),
    })
  }

  async pushWithTemplate(templateName, templateValues) {
    if (!templateName || typeof templateName !== 'string') {
      throw new Error('Push Template Name must be provided and must be a string.')
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
    if (!subject || typeof subject !== 'string') {
      throw new Error('Email Subject must be provided and must be a string.')
    }

    if (!bodyParts || Array.isArray(bodyParts) || typeof bodyParts !== 'object') {
      throw new Error('BodyParts must be an object')
    }

    if (!bodyParts.textmessage && !bodyParts.htmlmessage) {
      throw new Error('BodyParts must contain at least one property of [ textmessage | htmlmessage ]')
    }

    if (!Array.isArray(recipients) || !recipients.length) {
      throw new Error('Recipients must be a non empty array.')
    }

    const data = {
      subject,
      bodyparts: bodyParts,
      to       : recipients,
    }

    if (Array.isArray(attachments) && attachments.length) {
      data.attachment = attachments
    }

    return this.app.request
      .post({
        url: this.app.urls.messagingEmail(),
        data
      })
  }

  async sendEmailFromTemplate(templateName, envelopeObject, templateValues, attachments) {
    if (!templateName || typeof templateName !== 'string') {
      throw new Error('Email Template Name must be provided and must be a string.')
    }

    if (!(envelopeObject instanceof EmailEnvelope)) {
      throw new Error('EmailEnvelope is required and should be instance of Backendless.Messaging.EmailEnvelope')
    }

    const data = envelopeObject.toJSON()

    data['template-name'] = templateName

    if (templateValues && !Array.isArray(templateValues)) {
      data['template-values'] = templateValues
    }

    if (Array.isArray(templateValues) && !attachments) {
      attachments = templateValues
    }

    if (attachments) {
      data.attachment = attachments
    }

    return this.app.request.post({
      url : this.app.urls.emailTemplateSend(),
      data: data
    })
  }

  async cancel(messageId) {
    if (!messageId || typeof messageId !== 'string') {
      throw new Error('Message ID must be provided and must be a string.')
    }

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

    if (Array.isArray(channels)) {
      data.channels = channels
    }

    if (typeof expiration === 'number') {
      data.expiration = expiration
    } else if (expiration instanceof Date) {
      data.expiration = expiration.getTime() / 1000
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
    if (!messageId || typeof messageId !== 'string') {
      throw new Error('Message ID must be provided and must be a string.')
    }

    return this.app.request.get({
      url: this.app.urls.messagingMessage(messageId),
    })
  }

  async getPushTemplates(deviceType) {
    if (!deviceType || typeof deviceType !== 'string') {
      throw new Error('Device Type must be provided and must be a string.')
    }

    return this.app.request.get({
      url: this.app.urls.messagingPushTemplates(deviceType),
    })
  }

}

function validateChannelName(channelName) {
  if (!channelName || typeof channelName !== 'string') {
    throw new Error('Channel Name must be provided and must be a string.')
  }

  if (channelName.indexOf('/') >= 0) {
    throw new Error('Channel Name can not contain slash chars')
  }
}
