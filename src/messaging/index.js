import Utils from '../utils'
import { deprecated } from '../decorators'

import PublishOptionsHeaders from './publish-options-header'
import PublishOptions from './publish-options'
import DeliveryOptions from './delivery-options'
import Bodyparts from './body-parts'
import SubscriptionOptions from './subscriptions-options'
import RSO from './rso'
import Channel from './channel'

import { publish } from './publish'
import { sendEmail } from './send-email'
import { cancel } from './cancel'
import { registerDevice } from './register-device'
import { unregisterDevice } from './unregister-device'
import { getRegistrations } from './get-registration'
import { getMessageStatus } from './get-message-status'

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
    const { subtopic, selector } = subscriptionOptions || {}

    const channel = new Channel({ channel: channelName, subtopic })

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
