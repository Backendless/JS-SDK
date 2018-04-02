import { createClient } from 'backendless-console-sdk'
// import Backendless from '../../../src/backendless'
const Backendless = require('../../../lib')

const chr4 = () => Math.random().toString(16).slice(-4)
const chr8 = () => `${chr4()}${chr4()}`
const uid = () => `${chr8()}${chr8()}${chr8()}${chr8()}`

const generateDev = () => ({
  firstName: 'Test',
  lastName : 'Test',
  email    : `${uid()}@test`,
  pwd      : uid()
})

const generateApp = () => ({
  name: `test_${uid()}`
})

const createDestroyer = sandbox => () =>
  Promise.resolve()
    .then(() => sandbox.api.apps.deleteApp(sandbox.app.id))
    .then(() => sandbox.api.user.suicide())

const createSandbox = api => {
  const app = generateApp()
  const dev = generateDev()

  const sandbox = { app, api, dev }
  sandbox.destroy = createDestroyer(sandbox)

  return Promise.resolve()
    .then(() => api.user.register(dev))
    .then(result => dev.id = result.id)

    .then(() => api.user.login(dev.email, dev.pwd))
    .then(({ authKey }) => dev.authKey = authKey)

    .then(() => api.apps.createApp({ appName: app.name, refCode: null }))
    .then(result => Object.assign(app, result))

    .then(() => api.settings.getAppSettings(app.id))
    .then(appSettings => Object.assign(app, appSettings))

    .then(() => sandbox)
}

const apiServerURL = process.env.API_SERVER || 'http://localhost:9000'
const consoleServerURL = process.env.CONSOLE_SERVER || 'http://localhost:3000'

const createSandboxFor = each => () => {
  const beforeHook = each ? beforeEach : before
  const afterHook = each ? afterEach : after

  beforeHook(function() {
    this.timeout(120000)
    this.consoleApi = createClient(consoleServerURL)

    return createSandbox(this.consoleApi).then(sandbox => {
      this.sandbox = sandbox
      this.dev = sandbox.dev
      this.app = sandbox.app

      Backendless.serverURL = apiServerURL
      Backendless.initApp(this.app.id, this.app.devices.JS)
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