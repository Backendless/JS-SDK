import Backendless from '../bundle'
import Utils from '../utils'
import Private from '../private'

const parseResponse = xhr => {
  let result = true

  if (xhr.responseText) {
    result = Utils.tryParseJSON(xhr.responseText)
  }

  return result
}

const badResponse = xhr => {
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

const checkInCache = config => {
  return config.cacheActive
    && config.cachePolicy.policy === 'fromRemoteOrCache'
    && Backendless.LocalCache.exists(config.urlBlueprint)
}

const sendRequest = config => {
  const xhr = new Backendless.XMLHttpRequest()
  const contentType = config.data ? 'application/json' : 'application/x-www-form-urlencoded'
  let response

  const cacheHandler = resp => {
    resp = Utils.cloneObject(resp)
    if (config.method === 'GET' && config.cacheActive) {
      resp.cachePolicy = config.cachePolicy
      Backendless.LocalCache.set(config.urlBlueprint, resp)
    } else if (Backendless.LocalCache.exists(config.urlBlueprint)) {
      if (resp === true || config.method === 'DELETE') {
        resp = undefined
      } else {
        resp.cachePolicy = Backendless.LocalCache.getCachePolicy(config.urlBlueprint)
      }
      '___class' in resp && delete resp['___class']  // this issue must be fixed on server side

      Backendless.LocalCache.set(config.urlBlueprint, resp)
    }
  }

  xhr.open(config.method, config.url, config.isAsync)
  xhr.setRequestHeader('Content-Type', contentType)

  const currentUser = Private.getCurrentUser()

  if ((currentUser && currentUser['user-token'])) {
    xhr.setRequestHeader('user-token', currentUser['user-token'])
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

        } else if (checkInCache(config)) {
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
  }

  if (xhr.status >= 200 && xhr.status < 300) {
    response = parseResponse(xhr)
    cacheHandler(response)
    return response
  }

  if (checkInCache(config)) {
    return Backendless.LocalCache.get(config.urlBlueprint)
  }

  throw badResponse(xhr)
}

//TODO: refactor me
//TODO: use Backendless Request package instead
export function ajaxForBrowser(config) {
  const cashingAllowedArr = [
    'cacheOnly', 'remoteDataOnly', 'fromCacheOrRemote', 'fromRemoteOrCache', 'fromCacheAndRemote']

  const cacheMethods = {
    ignoreCache: function(config) {
      return sendRequest(config)
    },

    cacheOnly: function(config) {
      const cachedResult = Backendless.LocalCache.get(config.url.replace(/([^A-Za-z0-9])/g, ''))

      const cacheError = {
        message   : 'error: cannot find data in Backendless.LocalCache',
        statusCode: 404
      }

      if (cachedResult) {
        if (config.isAsync) {
          config.asyncHandler.success(cachedResult)
        }

        return cachedResult
      }

      if (config.isAsync) {
        config.asyncHandler.fault(cacheError)
      } else {
        throw cacheError
      }
    },

    remoteDataOnly: function(config) {
      return sendRequest(config)
    },

    fromCacheOrRemote: function(config) {
      const cachedResult = Backendless.LocalCache.get(config.url.replace(/([^A-Za-z0-9])/g, ''))

      if (cachedResult) {
        config.isAsync && config.asyncHandler.success(cachedResult)
        return cachedResult
      } else {
        return sendRequest(config)
      }
    },

    fromRemoteOrCache: function(config) {
      return sendRequest(config)
    },

    fromCacheAndRemote: function(config) {
      const result = {}
      const cachedResult = Backendless.LocalCache.get(config.url.replace(/([^A-Za-z0-9])/g, ''))
      const cacheError = {
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
