const { generateDev, generateApp } = require('backendless-app-generator')
import { createClient } from 'backendless-console-sdk'
import Backendless from '../../../libs/backendless'

const destroySandbox = (consoleApi, sandbox) => () => {
  return Promise.resolve()
    .then(() => consoleApi.apps.deleteApp(sandbox.app.id))
    .then(() => consoleApi.user.suicide())
}

export const createSandbox = (consoleApi, options = {}) => {
  const sandbox = {}

  sandbox.destroy = destroySandbox(consoleApi, sandbox)

  return Promise.resolve()
    .then(() => generateDev(consoleApi, { autoLogin: true, ...(options.dev || {}) }))
    .then(dev => sandbox.dev = dev)
    .then(() => console.log('dev generated'))
    .then(() => generateApp(consoleApi, options.app || {}))
    .then(app => sandbox.app = app)
    .then(() => consoleApi.settings.getAppSettings(sandbox.app.id))
    .then(settings => sandbox.app = ({ ...settings, ...sandbox.app }))
    .then(() => sandbox)
}

export const createSuiteSandbox = (serverUrl, options, context) => {

  before(function() {
    context.timeout(15000)
    context.consoleApi = createClient(serverUrl)

    return createSandbox(context.consoleApi, options).then(sandbox => {
      context.sandbox = sandbox
      context.dev = sandbox.dev
      context.app = sandbox.app

      Backendless.serverURL = serverUrl
      Backendless.initApp(context.app.id, context.app.devices.JS)
    })
  })

  after(function() {
    context.timeout(5000)

    if (context.sandbox) {
      context.sandbox.destroy()
    }
  })
}