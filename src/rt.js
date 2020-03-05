import BackendlessRTClient from 'backendless-rt-client'

import Utils from './utils'

export const RTListeners = BackendlessRTClient.Listeners
export const RTScopeConnector = BackendlessRTClient.ScopeConnector

export default class RT extends BackendlessRTClient {
  constructor(app) {
    const { applicationId: appId, secretKey: apiKey, appPath, debugMode } = app

    const clientId = Utils.uuid()
    const lookupPath = `${appPath}/rt/lookup`

    super({
      appId,
      lookupPath,
      debugMode,
      connectQuery() {
        const userToken = app.getCurrentUserToken()

        return {
          apiKey,
          clientId,
          userToken,
        }
      }
    })

    this.app = app
  }

  updateUserTokenIfNeeded() {
    if (this.session) {
      const userToken = this.app.getCurrentUserToken()

      this.methods.setUserToken({ userToken })
    }
  }

  setDebugMode(debugMode) {
    this.setConfig({ debugMode })
  }
}