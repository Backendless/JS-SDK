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

const sendRequest = config => {
  const xhr = new Backendless.XMLHttpRequest()
  const contentType = config.data ? 'application/json' : 'application/x-www-form-urlencoded'
  let response

  xhr.open(config.method, config.url, config.isAsync)
  xhr.setRequestHeader('Content-Type', contentType)

  const userToken = Private.getUserToken()

  if (userToken) {
    xhr.setRequestHeader('user-token', userToken)
  }

  if (config.isAsync) {
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status) {
        if (xhr.status >= 200 && xhr.status < 300) {
          response = parseResponse(xhr)
          config.asyncHandler.success && config.asyncHandler.success(response)

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

    return response
  }

  throw badResponse(xhr)
}

export function ajaxForBrowser(config) {
  config.method = config.method || 'GET'
  config.isAsync = (typeof config.isAsync === 'boolean') ? config.isAsync : false

  try {
    return sendRequest(config)
  } catch (error) {
    throw error
  }
}
