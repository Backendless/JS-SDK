import Utils from '../utils'

export function logout(/** async */) {
  const context = this

  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder
  const errorCallback = isAsync ? responder.fault : null
  const successCallback = isAsync ? responder.success : null

  let result = {}

  const logoutUser = () => {
    context.app.LocalCache.remove('user-token')
    context.app.LocalCache.remove('current-user-id')
    context.app.LocalCache.remove('stayLoggedIn')

    context.setLocalCurrentUser(null)
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
    result = this.app.request.get({
      url         : this.app.urls.userLogout(),
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

