export function unregisterDevice(asyncHandler) {
  const device = this.backendless.device

  return this.backendless.request.delete({
    url         : this.backendless.urls.messagingRegistrationDevice(device.uuid),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
