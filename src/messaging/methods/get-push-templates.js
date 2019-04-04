export function getPushTemplates(asyncHandler) {
  return this.backendless.request.get({
    url         : this.backendless.urls.messagingPushTemplates(),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
