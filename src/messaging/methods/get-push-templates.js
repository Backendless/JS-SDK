import Urls from '../../urls'
import Request from '../../request'

export function getPushTemplates(deviceType, asyncHandler) {
  return Request.get({
    url         : Urls.messagingPushTemplates(deviceType),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
