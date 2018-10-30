import Utils from '../utils'
import { deprecated } from '../decorators'

import Channel from './channel'

import {
  PublishOptionsHeaders,
  PublishOptions,
  DeliveryOptions,
  Bodyparts,
  SubscriptionOptions,
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
} from './methods'

const Messaging = {

  Bodyparts            : Bodyparts,
  PublishOptions       : PublishOptions,
  DeliveryOptions      : DeliveryOptions,
  PublishOptionsHeaders: PublishOptionsHeaders,

  /** @deprecated */
  SubscriptionOptions: SubscriptionOptions,

  subscribe: function(channelName) {
    if (!channelName || typeof channelName !== 'string') {
      throw new Error('"channelName" must be non empty string')
    }

    if (channelName.indexOf('/') >= 0) {
      throw new Error('"channelName" can not contains slash chars')
    }

    return new Channel({ name: channelName.trim() })
  },

  @deprecated('Backendless.Messaging', 'Backendless.Messaging.publish')
  publishSync: Utils.synchronized(publish),
  publish    : Utils.promisified(publish),

  pushWithTemplate: Utils.promisified(pushWithTemplate),

  @deprecated('Backendless.Messaging', 'Backendless.Messaging.sendEmail')
  sendEmailSync: Utils.synchronized(sendEmail),
  sendEmail    : Utils.promisified(sendEmail),

  @deprecated('Backendless.Messaging', 'Backendless.Messaging.cancel')
  cancelSync: Utils.synchronized(cancel),
  cancel    : Utils.promisified(cancel),

  @deprecated('Backendless.Messaging', 'Backendless.Messaging.registerDevice')
  registerDeviceSync: Utils.synchronized(registerDevice),
  registerDevice    : Utils.promisified(registerDevice),

  @deprecated('Backendless.Messaging', 'Backendless.Messaging.getRegistrations')
  getRegistrationsSync: Utils.synchronized(getRegistrations),
  getRegistrations    : Utils.promisified(getRegistrations),

  @deprecated('Backendless.Messaging', 'Backendless.Messaging.unregisterDevice')
  unregisterDeviceSync: Utils.synchronized(unregisterDevice),
  unregisterDevice    : Utils.promisified(unregisterDevice),

  @deprecated('Backendless.Messaging', 'Backendless.Messaging.getMessageStatus')
  getMessageStatusSync: Utils.synchronized(getMessageStatus),
  getMessageStatus    : Utils.promisified(getMessageStatus),

  getPushTemplates: Utils.promisified(getPushTemplates),

}

export default Messaging
