import BackendlessRTClient from 'backendless-rt-client'

import Utils from './utils'

export const RTListeners = BackendlessRTClient.Listeners
export const RTScopeConnector = BackendlessRTClient.ScopeConnector

export default class RT extends BackendlessRTClient {
  constructor(app) {
    const { appId, apiKey, debugMode } = app

    const clientId = Utils.uuid()

    super({
      appId: appId || undefined,
      debugMode,
      connectQuery() {
        const userToken = app.getCurrentUserToken()

        return {
          apiKey: apiKey || undefined,
          clientId,
          userToken,
        }
      },

      hostResolver(){
        return app.appInfoPromise().then(({ rtURL }) => rtURL)
      },

      socketConfigTransform: async socketConfig => {
        if (!appId) {
          const appInfo = await app.appInfoPromise()
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
