import Backendless from '../bundle'
import Utils from '../utils'
import Private from '../private'

Backendless._ajax_for_browser = function(config) {
  const cashingAllowedArr = [
    'cacheOnly', 'remoteDataOnly', 'fromCacheOrRemote', 'fromRemoteOrCache', 'fromCacheAndRemote']

  const   cacheMethods      = {
    ignoreCache       : function(config) {
      return sendRequest(config)
    },

    cacheOnly         : function(config) {
      let cachedResult = Backendless.LocalCache.get(config.url.replace(/([^A-Za-z0-9])/g, '')),
          cacheError   = {
            message   : 'error: cannot find data in Backendless.LocalCache',
            statusCode: 404
          }
      if (cachedResult) {
        config.isAsync && config.asyncHandler.success(cachedResult)
        return cachedResult
      } else {
        if (config.isAsync) {
          config.asyncHandler.fault(cacheError)
        } else {
          throw cacheError
        }
      }
    },

    remoteDataOnly    : function(config) {
      return sendRequest(config)
    },

    fromCacheOrRemote : function(config) {
      const cachedResult = Backendless.LocalCache.get(config.url.replace(/([^A-Za-z0-9])/g, ''))

      if (cachedResult) {
        config.isAsync && config.asyncHandler.success(cachedResult)
        return cachedResult
      } else {
        return sendRequest(config)
      }
    },

    fromRemoteOrCache : function(config) {
      return sendRequest(config)
    },

    fromCacheAndRemote: function(config) {
      let result       = {},
          cachedResult = Backendless.LocalCache.get(config.url.replace(/([^A-Za-z0-9])/g, '')),
          cacheError   = {
            message   : 'error: cannot find data in Backendless.LocalCache',
            statusCode: 404
          }

      result.remote = sendRequest(config)

      if (cachedResult) {
        config.isAsync && config.asyncHandler.success(cachedResult)
        result.local = cachedResult
      } else {
        if (config.isAsync) {
          config.asyncHandler.fault(cacheError)
        } else {
          throw cacheError
        }
      }

      return result
    }
  }

  const sendRequest       = function(config) {
    let xhr         = new Backendless.XMLHttpRequest(),
        contentType = config.data ? 'application/json' : 'application/x-www-form-urlencoded',
        response

    const parseResponse = function(xhr) {
      let result = true

      if (xhr.responseText) {
        result = Utils.tryParseJSON(xhr.responseText)
      }

      return result
    }

    const badResponse = function(xhr) {
      let result = {}

      try {
        result = JSON.parse(xhr.responseText)
      } catch (e) {
        result.message = xhr.responseText
      }

      result.statusCode = xhr.status
      result.message = result.message || 'unknown error occurred'

      return result
    }

    const cacheHandler = function(response) {
      response = Utils.cloneObject(response)
      if (config.method === 'GET' && config.cacheActive) {
        response.cachePolicy = config.cachePolicy
        Backendless.LocalCache.set(config.urlBlueprint, response)
      } else if (Backendless.LocalCache.exists(config.urlBlueprint)) {
        if (response === true || config.method === 'DELETE') {
          response = undefined
        } else {
          response.cachePolicy = Backendless.LocalCache.getCachePolicy(config.urlBlueprint)
        }
        '___class' in response && delete response['___class']  // this issue must be fixed on server side

        Backendless.LocalCache.set(config.urlBlueprint, response)
      }
    }

    const checkInCache = function() {
      return config.cacheActive
        && config.cachePolicy.policy === 'fromRemoteOrCache'
        && Backendless.LocalCache.exists(config.urlBlueprint)
    }

    xhr.open(config.method, config.url, config.isAsync)
    xhr.setRequestHeader('Content-Type', contentType)

    if ((Private.getCurrentUser() != null && Private.getCurrentUser()['user-token'])) {
      xhr.setRequestHeader('user-token', Private.getCurrentUser()['user-token'])
    } else if (Backendless.LocalCache.exists('user-token')) {
      xhr.setRequestHeader('user-token', Backendless.LocalCache.get('user-token'))
    }

    if (Private.getUIState() !== null) {
      xhr.setRequestHeader('uiState', Private.getUIState())
    }

    if (config.isAsync) {
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status) {
          if (xhr.status >= 200 && xhr.status < 300) {
            response = parseResponse(xhr)
            cacheHandler(response)
            config.asyncHandler.success && config.asyncHandler.success(response)
          } else if (checkInCache()) {
            config.asyncHandler.success && config.asyncHandler.success(Backendless.LocalCache.get(config.urlBlueprint))
          } else {
            config.asyncHandler.fault && config.asyncHandler.fault(badResponse(xhr))
          }
        }
      }

      if (config.asyncHandler.fault) {
        xhr.onerror = Utils.onHttpRequestErrorHandler(xhr, config.asyncHandler.fault, badResponse)
      }
    }

    xhr.send(config.data)

    if (config.isAsync) {
      return xhr
    } else if (xhr.status >= 200 && xhr.status < 300) {
      response = parseResponse(xhr)
      cacheHandler(response)
      return response
    } else if (checkInCache()) {
      return Backendless.LocalCache.get(config.urlBlueprint)
    } else {
      throw badResponse(xhr)
    }
  }

  config.method = config.method || 'GET'
  config.cachePolicy = config.cachePolicy || { policy: 'ignoreCache' }
  config.isAsync = (typeof config.isAsync === 'boolean') ? config.isAsync : false
  config.cacheActive = (config.method === 'GET') && (cashingAllowedArr.indexOf(config.cachePolicy.policy) !== -1)
  config.urlBlueprint = config.url.replace(/([^A-Za-z0-9])/g, '')

  try {
    return cacheMethods[config.cachePolicy.policy].call(this, config)
  } catch (error) {
    throw error
  }
}

Backendless._ajax_for_nodejs = function(config) {
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

Backendless._ajax = function(config) {
  return Backendless.XMLHttpRequest ? Backendless._ajax_for_browser(config) : Backendless._ajax_for_nodejs(config)
}
