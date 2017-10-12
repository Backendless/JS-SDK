import Utils from '../utils'

import PublishOptionsHeaders from './publish-options-header'
import PublishOptions from './publish-options'
import DeliveryOptions from './delivery-options'
import Bodyparts from './body-parts'
import SubscriptionOptions from './subscriptions-options'

import { subscribe } from './subscribe'
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

  subscribe    : Utils.promisified(subscribe),
  subscribeSync: Utils.synchronized(subscribe),

  publish    : Utils.promisified(publish),
  publishSync: Utils.synchronized(publish),

  sendEmail    : Utils.promisified(sendEmail),
  sendEmailSync: Utils.synchronized(sendEmail),

  cancel    : Utils.promisified(cancel),
  cancelSync: Utils.synchronized(cancel),

  registerDevice    : Utils.promisified(registerDevice),
  registerDeviceSync: Utils.synchronized(registerDevice),

  getRegistrations    : Utils.promisified(getRegistrations),
  getRegistrationsSync: Utils.synchronized(getRegistrations),

  unregisterDevice    : Utils.promisified(unregisterDevice),
  unregisterDeviceSync: Utils.synchronized(unregisterDevice),

  getMessageStatus    : Utils.promisified(getMessageStatus),
  getMessageStatusSync: Utils.synchronized(getMessageStatus),

}

export default Messaging
