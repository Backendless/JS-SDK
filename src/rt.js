import BackendlessRTClient from 'backendless-rt-client'

import { getCurrentUserToken } from './users/current-user'
import LocalVars from './local-vars'

let rtClient = null

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
    throw new Error(`"${target}" is not supported inside Business Logic.`)
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
    BackendlessRTClient.setConfig({ debugMode })
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
        userToken: getCurrentUserToken()
      }
    }
  })
}

export const updateRTUserTokenIfNeeded = () => {
  if (rtClient.session) {
    rtClient.methods.setUserToken({ userToken: getCurrentUserToken() })
  }
}

const addRTClientListener = method => (...args) => {
  if (rtClient) {
    rtClient[method](...args)
  }
}

const RT = {
  addConnectEventListener   : addRTClientListener('addConnectEventListener'),
  removeConnectEventListener: addRTClientListener('removeConnectEventListener'),

  addConnectErrorEventListener   : addRTClientListener('addConnectErrorEventListener'),
  removeConnectErrorEventListener: addRTClientListener('removeConnectErrorEventListener'),

  addDisconnectEventListener   : addRTClientListener('addDisconnectEventListener'),
  removeDisconnectEventListener: addRTClientListener('removeDisconnectEventListener'),

  addReconnectAttemptEventListener   : addRTClientListener('addReconnectAttemptEventListener'),
  removeReconnectAttemptEventListener: addRTClientListener('removeReconnectAttemptEventListener'),
}

export default RT