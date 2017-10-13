import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

export function restorePassword(emailAddress /** async */) {
  if (!emailAddress) {
    throw new Error('emailAddress can not be empty')
  }

  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  return Backendless._ajax({
    method      : 'GET',
    url         : Urls.userRestorePassword(emailAddress),
    isAsync     : isAsync,
    asyncHandler: responder
  })
}
