import BackendlessRTClient from 'backendless-rt-client'

import { getCurrentUserToken } from './users/current-user'
import LocalVars from './local-vars'

export const RTProvider = BackendlessRTClient.Provider
export const RTListeners = BackendlessRTClient.Listeners
export const RTScopeConnector = BackendlessRTClient.ScopeConnector

export const setRTDebugMode = debugMode => BackendlessRTClient.Config.set({ debugMode })

export const initRTClient = () => {
  BackendlessRTClient.Provider.init({
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
  if (BackendlessRTClient.Provider.socketPromise) {
    BackendlessRTClient.Provider.methods.setUserToken({ userToken: getCurrentUserToken() })
  }
}

const RT = {
  addConnectEventListener   : BackendlessRTClient.Provider.addConnectEventListener,
  removeConnectEventListener: BackendlessRTClient.Provider.removeConnectEventListener,

  addConnectErrorEventListener   : BackendlessRTClient.Provider.addConnectErrorEventListener,
  removeConnectErrorEventListener: BackendlessRTClient.Provider.removeConnectErrorEventListener,

  addDisconnectEventListener   : BackendlessRTClient.Provider.addDisconnectEventListener,
  removeDisconnectEventListener: BackendlessRTClient.Provider.removeDisconnectEventListener,

  addReconnectAttemptEventListener   : BackendlessRTClient.Provider.addReconnectAttemptEventListener,
  removeReconnectAttemptEventListener: BackendlessRTClient.Provider.removeReconnectAttemptEventListener,
}

export default RT