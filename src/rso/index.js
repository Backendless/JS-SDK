import Utils from '../utils'
import { RTProvider, RTScopeConnector } from '../rt'

const ListenerTypes = Utils.mirrorKeys({
  CHANGES: null,
  CLEARED: null,
  INVOKE : null,
})

export default class RemoteSharedObject extends RTScopeConnector {

  static connect(name) {
    return new this({ name })
  }

  get connectSubscriber() {
    return RTProvider.subscriptions.connectToRSO
  }

  get usersSubscriber() {
    return RTProvider.subscriptions.onRSOUserStatus
  }

  get commandSubscriber() {
    return RTProvider.subscriptions.onRSOCommand
  }

  get commandSender() {
    return RTProvider.methods.sendRSOCommand
  }

  constructor(options) {
    super(options)

    this.invocationTarget = null
  }

  setInvocationTarget(invocationTarget) {
    this.invocationTarget = invocationTarget
  }

  onConnect() {
    super.onConnect.apply(this, arguments)

    this.addScopeSubscription(ListenerTypes.INVOKE, RTProvider.subscriptions.onRSOInvoke, {
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
    this.addScopeSubscription(ListenerTypes.CHANGES, RTProvider.subscriptions.onRSOChanges, {
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
    this.addScopeSubscription(ListenerTypes.CLEARED, RTProvider.subscriptions.onRSOClear, {
      callback,
      onError
    })
  }

  @RTScopeConnector.connectionRequired()
  removeClearListeners(callback) {
    this.stopSubscription(ListenerTypes.CLEARED, { callback })
  }

  @RTScopeConnector.connectionRequired(true)
  get(key) {
    return RTProvider.methods.getRSO({ ...this.getScopeOptions(), key })
  }

  @RTScopeConnector.connectionRequired(true)
  set(key, data) {
    return RTProvider.methods.setRSO({ ...this.getScopeOptions(), key, data })
  }

  @RTScopeConnector.connectionRequired(true)
  clear() {
    return RTProvider.methods.clearRSO(this.getScopeOptions())
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
      .then(() => RTProvider.methods.invokeRSOMethod({ ...this.getScopeOptions(), method, targets, args }))
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