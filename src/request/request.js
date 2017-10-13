import Backendless from '../bundle'
import { ajaxForBrowser } from './request-for-browser'

Backendless._ajax = function(config) {
  //--TODO remove this checking when we get rid of all sync methods
  if (config.isAsync === false || !config.asyncHandler) {
    if (Backendless.XMLHttpRequest) {
      console.warn(
        'The sync methods of the Backendless API are deprecated and will be removed in the nearest future.\n' +
        'Please, use async methods instead.'
      )

      return ajaxForBrowser(config)
    }

    throw new Error(
      'Using the sync methods of the Backendless API in Node.js are disallowed.\n' +
      'Use the async methods instead.'
    )
  }
  //---------------------------------------------------------------

  Backendless.Request.XMLHttpRequest = Backendless.XMLHttpRequest

  const url = config.url
  const method = (config.method || 'GET').toLowerCase()
  const headers = config.headers || {}
  const onError = config.asyncHandler.fault || function(error) { throw error }
  const onSuccess = config.asyncHandler.success || function(result) { return result }

  const userToken = Backendless.getUserToken()

  if (userToken) {
    headers['user-token'] = userToken
  }

  return Backendless.Request[method](url, config.data)
    .set(headers)
    .query(config.query)
    .form(config.form)
    .then(onSuccess, onError)
}
