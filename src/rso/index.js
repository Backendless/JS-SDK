import Utils from '../utils'
import { RTClient, RTScopeConnector, checkUsesInBusinessLogic, disallowInBusinessLogic } from '../rt'

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
    return RTClient.subscriptions.connectToRSO
  }

  get usersSubscriber() {
    return RTClient.subscriptions.onRSOUserStatus
  }

  get commandSubscriber() {
    return RTClient.subscriptions.onRSOCommand
  }

  get commandSender() {
    return RTClient.methods.sendRSOCommand
  }

  constructor(options) {
    super(options)

    this.invocationTarget = null
  }

  setInvocationTarget(invocationTarget) {
    checkUsesInBusinessLogic('SharedObject.setInvocationTarget')

    this.invocationTarget = invocationTarget
  }

  subscribeOnRemoteInvokes() {
    let isAllowToSubscribeOnRemoteInvoke = false

    try {
      checkUsesInBusinessLogic('Remote Invoke')

      isAllowToSubscribeOnRemoteInvoke = true
    } catch (e) {
      // Remote Invoke is not supported in Business Logic
    }

    if (isAllowToSubscribeOnRemoteInvoke && !this.subscribedOnRemoteInvokes) {
      this.subscribedOnRemoteInvokes = true

      this.addSubscription(ListenerTypes.INVOKE, RTClient.subscriptions.onRSOInvoke, {
        callback: this.onInvoke
      })
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

  @disallowInBusinessLogic('SharedObject.addChangesListener')
  @RTScopeConnector.connectionRequired()
  addChangesListener(callback, onError) {
    this.addSubscription(ListenerTypes.CHANGES, RTClient.subscriptions.onRSOChanges, {
      callback,
      onError
    })
  }

  @RTScopeConnector.connectionRequired()
  removeChangesListeners(callback) {
    this.stopSubscription(ListenerTypes.CHANGES, { callback })
  }

  @disallowInBusinessLogic('SharedObject.addClearListener')
  @RTScopeConnector.connectionRequired()
  addClearListener(callback, onError) {
    this.addSubscription(ListenerTypes.CLEARED, RTClient.subscriptions.onRSOClear, {
      callback,
      onError
    })
  }

  @RTScopeConnector.connectionRequired()
  removeClearListeners(callback) {
    this.stopSubscription(ListenerTypes.CLEARED, { callback })
  }

  @disallowInBusinessLogic('SharedObject.addCommandListener')
  addCommandListener() {
    return super.addCommandListener.apply(this, arguments)
  }

  @disallowInBusinessLogic('SharedObject.addUserStatusListener')
  addUserStatusListener() {
    return super.addUserStatusListener.apply(this, arguments)
  }

  @RTScopeConnector.connectionRequired(true)
  get(key) {
    return RTClient.methods.getRSO({ ...this.getScopeOptions(), key })
  }

  @RTScopeConnector.connectionRequired(true)
  set(key, data) {
    return RTClient.methods.setRSO({ ...this.getScopeOptions(), key, data })
  }

  @RTScopeConnector.connectionRequired(true)
  clear() {
    return RTClient.methods.clearRSO(this.getScopeOptions())
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
      .then(() => RTClient.methods.invokeRSOMethod({ ...this.getScopeOptions(), method, targets, args }))
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