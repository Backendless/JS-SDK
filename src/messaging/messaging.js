import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'
import Async from '../request/async'
import Bodyparts from './body-parts'
import DeliveryOptions from './delivery-options'
import PublishOptions from './publish-options'
import RSO from './rso'
import Channel from './channel'

let DEVICE = null

function publish(channelName, message, publishOptions, deliveryTarget/**, async */) {
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  const data = {
    message: message
  }

  if (publishOptions && publishOptions !== responder) {
    if (!(publishOptions instanceof PublishOptions)) {
      throw new Error('Use PublishOption as publishOptions argument')
    }

    Utils.deepExtend(data, publishOptions)
  }

  if (deliveryTarget && deliveryTarget !== responder) {
    if (!(deliveryTarget instanceof DeliveryOptions)) {
      throw new Error('Use DeliveryOptions as deliveryTarget argument')
    }

    Utils.deepExtend(data, deliveryTarget)
  }

  return Backendless._ajax({
    method      : 'POST',
    url         : Urls.messagingChannel(channelName),
    isAsync     : isAsync,
    asyncHandler: responder,
    data        : JSON.stringify(data)
  })
}

const sendEmail = function(subject, bodyParts, recipients, attachments/**, async */) {
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder
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

  return Backendless._ajax({
    method      : 'POST',
    url         : Urls.messagingEmail(),
    isAsync     : isAsync,
    asyncHandler: Utils.wrapAsync(responder, responseMessageStatus),
    data        : JSON.stringify(data)
  })
}

const registerDevice = function(deviceToken, channels /**, expiration, async */) {
  assertDeviceDefined()

  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  const data = {
    deviceToken: deviceToken,
    deviceId   : DEVICE.uuid,
    os         : DEVICE.platform,
    osVersion  : DEVICE.version
  }

  if (Utils.isArray(channels)) {
    data.channels = channels
  }

  for (let i = 0, len = arguments.length; i < len; ++i) {
    const val = arguments[i]
    if (Utils.isNumber(val) || val instanceof Date) {
      data.expiration = (val instanceof Date) ? val.getTime() / 1000 : val
    }
  }

  Backendless._ajax({
    method      : 'POST',
    url         : Urls.messagingRegistrations(),
    data        : JSON.stringify(data),
    isAsync     : isAsync,
    asyncHandler: responder
  })
}

const getRegistrations = function(/** async */) {
  assertDeviceDefined()

  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  return Backendless._ajax({
    method      : 'GET',
    url         : Urls.messagingRegistrationDevice(DEVICE.uuid),
    isAsync     : isAsync,
    asyncHandler: responder
  })
}

const unregisterDevice = function(/** async */) {
  assertDeviceDefined()

  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  Backendless._ajax({
    method      : 'DELETE',
    url         : Urls.messagingRegistrationDevice(DEVICE.uuid),
    isAsync     : isAsync,
    asyncHandler: responder
  })
}

const getMessageStatus = function(messageId /**, async */) {
  if (!messageId) {
    throw Error('Message ID is required.')
  }

  const responder = Utils.extractResponder(arguments)

  return Backendless._ajax({
    method      : 'GET',
    url         : Urls.messagingMessage(messageId),
    isAsync     : !!responder,
    asyncHandler: responder
  })
}

const cancel = function(messageId, async) {
  const isAsync = !!async

  return Backendless._ajax({
    method      : 'DELETE',
    url         : Urls.messagingMessage(messageId),
    isAsync     : isAsync,
    asyncHandler: new Async(Utils.emptyFn)
  })
}

const Messaging = {

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

function assertDeviceDefined() {

  if (!DEVICE) {
    throw new Error('Device is not defined. Please, run the Backendless.setupDevice')
  }
}

Backendless.setupDevice = function(deviceProps) {
  if (!deviceProps || !deviceProps.uuid || !deviceProps.platform || !deviceProps.version) {
    throw new Error('Device properties object must consist of fields "uuid", "platform" and "version".')
  }

  DEVICE = {
    uuid    : deviceProps.uuid,
    platform: deviceProps.platform.toUpperCase(),
    version : deviceProps.version
  }
}

export default Messaging
