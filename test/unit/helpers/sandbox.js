import Request from 'backendless-request'
import RTClient from 'backendless-rt-client'

import chai from 'chai'
import spies from 'chai-spies'

import '../../helpers/global'
import Utils from '../../helpers/utils'

import { SERVER_URL, APP_ID, API_KEY, APP_PATH } from './contants'
import { createMockRTServer } from './rt'

import Backendless from '../../../src'

global.chai = chai

chai.use(spies)

process.title = 'UnitTestsWorker'

export {
  Utils,
  SERVER_URL,
  APP_ID,
  API_KEY,
  APP_PATH,
  createMockRTServer,
}

let mockRequests = []

wrapRequest(Request)
wrapRequest(RTClient.Request)

function wrapRequest(R) {
  const nativeRequestSend = R.send

  R.send = function fakeRequestSend(path, method, headers, body, encoding) {
    const mockRequest = mockRequests.shift()

    if (!mockRequest) {
      return nativeRequestSend.call(R, path, method, headers, body, encoding)
    }

    Object.assign(mockRequest, { path, method, headers, body, encoding })

    try {
      mockRequest.body = JSON.parse(body)
    } catch (e) {
      //
    }

    return Promise.resolve()
      .then(mockRequest.responseFn)
      .then(({ delay, ...response }) => {
        return delay ? Utils.wait(delay).then(() => response) : response
      })
      .then(response => {
        return Object.assign({ status: 200, body: undefined, headers: {} }, response)
      })
  }
}

export function prepareMockRequest(responseFn) {
  const mockRequest = {
    responseFn: typeof responseFn === 'function'
      ? responseFn
      : () => ({ body: responseFn })
  }

  mockRequests.push(mockRequest)

  return mockRequest
}

export function initApp() {
  Backendless.initApp(APP_ID, API_KEY)
}

const createSandboxFor = each => context => {
  const beforeHook = each ? beforeEach : before

  if (context) {
    context.timeout(5000)
  }

  beforeEach(function() {
    mockRequests = []
  })

  beforeHook(() => {
    Backendless.serverURL = SERVER_URL
    Backendless.initApp(APP_ID, API_KEY)
  })
}

export const forTest = createSandboxFor(true)
export const forSuite = createSandboxFor(false)

export default Backendless
