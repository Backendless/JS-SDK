const { generateDev, generateApp } = require('backendless-app-generator')
import { createClient } from 'backendless-console-sdk'
import Backendless from '../../../libs/backendless'

const destroySandbox = (consoleApi, sandbox) => () => {
  return Promise.resolve()
    .then(() => consoleApi.apps.deleteApp(sandbox.app.id))
    .then(() => consoleApi.user.suicide())
}

const createSandbox = (consoleApi, options = {}) => {
  const sandbox = {}

  sandbox.destroy = destroySandbox(consoleApi, sandbox)

  return Promise.resolve()
    .then(() => generateDev(consoleApi, { autoLogin: true, ...(options.dev || {}) }))
    .then(dev => sandbox.dev = dev)
    .then(() => generateApp(consoleApi, options.app || {}))
    .then(app => sandbox.app = app)
    .then(() => consoleApi.settings.getAppSettings(sandbox.app.id))
    .then(settings => sandbox.app = ({ ...settings, ...sandbox.app }))
    .then(() => sandbox)
}

const serverUrl = process.env.API_SERVER

const createSandboxForSuite = options => {

  before(function() {
    this.timeout(15000)
    this.consoleApi = createClient(serverUrl)

    return createSandbox(this.consoleApi, options).then(sandbox => {
      this.sandbox = sandbox
      this.dev = sandbox.dev
      this.app = sandbox.app

      Backendless.serverURL = serverUrl
      Backendless.initApp(this.app.id, this.app.devices.JS)
    })
  })

  after(function() {
    this.timeout(5000)

    if (this.sandbox) {
      return this.sandbox.destroy()
    }
  })
}

export default {
  create  : createSandbox,
  forSuite: createSandboxForSuite
}