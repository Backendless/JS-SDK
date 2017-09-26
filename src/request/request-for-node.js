import Backendless from '../bundle'
import Utils from '../utils'
import Private from '../private'

//TODO: refactor me
//TODO: use Backendless Request package instead
export function ajaxForNode(config) {
  config.data = config.data || ''
  config.asyncHandler = config.asyncHandler || {}
  config.isAsync = (typeof config.isAsync === 'boolean') ? config.isAsync : false

  if (!config.isAsync) {
    throw new Error(
      'Using the sync methods of the Backendless API in Node.js is disallowed. ' +
      'Use the async methods instead.'
    )
  }

  if (typeof config.data !== 'string') {
    config.data = JSON.stringify(config.data)
  }

  const u = require('url').parse(config.url)
  const https = u.protocol === 'https:'

  const options = {
    host   : u.hostname,
    port   : u.port || (https ? 443 : 80),
    method : config.method || 'GET',
    path   : u.path,
    headers: {
      'Content-Length': config.data ? Buffer.byteLength(config.data) : 0,
      'Content-Type'  : config.data ? 'application/json' : 'application/x-www-form-urlencoded'
    }
  }

  if (Private.getCurrentUser() && Private.getCurrentUser()['user-token']) {
    options.headers['user-token'] = Private.getCurrentUser()['user-token']
  } else if (Backendless.LocalCache.exists('user-token')) {
    options.headers['user-token'] = Backendless.LocalCache.get('user-token')
  }

  let buffer
  const httpx = require(https ? 'https' : 'http')

  const req = httpx.request(options, function(res) {
    res.setEncoding('utf8')

    res.on('data', function(chunk) {
      buffer = buffer ? buffer + chunk : chunk
    })

    res.on('end', function() {
      const callback = config.asyncHandler[res.statusCode >= 200 && res.statusCode < 300 ? 'success' : 'fault']

      if (Utils.isFunction(callback)) {
        const contentType = res.headers['content-type']

        if (buffer !== undefined && contentType /*&& contentType.indexOf('application/json') !== -1*/) {
          buffer = Utils.tryParseJSON(buffer)
        }

        callback(buffer)
      }
    })
  })

  req.on('error', function(e) {
    config.asyncHandler.fault && config.asyncHandler.fault(e)
  })

  req.write(config.data)

  return req.end()
}
