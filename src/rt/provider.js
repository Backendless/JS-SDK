import { getCurrentUserToken } from '../users/current-user'

import Subscriptions from './subscriptions'
import Methods from './methods'
import Socket from './socket'

const RTProvider = {

  on  : Socket.starterMethod('on'),
  off : Socket.starterMethod('off'),
  emit: Socket.starterMethod('emit'),

  init() {
    Socket.destroy()
    Socket.setInitializer(this.socketInitializer)

    this.initialized = false
    this.delayedMethods = []

    this.subscriptions = new Subscriptions(this)
    this.methods = new Methods(this)
  },

  socketInitializer() {
    return {
      onInit   : RTProvider.onSocketInit.bind(RTProvider),
      userToken: getCurrentUserToken()
    }
  },

  onSocketInit() {
    this.initialized = true

    this.delayedMethods.forEach(([method, args]) => this[method](...args))
    this.delayedMethods = []
  },

  updateUserToken() {
    if (this.initialized) {
      this.methods.updateUserToken({ userToken: getCurrentUserToken() })
    }
  },

  runDelayedMethod(method, ...args) {
    if (this.initialized) {
      this[method](...args)

    } else {
      this.delayedMethods.push([method, args])
    }
  },
}

export default RTProvider
