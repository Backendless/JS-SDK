import { MethodEvents } from './constants'
import { RTUtils } from './utils'

export class Methods {

  constructor(rtClient) {
    this.rtClient = rtClient

    this.callbacks = {}

    this.onResponse = this.onResponse.bind(this)
  }

  send(name, options, callback) {
    if (!this.initialized) {
      this.rtClient.on(MethodEvents.MET_RES, this.onResponse)

      this.initialized = true
    }

    const methodId = RTUtils.generateUID()
    const methodData = { id: methodId, name, options }

    this.rtClient.emit(MethodEvents.MET_REQ, methodData)

    this.callbacks[methodId] = callback
  }

  onResponse({ id, result, error }) {
    if (this.callbacks[id]) {
      this.callbacks[id](error, result)

      delete this.callbacks[id]
    }
  }

}
