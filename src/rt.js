import Request from 'backendless-request'
import BackendlessRTClient from 'backendless-rt-client'

import Utils from './utils'

export const RTListeners = BackendlessRTClient.Listeners
export const RTScopeConnector = BackendlessRTClient.ScopeConnector

function loadAppInfo(appPath) {
  return Request.get(`${appPath}/info`)
}

export default class RT extends BackendlessRTClient {
  constructor(app) {
    const { appId, apiKey, appPath, debugMode } = app

    const clientId = Utils.uuid()
    const lookupPath = `${appPath}/rt/lookup`

    super({
      appId: appId || undefined,
      lookupPath,
      debugMode,
      connectQuery() {
        const userToken = app.getCurrentUserToken()

        return {
          apiKey: apiKey || undefined,
          clientId,
          userToken,
        }
      },

      socketConfigTransform: async socketConfig => {
        if (!appId) {
          const appInfo = await loadAppInfo(appPath)

          socketConfig.url = `${socketConfig.host}/${appInfo.appId}`
          socketConfig.options.path = `/${appInfo.appId}`
          socketConfig.options.query.apiKey = appInfo.apiKey
        }

        return socketConfig
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
