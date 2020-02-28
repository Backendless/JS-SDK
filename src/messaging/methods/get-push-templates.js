export function getPushTemplates(deviceType, asyncHandler) {
  return this.backendless.request.get({
    url         : this.backendless.urls.messagingPushTemplates(deviceType),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
