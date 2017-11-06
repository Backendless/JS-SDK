import Utils from '../utils'
import RTUtils from './utils'

const Events = Utils.mirrorKeys({
  MET_REQ: null,
  MET_RES: null,
})

const Types = Utils.mirrorKeys({
  SET_USER: null,

  RSO_GET    : null,
  RSO_SET    : null,
  RSO_CLEAR  : null,
  RSO_COMMAND: null,
  RSO_INVOKE : null,

  PUB_SUB_COMMAND: null,
})

const method = type => function(data) {
  return this.send(type, data)
}

export default class RTMethods {

  constructor(rtClient) {
    this.rtClient = rtClient

    this.invocations = {}
  }

  send(name, options) {
    if (!this.initialized) {
      this.rtClient.on(Events.MET_RES, this.onResponse)

      this.initialized = true
    }

    const methodId = RTUtils.generateUID()
    const methodData = { id: methodId, name, options }

    this.rtClient.emit(Events.MET_REQ, methodData)

    return new Promise((resolve, reject) => {
      this.invocations[methodId] = { resolve, reject }
    })
  }

  onResponse = ({ id, error, result }) => {
    if (this.invocations[id]) {
      const invocation = this.invocations[id]

      if (error) {
        invocation.reject(error)
      } else {
        invocation.resolve(result)
      }

      delete this.invocations[id]
    }
  }

  //---------------------------------//
  //----------- AUTH METHODS --------//

  updateUserToken = method(Types.SET_USER).bind(this)

  //----------- AUTH METHODS --------//
  //---------------------------------//

  //---------------------------------//
  //-------- PUB_SUB METHODS --------//

  sendPubSubCommand = method(Types.PUB_SUB_COMMAND).bind(this)

  //-------- PUB_SUB METHODS --------//
  //---------------------------------//

  //---------------------------------//
  //----------- RSO METHODS ---------//

  getRSO = method(Types.RSO_GET).bind(this)
  setRSO = method(Types.RSO_SET).bind(this)
  clearRSO = method(Types.RSO_CLEAR).bind(this)
  sendRSOCommand = method(Types.RSO_COMMAND).bind(this)
  invokeRSOMethod = method(Types.RSO_INVOKE).bind(this)

  //----------- RSO METHODS ---------//
  //---------------------------------//
}
