import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

export function restorePassword(emailAddress /** async */) {
  if (!emailAddress) {
    throw new Error('emailAddress can not be empty')
  }

  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  return Request.get({
    url         : Urls.userRestorePassword(emailAddress),
    isAsync     : isAsync,
    asyncHandler: responder
  })
}
