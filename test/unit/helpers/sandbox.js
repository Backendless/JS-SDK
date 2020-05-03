import Request from 'backendless-request'
import chai from 'chai'
import spies from 'chai-spies'

import '../../helpers/global'
import Utils from '../../helpers/utils'

import Backendless from '../../../src'

global.chai = chai

chai.use(spies)

export {
  Utils
}

export const SERVER_URL = 'http://foo.bar'
export const APP_ID = 'A98AF58F-1111-2222-3333-6A88FD113200'
export const API_KEY = 'ACC8DAE2-1111-2222-3333-64439E5D3300'

export const APP_PATH = `${SERVER_URL}/${APP_ID}/${API_KEY}`

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

  return Promise.resolve()
    .then(mockRequest.responseFn)
    .then(({ delay, ...response }) => {
      return delay ? Utils.wait(delay).then(() => response) : response
    })
    .then(response => {
      return Object.assign({ status: 200, body: undefined, headers: {} }, response)
    })
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

const createSandboxFor = each => () => {
  const beforeHook = each ? beforeEach : before

  beforeEach(() => {
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
