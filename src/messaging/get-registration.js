import Backendless from '../bundle'
import Urls from '../urls'
import Device from '../device'

export function getRegistrations(async) {
  const device = Device.required()

  return Backendless._ajax({
    method      : 'GET',
    url         : Urls.messagingRegistrationDevice(device.uuid),
    isAsync     : !!async,
    asyncHandler: async
  })
}
