import Messaging from '../index'

import ChannelConnector from './connector'

class Channel {

  constructor(options) {
    this.options = options
  }

  publish(message, publishOptions, deliveryTarget) {
    return Messaging.publish(this.options.name, message, publishOptions, deliveryTarget)
  }

}

Object.assign(Channel.prototype, {

  connect    : ChannelConnector.proxyRTMethod('connect'),
  disconnect : ChannelConnector.proxyRTMethod('disconnect'),
  isConnected: ChannelConnector.proxyRTMethod('isConnected'),

  addConnectListener    : ChannelConnector.proxyRTMethod('addConnectListener'),
  removeConnectListeners: ChannelConnector.proxyRTMethod('removeConnectListeners'),

  addErrorListener    : ChannelConnector.proxyRTMethod('addErrorListener'),
  removeErrorListeners: ChannelConnector.proxyRTMethod('removeErrorListeners'),

  addMessageListener    : ChannelConnector.proxyRTMethod('addMessageListener'),
  removeMessageListeners: ChannelConnector.proxyRTMethod('removeMessageListeners'),

  addCommandListener    : ChannelConnector.proxyRTMethod('addCommandListener'),
  removeCommandListeners: ChannelConnector.proxyRTMethod('removeCommandListeners'),

  addUserStatusListener    : ChannelConnector.proxyRTMethod('addUserStatusListener'),
  removeUserStatusListeners: ChannelConnector.proxyRTMethod('removeUserStatusListeners'),

  removeAllListeners: ChannelConnector.proxyRTMethod('removeAllListeners'),

  send: ChannelConnector.proxyRTMethod('send', true),

})

export default Channel