import Utils from '../utils'

export function restorePassword(emailAddress /** async */) {
  if (!emailAddress) {
    throw new Error('emailAddress can not be empty')
  }

  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  return this.backendless.request.get({
    url         : this.backendless.urls.userRestorePassword(emailAddress),
    isAsync     : isAsync,
    asyncHandler: responder
  })
}
