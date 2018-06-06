import BackendlessRTClient from 'backendless-rt-client'

import Utils from './utils'
import LocalVars from './local-vars'
import { getCurrentUserToken } from './users/current-user'

let rtClient = null
const rtClientId = Utils.uuid()

export const RTListeners = BackendlessRTClient.Listeners
export const RTScopeConnector = BackendlessRTClient.ScopeConnector

export const RTClient = {

  get subscriptions() {
    return rtClient.subscriptions
  },

  get methods() {
    return rtClient.methods
  }
}

export const checkUsesInBusinessLogic = target => {
  if (LocalVars.ServerCode) {
    // temporarily disable this limitation
    // throw new Error(`"${target}" is not supported inside Business Logic.`)
  }
}

export const disallowInBusinessLogic = target => (object, method, description) => {
  const native = description.value

  description.value = function() {
    checkUsesInBusinessLogic(target)

    return native.apply(this, arguments)
  }

  return description
}

export const setRTDebugMode = debugMode => {
  if (rtClient) {
    rtClient.setConfig({ debugMode })
  }
}

export const initRTClient = () => {
  if (rtClient) {
    rtClient.terminate()
  }

  rtClient = new BackendlessRTClient({
    appId     : LocalVars.applicationId,
    lookupPath: `${LocalVars.appPath}/rt/lookup`,
    debugMode : LocalVars.debugMode,
    connectQuery() {
      return {
        apiKey   : LocalVars.secretKey,
        userToken: getCurrentUserToken(),
        clientId : rtClientId,
      }
    }
  })
}

export const updateRTUserTokenIfNeeded = () => {
  if (rtClient.session) {
    rtClient.methods.setUserToken({ userToken: getCurrentUserToken() })
  }
}

const ensureRTClient = method => (...args) => {
  if (rtClient) {
    rtClient[method](...args)
  }
}

const RT = {
  connect   : ensureRTClient('connect'),
  disconnect: ensureRTClient('disconnect'),

  addConnectEventListener   : ensureRTClient('addConnectEventListener'),
  removeConnectEventListener: ensureRTClient('removeConnectEventListener'),

  addConnectErrorEventListener   : ensureRTClient('addConnectErrorEventListener'),
  removeConnectErrorEventListener: ensureRTClient('removeConnectErrorEventListener'),

  addDisconnectEventListener   : ensureRTClient('addDisconnectEventListener'),
  removeDisconnectEventListener: ensureRTClient('removeDisconnectEventListener'),

  addReconnectAttemptEventListener   : ensureRTClient('addReconnectAttemptEventListener'),
  removeReconnectAttemptEventListener: ensureRTClient('removeReconnectAttemptEventListener'),

  removeConnectionListeners: ensureRTClient('removeConnectionListeners'),
}

export default RT