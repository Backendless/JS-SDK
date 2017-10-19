import Utils from '../../utils'
import { RTProvider, RTScopeConnector } from '../../rt'

const ListenerTypes = Utils.mirrorKeys({
  CHANGES: null,
  CLEARED: null,
  INVOKE : null,
})

export default class RemoteSharedObjectConnector extends RTScopeConnector {

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

  onConnect = () => {
    this.addSubscription(ListenerTypes.INVOKE, RTProvider.subscriptions.onRSOInvokes, this.onInvoke)

    super.onConnect.apply(this, arguments)
  }

  onDisconnect = () => {
    this.stopSubscription(ListenerTypes.INVOKE, { callback: this.onInvoke })

    super.onDisconnect.apply(this, arguments)
  }

  onInvoke = ({ method, args }) => {
    if (!this.initiator.privateProperties.includes(method) && typeof this.initiator[method] === 'function') {
      this.initiator[method](...args)
    }
  }

  @RTScopeConnector.delayedOperation()
  addChangesListener(callback) {
    this.addSubscription(ListenerTypes.CHANGES, RTProvider.subscriptions.onRSOChanges, callback)
  }

  @RTScopeConnector.delayedOperation()
  removeChangesListener(callback) {
    this.stopSubscription(ListenerTypes.CHANGES, { callback })
  }

  @RTScopeConnector.delayedOperation()
  addClearListener(callback) {
    this.addSubscription(ListenerTypes.CLEARED, RTProvider.subscriptions.onRSOClear, callback)
  }

  @RTScopeConnector.delayedOperation()
  removeClearListener(callback) {
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
      .then(() => {
        if (this.initiator.privateProperties.includes(method)) {
          throw new Error('Can not call private method.')
        }
      })
      .then(() => RTProvider.methods.invokeRSOMethod({ ...this.getScopeOptions(), method, targets, args }))
  }
}
