import { RTScopeConnector } from '../rt'

const ListenerTypes = {
  CHANGES: 'CHANGES',
  CLEARED: 'CLEARED',
  INVOKE : 'INVOKE',
}

export default class RemoteSharedObject extends RTScopeConnector {
  constructor(options, app) {
    super(options)

    this.app = app
    this.invocationTarget = null

    this.connect()
  }

  get connectSubscriber() {
    return this.app.RT.subscriptions.connectToRSO
  }

  get usersSubscriber() {
    return this.app.RT.subscriptions.onRSOUserStatus
  }

  get commandSubscriber() {
    return this.app.RT.subscriptions.onRSOCommand
  }

  get commandSender() {
    return this.app.RT.methods.sendRSOCommand
  }

  setInvocationTarget(invocationTarget) {
    this.invocationTarget = invocationTarget
  }

  connect() {
    if (this.app) {
      return super.connect()
    }
  }

  onConnect() {
    super.onConnect.apply(this, arguments)

    this.addSubscription(ListenerTypes.INVOKE, this.app.RT.subscriptions.onRSOInvoke, {
      callback: this.onInvoke
    })
  }

  onDisconnect() {
    this.stopSubscription(ListenerTypes.INVOKE, { callback: this.onInvoke })

    super.onDisconnect.apply(this, arguments)
  }

  onInvoke = ({ method, args }) => {
    checkInvocationTargetMethod(this.invocationTarget, method)

    this.invocationTarget[method](...args)
  }

  @RTScopeConnector.connectionRequired()
  addChangesListener(callback, onError) {
    this.addSubscription(ListenerTypes.CHANGES, this.app.RT.subscriptions.onRSOChanges, {
      callback,
      onError
    })
  }

  @RTScopeConnector.connectionRequired()
  removeChangesListeners(callback) {
    this.stopSubscription(ListenerTypes.CHANGES, { callback })
  }

  @RTScopeConnector.connectionRequired()
  addClearListener(callback, onError) {
    this.addSubscription(ListenerTypes.CLEARED, this.app.RT.subscriptions.onRSOClear, {
      callback,
      onError
    })
  }

  @RTScopeConnector.connectionRequired()
  removeClearListeners(callback) {
    this.stopSubscription(ListenerTypes.CLEARED, { callback })
  }

  addCommandListener(callback, onError) {
    super.addCommandListener.call(this, callback, onError)

    return this
  }

  removeCommandListeners(callback) {
    super.removeCommandListeners.call(this, callback)

    return this
  }

  addUserStatusListener(callback, onError) {
    super.addUserStatusListener.call(this, callback, onError)

    return this
  }

  removeUserStatusListeners(callback) {
    super.removeUserStatusListeners.call(this, callback)

    return this
  }

  addConnectListener(callback, onError) {
    super.addConnectListener.call(this, callback, onError)

    return this
  }

  removeConnectListeners(callback, onError) {
    super.removeConnectListeners.call(this, callback, onError)

    return this
  }

  removeAllListeners() {
    super.removeAllListeners.call(this)

    return this
  }

  @RTScopeConnector.connectionRequired(true)
  get(key) {
    return this.app.RT.methods.getRSO({ ...this.getScopeOptions(), key })
  }

  @RTScopeConnector.connectionRequired(true)
  set(key, data) {
    return this.app.RT.methods.setRSO({ ...this.getScopeOptions(), key, data })
  }

  @RTScopeConnector.connectionRequired(true)
  clear() {
    return this.app.RT.methods.clearRSO(this.getScopeOptions())
  }

  @RTScopeConnector.connectionRequired(true)
  invoke(method, ...args) {
    return this.invokeOn(method, undefined, ...args)
  }

  @RTScopeConnector.connectionRequired(true)
  invokeOn(method, targets, ...args) {
    return Promise
      .resolve()
      .then(() => checkInvocationTargetMethod(this.invocationTarget, method))
      .then(() => this.app.RT.methods.invokeRSOMethod({
        ...this.getScopeOptions(),
        method,
        targets,
        args
      }))
  }
}

function checkInvocationTargetMethod(invocationTarget, method) {
  if (!invocationTarget) {
    throw new Error('"invocationTarget" is not specified')
  }

  if (typeof invocationTarget[method] !== 'function') {
    throw new Error(`Method "${method}" of invocationTarget is not function`)
  }
}
