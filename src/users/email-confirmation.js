import Utils from '../utils'
import Async from '../request/async'

export function resendEmailConfirmation(emailAddress /** async */) {
  if (!emailAddress || emailAddress instanceof Async) {
    throw new Error('Email cannot be empty')
  }

  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  return this.backendless.request.post({
    url         : this.backendless.urls.userResendConfirmation(emailAddress),
    isAsync     : isAsync,
    asyncHandler: responder
  })
}
