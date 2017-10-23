import Utils from '../utils'
import LocalVars from '../local-vars'
import { getCurrentUserToken } from '../users/current-user'

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
  const xhr = new LocalVars.XMLHttpRequest()
  const query = Utils.toQueryParams(config.query)
  const url = config.url + (query ? '?' + query : '')

  xhr.open(config.method, url, false)

  const userToken = getCurrentUserToken()

  if (userToken) {
    xhr.setRequestHeader('user-token', userToken)
  }

  if (config.form) {
    const formData = new FormData()

    for (const key in config.form) {
      const value = config.form[key]

      if (value) {
        formData.append(key, value)
      }
    }

    config.data = formData
  } else {
    const contentType = config.data ? 'application/json' : 'application/x-www-form-urlencoded'

    if (contentType === 'application/json' && config.data && typeof config.data !== 'string') {
      config.data = JSON.stringify(config.data)
    }

    xhr.setRequestHeader('Content-Type', contentType)
  }

  xhr.send(config.data)

  if (xhr.status >= 200 && xhr.status < 300) {
    return parseResponse(xhr)
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
