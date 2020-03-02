export function getPushTemplates(deviceType, asyncHandler) {
  return this.app.request.get({
    url         : this.app.urls.messagingPushTemplates(deviceType),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
