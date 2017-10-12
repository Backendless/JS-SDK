import Backendless from '../bundle'
import Urls from '../urls'
import Device from '../device'

export function unregisterDevice(async) {
  const device = Device.required()

  Backendless._ajax({
    method      : 'DELETE',
    url         : Urls.messagingRegistrationDevice(device.uuid),
    isAsync     : !!async,
    asyncHandler: async
  })
}
