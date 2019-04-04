import Utils from '../../utils'

export function pushWithTemplate(templateName) {
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  if (!templateName || !Utils.isString(templateName)) {
    throw new Error('Push Template Name must be non empty string!')
  }

  return this.backendless.request.post({
    url         : this.backendless.urls.messagingPushWithTemplate(templateName),
    isAsync     : isAsync,
    asyncHandler: responder
  })
}
