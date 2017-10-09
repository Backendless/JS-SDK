import Backendless from '../bundle'
import Utils from '../utils'

import RTConnector from './rt-connector'

const ListenerTypes = Utils.mirrorKeys({
  CHANGES: null,
  CLEARED: null,
  INVOKE : null,
})

export default class RemoteSharedObject extends RTConnector {

  get connectSubscriber() {
    return Backendless.RT.subscriptions.connectToRSO
  }

  get usersSubscriber() {
    return Backendless.RT.subscriptions.onRSOUserStatus
  }

  get commandSubscriber() {
    return Backendless.RT.subscriptions.onRSOCommand
  }

  get commandSender() {
    return Backendless.RT.methods.sendRSOCommand
  }

  constructor(options) {
    super(options)

    this.privateProperties = []
    this.privateProperties = Object.keys(this).concat(Object.getOwnPropertyNames(RemoteSharedObject.prototype))

    this.privateProperties.forEach(prop => {
      let property = this[prop]
      const isMethod = typeof property === 'function'
      const descriptor = {}

      descriptor.configurable = false
      descriptor.enumerable = false
      descriptor.get = () => property
      descriptor.set = value => {
        if (isMethod) {
          throw new Error(`You can not override private method "${prop}"`)
        }

        property = value
      }

      Object.defineProperty(this, prop, descriptor)
    })
  }

  onConnect() {
    this.addSubscription(ListenerTypes.INVOKE, Backendless.RT.subscriptions.onRSOInvokes, this.onInvoke)

    super.onConnect.apply(this, arguments)
  }

  onDisconnect() {
    this.stopSubscription(ListenerTypes.INVOKE, { callback: this.onInvoke })

    super.onDisconnect.apply(this, arguments)
  }

  onInvoke = ({ method, args }) => {
    if (!this.privateProperties.includes(method) && typeof this[method] === 'function') {
      this[method](...args)
    }
  }

  @RTConnector.delayedOperation()
  addChangesListener(callback) {
    this.addSubscription(ListenerTypes.CHANGES, Backendless.RT.subscriptions.onRSOChanges, callback)
  }

  @RTConnector.delayedOperation()
  removeChangesListener(callback) {
    this.stopSubscription(ListenerTypes.CHANGES, { callback })
  }

  @RTConnector.delayedOperation()
  addClearListener(callback) {
    this.addSubscription(ListenerTypes.CLEARED, Backendless.RT.subscriptions.onRSOClear, callback)
  }

  @RTConnector.delayedOperation()
  removeClearListener(callback) {
    this.stopSubscription(ListenerTypes.CLEARED, { callback })
  }

  @RTConnector.delayedOperation(true)
  get(key) {
    return Backendless.RT.methods.getRSO({ ...this.options, key })
  }

  @RTConnector.delayedOperation(true)
  set(key, data) {
    return Backendless.RT.methods.setRSO({ ...this.options, key, data })
  }

  @RTConnector.delayedOperation(true)
  clear() {
    return Backendless.RT.methods.clearRSO(this.options)
  }

  @RTConnector.delayedOperation(true)
  invoke(method, ...args) {
    return this.invokeOn(method, undefined, ...args)
  }

  @RTConnector.delayedOperation(true)
  invokeOn(method, targets, ...args) {
    return Promise
      .resolve()
      .then(() => {
        if (this.privateProperties.includes(method)) {
          throw new Error('Can not call private method.')
        }
      })
      .then(() => Backendless.RT.methods.invokeRSOMethod({ ...this.options, method, targets, args }))
  }
}
