import Urls from '../../urls'
import Device from '../../device'
import Request from '../../request'

export function unregisterDevice(asyncHandler) {
  const device = Device.required()

  return Request.delete({
    url         : Urls.messagingRegistrationDevice(device.uuid),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
