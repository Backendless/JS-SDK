import { performance } from 'perf_hooks'
import Request from 'backendless-request'
import RTClient from 'backendless-rt-client'

import { it } from 'mocha'
import chai from 'chai'
import spies from 'chai-spies'

import '../../helpers/global'
import Utils from '../../helpers/utils'

import { SERVER_URL, APP_ID, API_KEY, APP_PATH, CUSTOM_DOMAIN } from './contants'
import { createMockRTServer } from './rt'

import Backendless from '../../../src'

global.chai = chai

chai.use(spies)

process.title = 'UnitTestsWorker'

const performanceTest = async ({ title, testFn, iterations, limit }) => {
  const measures = {
    min: Infinity,
    max: -Infinity,
    avg: 0,
    sum: 0
  }

  for (let i = 0; i < iterations; i++) {
    const start = performance.now()

    await testFn()

    const end = performance.now()

    const duration = end - start

    measures.sum = measures.sum + duration

    measures.min = Math.min(measures.min, duration)
    measures.max = Math.max(measures.max, duration)
  }

  measures.avg = measures.sum / iterations

  console.log(`${title}; ${iterations} iterations; min:${measures.min}; max:${measures.max}; avg:${measures.avg};`)

  if (measures.avg > limit) {
    throw new Error(`It takes too long; expected less than ${limit}, but it took ${measures.avg}`)
  }
}

function setupPerformanceTestsEnv() {
  if (!it.performance) {
    it.performance = (title, testFn, { iterations = 24000, limit = 0.20 }) => {
      it(title, async function() {
        this.timeout(15000)

        await performanceTest({ title, testFn, iterations, limit })
      })
    }

    xit.performance = title => {
      xit(title, async function() {
      })
    }
  }
}

export {
  Utils,
  SERVER_URL,
  APP_ID,
  API_KEY,
  APP_PATH,
  CUSTOM_DOMAIN,
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
  setupPerformanceTestsEnv()

  const beforeHook = each ? beforeEach : before

  if (context) {
    context.timeout(10000)
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


