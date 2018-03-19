import Utils from '../../utils'
import Urls from '../../urls'
import Request from '../../request'

export function pushWithTemplate(templateName) {
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  if (!templateName || !Utils.isString(templateName)) {
    throw new Error('Push Template Name must be non empty string!')
  }

  return Request.post({
    url         : Urls.messagingPushWithTemplate(templateName),
    isAsync     : isAsync,
    asyncHandler: responder
  })
}
