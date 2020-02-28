export function getRegistrations(asyncHandler) {
  const device = this.app.device

  return this.app.request.get({
    url         : this.app.urls.messagingRegistrationDevice(device.uuid),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
