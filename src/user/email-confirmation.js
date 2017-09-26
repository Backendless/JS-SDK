import Backendless from '../bundle'
import Utils from '../utils'
import Async from '../request/async'
import Urls from '../urls'

export function resendEmailConfirmation(emailAddress /** async */) {
  if (!emailAddress || emailAddress instanceof Async) {
    throw new Error('Email cannot be empty')
  }

  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  return Backendless._ajax({
    method      : 'POST',
    url         : Urls.userResendConfirmation(emailAddress),
    isAsync     : isAsync,
    asyncHandler: responder
  })
}
