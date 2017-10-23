import Messaging from '../index'
import { PublishOptions } from '../helpers'

import ChannelConnector from './connector'

class Channel {

  constructor(options) {
    this.options = options
  }

  publish(message, publishOptions, deliveryTarget) {
    publishOptions = publishOptions || new PublishOptions()
    publishOptions.subtopic = this.options.subtopic

    return Messaging.publish(this.options.name, message, publishOptions, deliveryTarget)
  }

}

Object.setPrototypeOf(Channel.prototype, {

  connect    : ChannelConnector.proxyRTMethod('connect'),
  disconnect : ChannelConnector.proxyRTMethod('disconnect'),
  isConnected: ChannelConnector.proxyRTMethod('isConnected'),

  addConnectListener   : ChannelConnector.proxyRTMethod('addConnectListener'),
  removeConnectListener: ChannelConnector.proxyRTMethod('removeConnectListener'),

  addErrorListener   : ChannelConnector.proxyRTMethod('addErrorListener'),
  removeErrorListener: ChannelConnector.proxyRTMethod('removeErrorListener'),

  addMessageListener   : ChannelConnector.proxyRTMethod('addMessageListener'),
  removeMessageListener: ChannelConnector.proxyRTMethod('removeMessageListener'),

  addCommandListener   : ChannelConnector.proxyRTMethod('addCommandListener'),
  removeCommandListener: ChannelConnector.proxyRTMethod('removeCommandListener'),

  addUserStatusListener   : ChannelConnector.proxyRTMethod('addUserStatusListener'),
  removeUserStatusListener: ChannelConnector.proxyRTMethod('removeUserStatusListener'),

  removeAllListeners: ChannelConnector.proxyRTMethod('removeAllListeners'),

  send: ChannelConnector.proxyRTMethod('send', true),

})

export default Channel