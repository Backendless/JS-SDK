import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'
import Async from '../request/async'
import Subscription from './subscription'
import Bodyparts from './body-parts'
import DeliveryOptions from './delivery-options'
import PublishOptions from './publish-options'

let DEVICE = null

function Messaging() {
  this.restUrl = Urls.messaging()
  this.channelProperties = {}
}

Messaging.prototype = {
  _getProperties: function(channelName, async) {
    const responder = Utils.extractResponder(arguments)
    const isAsync = !!responder

    const props = this.channelProperties[channelName]

    if (props) {
      if (isAsync) {
        async.success(props)
      }

      return props
    }

    const result = Backendless._ajax({
      method      : 'GET',
      url         : Urls.messagingChannelProps(channelName),
      isAsync     : isAsync,
      asyncHandler: responder
    })

    this.channelProperties[channelName] = result

    return result
  },

  subscribe: Utils.promisified('_subscribe'),

  subscribeSync: Utils.synchronized('_subscribe'),

  _subscribe: function(channelName, subscriptionCallback, subscriptionOptions, async) {
    const responder = Utils.extractResponder(arguments)
    const isAsync = !!responder

    if (isAsync) {
      const that = this

      const callback = new Async(function(props) {
        responder.success(new Subscription({
          channelName      : channelName,
          options          : subscriptionOptions,
          channelProperties: props,
          responder        : subscriptionCallback,
          restUrl          : that.restUrl,
          onSubscribe      : responder
        }))
      }, function(data) {
        responder.fault(data)
      })

      this._getProperties(channelName, callback)
    } else {
      const props = this._getProperties(channelName)

      return new Subscription({
        channelName      : channelName,
        options          : subscriptionOptions,
        channelProperties: props,
        responder        : subscriptionCallback,
        restUrl          : this.restUrl
      })
    }
  },

  publish: Utils.promisified('_publish'),

  publishSync: Utils.synchronized('_publish'),

  _publish: function(channelName, message, publishOptions, deliveryTarget, async) {
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
  },

  sendEmail: Utils.promisified('_sendEmail'),

  sendEmailSync: Utils.synchronized('_sendEmail'),

  _sendEmail: function(subject, bodyParts, recipients, attachments, async) {
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
  },

  cancel: Utils.promisified('_cancel'),

  cancelSync: Utils.synchronized('_cancel'),

  _cancel: function(messageId, async) {
    const isAsync = !!async

    return Backendless._ajax({
      method      : 'DELETE',
      url         : Urls.messagingMessage(messageId),
      isAsync     : isAsync,
      asyncHandler: new Async(Utils.emptyFn)
    })
  },

  registerDevice: Utils.promisified('_registerDevice'),

  registerDeviceSync: Utils.synchronized('_registerDevice'),

  _registerDevice: function(deviceToken, channels, expiration, async) {
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
  },

  getRegistrations: Utils.promisified('_getRegistrations'),

  getRegistrationsSync: Utils.synchronized('_getRegistrations'),

  _getRegistrations: function(async) {
    assertDeviceDefined()

    const responder = Utils.extractResponder(arguments)
    const isAsync = !!responder

    return Backendless._ajax({
      method      : 'GET',
      url         : Urls.messagingRegistrationDevice(DEVICE.uuid),
      isAsync     : isAsync,
      asyncHandler: responder
    })
  },

  unregisterDevice: Utils.promisified('_unregisterDevice'),

  unregisterDeviceSync: Utils.synchronized('_unregisterDevice'),

  _unregisterDevice: function(async) {
    assertDeviceDefined()

    const responder = Utils.extractResponder(arguments)
    const isAsync = !!responder

    Backendless._ajax({
      method      : 'DELETE',
      url         : Urls.messagingRegistrationDevice(DEVICE.uuid),
      isAsync     : isAsync,
      asyncHandler: responder
    })
  },

  getMessageStatus: Utils.promisified('_getMessageStatus'),

  getMessageStatusSync: Utils.synchronized('_getMessageStatus'),

  _getMessageStatus: function(messageId, async) {
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
