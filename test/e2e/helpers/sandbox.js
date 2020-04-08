import Request from 'backendless-request'
import { createClient } from 'backendless-console-sdk'
import { TablesAPI } from './tables'
import { wait } from './promise'
import * as Utils from './utils'

const Backendless = require('../../../lib')

const API_SERVER = process.env.API_SERVER || 'http://localhost:9000'
const CONSOLE_SERVER = process.env.CONSOLE_SERVER || 'http://localhost:3000'
const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || 'foo@foo.com'
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'secret'
const DESTROY_ALL_PREV_APPS = process.env.DESTROY_ALL_PREV_APPS === 'true'
const DESTROY_APP_AFTER_TEST = process.env.DESTROY_APP_AFTER_TEST !== 'false'
const PERSISTED_APP_ID = process.env.PERSISTED_APP_ID

const TEST_APP_NAME_PATTERN = /^test_.{32}$/

const persistedLocalDev = () => ({
  email: TEST_USER_EMAIL,
  pwd  : TEST_USER_PASSWORD
})

const destroyAllTestApps = (() => {
  let prevRequest = null

  return async api => {
    if (prevRequest) {
      return prevRequest
    }

    return prevRequest = Promise.resolve()
      .then(async () => {
        const apps = await api.apps.getApps()

        await Promise.all(apps.map(app => {
          if (TEST_APP_NAME_PATTERN.test(app.name)) {
            return api.apps.deleteApp(app.id)
          }
        }))
      })
  }
})()

const createDestroyer = sandbox => async () => {
  if (DESTROY_APP_AFTER_TEST) {
    await sandbox.api.apps.deleteApp(sandbox.app.id)
  }
}

const provideApp = api => {
  if (PERSISTED_APP_ID) {
    return {
      id: PERSISTED_APP_ID
    }
  }

  return api.apps.createApp({ appName: `test_${Utils.uid()}`, refCode: null })
}

const createSandbox = async api => {
  const app = {}
  const dev = persistedLocalDev()

  const sandbox = { app, api, dev }
  sandbox.destroy = createDestroyer(sandbox)

  const user = await api.user.login(dev.email, dev.pwd)

  dev.id = user.id
  dev.name = user.name
  dev.authKey = user.authKey

  if (DESTROY_ALL_PREV_APPS) {
    await destroyAllTestApps(api)
  }

  const createApp = await provideApp(api)

  Object.assign(app, createApp)

  const appSettings = await api.settings.getAppSettings(app.id)

  Object.assign(app, appSettings)

  return sandbox
}

const waitUntilAppIsConfigured = async app => {
  try {
    await Promise.all([
      Backendless.Data.of('Users').find(),
    ])

  } catch (e) {
    console.log('App is not ready yet', e)

    await wait(5000)

    await waitUntilAppIsConfigured(app)
  }

  app.ready = true
}

let mockRequests = []
const nativeRequestSend = Request.send

Request.send = function fakeRequestSend(path, method, headers, body, encoding) {
  const mockRequest = mockRequests.shift()

  if (!mockRequest) {
    return nativeRequestSend.call(Request, path, method, headers, body, encoding)
  }

  Object.assign(mockRequest, { path, method, headers, body, encoding })

  try {
    mockRequest.body = JSON.parse(body)
  } catch (e) {
    //
  }

  const responseFn = mockRequest.responseFn || Promise.resolve()

  return responseFn
    .then(response => {
      return Object.assign({ status: 200, body: undefined, headers: {} }, response)
    })
}

function prepareMockRequest(responseFn) {
  const mockRequest = {
    responseFn
  }

  mockRequests.push(mockRequest)

  return mockRequest
}

const createSandboxFor = each => () => {
  const beforeHook = each ? beforeEach : before
  const afterHook = each ? afterEach : after

  beforeEach(() => {
    mockRequests = []
  })

  beforeHook(function() {
    this.timeout(120000)
    this.consoleApi = createClient(CONSOLE_SERVER)
    this.tablesAPI = new TablesAPI(this)

    return createSandbox(this.consoleApi)
      .then(sandbox => {
        this.sandbox = sandbox
        this.dev = sandbox.dev
        this.app = sandbox.app

        Backendless.serverURL = API_SERVER
        Backendless.initApp(this.app.id, this.app.apiKeysMap.JS)
      })
      .then(() => Promise.race([waitUntilAppIsConfigured(this.app), wait(120000)]))
      .then(() => {
        if (!this.app.ready) {
          throw new Error('App was created with error!')
        }
      })
  })

  afterHook(function() {
    if (this.sandbox) {
      return this.sandbox.destroy()
    }
  })
}

export default {
  Backendless,
  prepareMockRequest,
  forTest : createSandboxFor(true),
  forSuite: createSandboxFor(false)
}
