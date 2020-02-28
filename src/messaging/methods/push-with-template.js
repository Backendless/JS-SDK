import Utils from '../../utils'

export function pushWithTemplate(templateName) {
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  if (!templateName || !Utils.isString(templateName)) {
    throw new Error('Push Template Name must be non empty string!')
  }

  return this.app.request.post({
    url         : this.app.urls.messagingPushWithTemplate(templateName),
    isAsync     : isAsync,
    asyncHandler: responder
  })
}
