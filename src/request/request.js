import Request from 'backendless-request'

import { ajaxForBrowser } from './request-for-browser'

export function sendRequest(config) {
  const XMLHttpRequest = this.app.XMLHttpRequest
  const userToken = this.app.getCurrentUserToken()

  //--TODO remove this checking when we get rid of all sync methods
  if (config.isAsync === false || !config.asyncHandler) {
    if (XMLHttpRequest) {
      // eslint-disable-next-line no-console
      console.warn(
        'The sync methods of the Backendless API are deprecated and will be removed in the nearest future.\n' +
        'Please, use async methods instead.'
      )

      return ajaxForBrowser(XMLHttpRequest, config, userToken)
    }

    throw new Error(
      'Using the sync methods of the Backendless API in Node.js are disallowed.\n' +
      'Use the async methods instead.'
    )
  }
  //---------------------------------------------------------------

  Request.verbose = !!this.app.debugMode
  Request.XMLHttpRequest = XMLHttpRequest

  const url = config.url
  const method = (config.method || 'GET').toLowerCase()
  const headers = config.headers || {}
  const onError = config.asyncHandler.fault || function(error) {
    throw error
  }
  const onSuccess = config.asyncHandler.success || function(result) {
    return result
  }

  if (userToken) {
    headers['user-token'] = userToken
  }

  return Request[method](url, config.data)
    .set(headers)
    .query(config.query)
    .form(config.form)
    .then(onSuccess, onError)
}
