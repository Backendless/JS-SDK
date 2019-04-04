import Device from '../../device'

export function getRegistrations(asyncHandler) {
  const device = Device.required()

  return this.backendless.request.get({
    url         : this.backendless.urls.messagingRegistrationDevice(device.uuid),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
