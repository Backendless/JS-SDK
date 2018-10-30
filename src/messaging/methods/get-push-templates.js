import Urls from '../../urls'
import Request from '../../request'

export function getPushTemplates(asyncHandler) {
  return Request.get({
    url         : Urls.messagingPushTemplates(),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
