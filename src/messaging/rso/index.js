import RemoteSharedObjectConnector from './connector'

export default class RemoteSharedObject {

  constructor(options) {
    this.options = options

    this.privateProperties = lockPrivateProps(this)
  }
}

function lockPrivateProps(instance) {
  const privateProperties = Object.keys(instance).concat(Object.getOwnPropertyNames(instance.constructor.prototype))

  privateProperties.forEach(prop => {
    const property = instance[prop]
    const descriptor = {}

    descriptor.configurable = false
    descriptor.enumerable = false
    descriptor.get = () => property
    descriptor.set = () => {
      throw new Error(`You can not override private property "${prop}"`)
    }

    Object.defineProperty(instance, prop, descriptor)
  })
}

Object.setPrototypeOf(RemoteSharedObject.prototype, {

  connect    : RemoteSharedObjectConnector.proxyRTMethod('connect'),
  disconnect : RemoteSharedObjectConnector.proxyRTMethod('disconnect'),
  isConnected: RemoteSharedObjectConnector.proxyRTMethod('isConnected'),

  addConnectListener   : RemoteSharedObjectConnector.proxyRTMethod('addConnectListener'),
  removeConnectListener: RemoteSharedObjectConnector.proxyRTMethod('removeConnectListener'),

  addErrorListener   : RemoteSharedObjectConnector.proxyRTMethod('addErrorListener'),
  removeErrorListener: RemoteSharedObjectConnector.proxyRTMethod('removeErrorListener'),

  addCommandListener   : RemoteSharedObjectConnector.proxyRTMethod('addCommandListener'),
  removeCommandListener: RemoteSharedObjectConnector.proxyRTMethod('removeCommandListener'),

  addUserStatusListener   : RemoteSharedObjectConnector.proxyRTMethod('addUserStatusListener'),
  removeUserStatusListener: RemoteSharedObjectConnector.proxyRTMethod('removeUserStatusListener'),

  addChangesListener   : RemoteSharedObjectConnector.proxyRTMethod('addChangesListener'),
  removeChangesListener: RemoteSharedObjectConnector.proxyRTMethod('removeChangesListener'),

  addClearListener   : RemoteSharedObjectConnector.proxyRTMethod('addClearListener'),
  removeClearListener: RemoteSharedObjectConnector.proxyRTMethod('removeClearListener'),

  removeAllListeners: RemoteSharedObjectConnector.proxyRTMethod('removeAllListeners'),

  send: RemoteSharedObjectConnector.proxyRTMethod('send', true),

  get: RemoteSharedObjectConnector.proxyRTMethod('get', true),
  set: RemoteSharedObjectConnector.proxyRTMethod('set', true),

  clear: RemoteSharedObjectConnector.proxyRTMethod('clear', true),

  invoke  : RemoteSharedObjectConnector.proxyRTMethod('invoke', true),
  invokeOn: RemoteSharedObjectConnector.proxyRTMethod('invokeOn', true),

})