import { createClient } from 'backendless-console-sdk'
import { TablesAPI } from './tables'
import { wait } from './promise'
import * as Utils from './utils'
// import Backendless from '../../../src/backendless'
const Backendless = require('../../../lib')

const DESTROY_ALL_PREV_APPS = process.env.DESTROY_ALL_PREV_APPS === 'true'
const API_SERVER = process.env.API_SERVER || 'http://localhost:9000'
const CONSOLE_SERVER = process.env.CONSOLE_SERVER || 'http://localhost:3000'
const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || 'foo@foo.com'
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'secret'

const TEST_APP_NAME_PATTERN = /^test_.{32}$/

const USE_PERSISTED_LOCAL_DEV = true
const DESTROY_APP_AFTER_TEST = false

const generateDev = () => ({
  firstName: 'Test',
  lastName : 'Test',
  email    : `${Utils.uid()}@test`,
  pwd      : Utils.uid()
})

const persistedLocalDev = () => ({
  email: TEST_USER_EMAIL,
  pwd  : TEST_USER_PASSWORD
})

const generateApp = () => ({
  name: `test_${Utils.uid()}`
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
  if (DESTROY_APP_AFTER_TEST || !USE_PERSISTED_LOCAL_DEV) {
    await sandbox.api.apps.deleteApp(sandbox.app.id)
  }

  if (!USE_PERSISTED_LOCAL_DEV) {
    await sandbox.api.user.suicide()
  }
}

const createSandbox = async api => {
  const app = generateApp()
  const dev = USE_PERSISTED_LOCAL_DEV
    ? persistedLocalDev()
    : generateDev()

  const sandbox = { app, api, dev }
  sandbox.destroy = createDestroyer(sandbox)

  if (!USE_PERSISTED_LOCAL_DEV) {
    await Promise.resolve()
      .then(() => api.user.register(dev))
      .then(result => dev.id = result.id)
  }

  const user = await api.user.login(dev.email, dev.pwd)

  dev.id = user.id
  dev.name = user.name
  dev.authKey = user.authKey

  if (DESTROY_ALL_PREV_APPS && USE_PERSISTED_LOCAL_DEV) {
    await destroyAllTestApps(api)
  }

  const createApp = await api.apps.createApp({ appName: app.name, refCode: null })

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

const createSandboxFor = each => () => {
  const beforeHook = each ? beforeEach : before
  const afterHook = each ? afterEach : after

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
  forTest : createSandboxFor(true),
  forSuite: createSandboxFor(false)
}
