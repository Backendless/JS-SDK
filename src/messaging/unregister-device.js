import Urls from '../urls'
import Device from '../device'
import Request from '../request'

export function unregisterDevice(async) {
  const device = Device.required()

  Request.delete({
    url         : Urls.messagingRegistrationDevice(device.uuid),
    isAsync     : !!async,
    asyncHandler: async
  })
}
