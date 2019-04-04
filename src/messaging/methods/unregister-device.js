import Device from '../../device'

export function unregisterDevice(asyncHandler) {
  const device = Device.required()

  return this.backendless.request.delete({
    url         : this.backendless.urls.messagingRegistrationDevice(device.uuid),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
