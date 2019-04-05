export function getRegistrations(asyncHandler) {
  const device = this.backendless.device

  return this.backendless.request.get({
    url         : this.backendless.urls.messagingRegistrationDevice(device.uuid),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
