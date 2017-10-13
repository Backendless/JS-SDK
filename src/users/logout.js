import Backendless from '../bundle'
import Utils from '../utils'
import Private from '../private'
import Urls from '../urls'
import Request from '../request'

export function logout(/** async */) {
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder
  const errorCallback = isAsync ? responder.fault : null
  const successCallback = isAsync ? responder.success : null
  let result = {}

  const logoutUser = () => {
    Backendless.LocalCache.remove('user-token')
    Backendless.LocalCache.remove('current-user-id')
    Backendless.LocalCache.remove('stayLoggedIn')
    Private.setCurrentUser(null)
  }

  const onLogoutSuccess = () => {
    logoutUser()
    if (Utils.isFunction(successCallback)) {
      successCallback()
    }
  }

  const onLogoutError = e => {
    if (Utils.isObject(e) && [3064, 3091, 3090, 3023].indexOf(e.code) !== -1) {
      logoutUser()
    }
    if (Utils.isFunction(errorCallback)) {
      errorCallback(e)
    }
  }

  if (responder) {
    responder.fault = onLogoutError
    responder.success = onLogoutSuccess
  }

  try {
    result = Request.get({
      url         : Urls.userLogout(),
      isAsync     : isAsync,
      asyncHandler: responder
    })
  } catch (e) {
    onLogoutError(e)
  }

  if (isAsync) {
    return result
  } else {
    logoutUser()
  }
}

