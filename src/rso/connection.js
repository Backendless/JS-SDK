import Utils from '../utils'
import { RTScopeConnector } from '../rt'

const ListenerTypes = Utils.mirrorKeys({
  CHANGES: null,
  CLEARED: null,
  INVOKE : null,
})

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

  subscribeOnRemoteInvokes() {
    if (!this.subscribedOnRemoteInvokes) {
      this.subscribedOnRemoteInvokes = true

      this.addSubscription(ListenerTypes.INVOKE, this.app.RT.subscriptions.onRSOInvoke, {
        callback: this.onInvoke
      })
    }
  }

  connect() {
    if (this.app) {
      return super.connect()
    }
  }

  onConnect() {
    super.onConnect.apply(this, arguments)

    this.subscribeOnRemoteInvokes()
  }

  onDisconnect() {
    this.subscribedOnRemoteInvokes = false
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

  addCommandListener() {
    return super.addCommandListener.apply(this, arguments)
  }

  addUserStatusListener() {
    return super.addUserStatusListener.apply(this, arguments)
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