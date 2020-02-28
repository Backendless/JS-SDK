export function unregisterDevice(asyncHandler) {
  const device = this.app.device

  return this.app.request.delete({
    url         : this.app.urls.messagingRegistrationDevice(device.uuid),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
