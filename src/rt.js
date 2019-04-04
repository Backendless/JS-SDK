import BackendlessRTClient from 'backendless-rt-client'

import Utils from './utils'

export const RTListeners = BackendlessRTClient.Listeners
export const RTScopeConnector = BackendlessRTClient.ScopeConnector

export default class RT extends BackendlessRTClient {
  constructor(backendless) {
    const { applicationId: appId, secretKey: apiKey, appPath, debugMode } = backendless

    const clientId = Utils.uuid()
    const lookupPath = `${appPath}/rt/lookup`
    const userToken = backendless.getCurrentUserToken()

    super({
      appId,
      lookupPath,
      debugMode,
      connectQuery() {
        return {
          apiKey,
          clientId,
          userToken,
        }
      }
    })

    this.backendless = backendless
  }

  updateUserTokenIfNeeded() {
    if (this.session) {
      const userToken = this.backendless.getCurrentUserToken()

      this.methods.setUserToken({ userToken })
    }
  }

  setDebugMode(debugMode) {
    this.setConfig({ debugMode })
  }
}