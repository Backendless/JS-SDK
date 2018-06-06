import Urls from '../../urls'
import Device from '../../device'
import Request from '../../request'

export function getRegistrations(asyncHandler) {
  const device = Device.required()

  return Request.get({
    url         : Urls.messagingRegistrationDevice(device.uuid),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
