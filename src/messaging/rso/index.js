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

Object.assign(RemoteSharedObject.prototype, {

  connect    : RemoteSharedObjectConnector.proxyRTMethod('connect'),
  disconnect : RemoteSharedObjectConnector.proxyRTMethod('disconnect'),
  isConnected: RemoteSharedObjectConnector.proxyRTMethod('isConnected'),

  addConnectListener    : RemoteSharedObjectConnector.proxyRTMethod('addConnectListener'),
  removeConnectListeners: RemoteSharedObjectConnector.proxyRTMethod('removeConnectListeners'),

  addErrorListener    : RemoteSharedObjectConnector.proxyRTMethod('addErrorListener'),
  removeErrorListeners: RemoteSharedObjectConnector.proxyRTMethod('removeErrorListeners'),

  addCommandListener    : RemoteSharedObjectConnector.proxyRTMethod('addCommandListener'),
  removeCommandListeners: RemoteSharedObjectConnector.proxyRTMethod('removeCommandListeners'),

  addUserStatusListener    : RemoteSharedObjectConnector.proxyRTMethod('addUserStatusListener'),
  removeUserStatusListeners: RemoteSharedObjectConnector.proxyRTMethod('removeUserStatusListeners'),

  addChangesListener    : RemoteSharedObjectConnector.proxyRTMethod('addChangesListener'),
  removeChangesListeners: RemoteSharedObjectConnector.proxyRTMethod('removeChangesListeners'),

  addClearListener    : RemoteSharedObjectConnector.proxyRTMethod('addClearListener'),
  removeClearListeners: RemoteSharedObjectConnector.proxyRTMethod('removeClearListeners'),

  removeAllListeners: RemoteSharedObjectConnector.proxyRTMethod('removeAllListeners'),

  send: RemoteSharedObjectConnector.proxyRTMethod('send', true),

  get: RemoteSharedObjectConnector.proxyRTMethod('get', true),
  set: RemoteSharedObjectConnector.proxyRTMethod('set', true),

  clear: RemoteSharedObjectConnector.proxyRTMethod('clear', true),

  invoke  : RemoteSharedObjectConnector.proxyRTMethod('invoke', true),
  invokeOn: RemoteSharedObjectConnector.proxyRTMethod('invokeOn', true),

})