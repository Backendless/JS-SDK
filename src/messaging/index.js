import Utils from '../utils'
import { deprecated } from '../decorators'

import RSO from './rso'
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
  cancel,
  registerDevice,
  unregisterDevice,
  getRegistrations,
  getMessageStatus,
} from './methods'

const Messaging = {

  Bodyparts            : Bodyparts,
  PublishOptions       : PublishOptions,
  DeliveryOptions      : DeliveryOptions,
  SubscriptionOptions  : SubscriptionOptions,
  PublishOptionsHeaders: PublishOptionsHeaders,

  rso(name) {
    return new RSO({ name })
  },

  subscribe: function(channelName, subscriptionCallback, subscriptionOptions) {
    if (Utils.isObject(subscriptionCallback)) {
      const callback = subscriptionOptions
      subscriptionOptions = subscriptionCallback
      subscriptionCallback = callback
    }

    const { subtopic, selector } = subscriptionOptions || {}

    const channel = new Channel({ name: channelName, subtopic })

    if (subscriptionCallback) {
      channel.addMessageListener(selector, subscriptionCallback)
    }

    return channel
  },

  @deprecated('Backendless.Messaging', 'Backendless.Messaging.publish')
  publishSync: Utils.synchronized(publish),
  publish    : Utils.promisified(publish),

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

}

export default Messaging
