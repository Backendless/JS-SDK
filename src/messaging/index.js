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

import {
  publish,
  sendEmail,
  pushWithTemplate,
  cancel,
  registerDevice,
  unregisterDevice,
  getRegistrations,
  getMessageStatus,
  getPushTemplates,
  sendEmailFromTemplate
} from './methods'

class Messaging {
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
}

Object.assign(Messaging.prototype, {
  publish: Utils.promisified(publish),

  pushWithTemplate: Utils.promisified(pushWithTemplate),

  sendEmail: Utils.promisified(sendEmail),

  sendEmailFromTemplate: Utils.promisified(sendEmailFromTemplate),

  cancel: Utils.promisified(cancel),

  registerDevice: Utils.promisified(registerDevice),

  getRegistrations: Utils.promisified(getRegistrations),

  unregisterDevice: Utils.promisified(unregisterDevice),

  getMessageStatus: Utils.promisified(getMessageStatus),

  getPushTemplates: Utils.promisified(getPushTemplates),

})

export default Messaging
