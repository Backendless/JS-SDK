import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'
import Async from '../request/async'

import User from './user'

export function register(user /** async */) {
  const responder = Utils.extractResponder(arguments)

  const isAsync = !!responder

  const result = Request.post({
    url         : Urls.userRegister(),
    isAsync     : isAsync,
    asyncHandler: responder && wrapAsync(responder),
    data        : enrichWithLocaleInfo(user)
  })

  return isAsync ? result : parseResponse(result)
}

function enrichWithLocaleInfo(user) {
  if (!user.blUserLocale) {
    const clientUserLocale = getClientUserLocale()

    if (clientUserLocale) {
      user.blUserLocale = clientUserLocale
    }
  }

  return user
}

function getClientUserLocale() {
  if (typeof navigator === 'undefined') {
    return
  }

  let language = ''

  if (navigator.languages && navigator.languages.length) {
    language = navigator.languages[0]
  } else {
    language = navigator.userLanguage
      || navigator.language
      || navigator.browserLanguage
      || navigator.systemLanguage
      || ''
  }

  return language.slice(0, 2).toLowerCase()
}

function parseResponse(data) {
  return Utils.deepExtend(new User(), data)
}

function wrapAsync(asyncHandler) {
  const onSuccess = data => asyncHandler.success(parseResponse(data))
  const onError = error => asyncHandler.fault(error)

  return new Async(onSuccess, onError)
}
