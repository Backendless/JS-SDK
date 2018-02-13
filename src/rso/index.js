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

    this.addSubscription(ListenerTypes.INVOKE, RTProvider.subscriptions.onRSOInvoke, this.onInvoke)
  }

  onDisconnect() {
    this.stopSubscription(ListenerTypes.INVOKE, { callback: this.onInvoke })

    super.onDisconnect.apply(this, arguments)
  }

  onInvoke = ({ method, args }) => {
    checkInvocationTargetMethod(this.invocationTarget, method)

    this.invocationTarget[method](...args)
  }

  @RTScopeConnector.delayedOperation()
  addChangesListener(callback, onError) {
    this.addSubscription(ListenerTypes.CHANGES, RTProvider.subscriptions.onRSOChanges, callback, onError)
  }

  @RTScopeConnector.delayedOperation()
  removeChangesListeners(callback) {
    this.stopSubscription(ListenerTypes.CHANGES, { callback })
  }

  @RTScopeConnector.delayedOperation()
  addClearListener(callback, onError) {
    this.addSubscription(ListenerTypes.CLEARED, RTProvider.subscriptions.onRSOClear, callback, onError)
  }

  @RTScopeConnector.delayedOperation()
  removeClearListeners(callback) {
    this.stopSubscription(ListenerTypes.CLEARED, { callback })
  }

  @RTScopeConnector.delayedOperation(true)
  get(key) {
    return RTProvider.methods.getRSO({ ...this.getScopeOptions(), key })
  }

  @RTScopeConnector.delayedOperation(true)
  set(key, data) {
    return RTProvider.methods.setRSO({ ...this.getScopeOptions(), key, data })
  }

  @RTScopeConnector.delayedOperation(true)
  clear() {
    return RTProvider.methods.clearRSO(this.getScopeOptions())
  }

  @RTScopeConnector.delayedOperation(true)
  invoke(method, ...args) {
    return this.invokeOn(method, undefined, ...args)
  }

  @RTScopeConnector.delayedOperation(true)
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