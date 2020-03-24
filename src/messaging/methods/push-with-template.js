import Utils from '../../utils'
import Async from '../../request/async'

export function pushWithTemplate(templateName, templateValues, asyncHandler) {
  if (templateValues instanceof Async) {
    asyncHandler = templateValues
    templateValues = undefined
  }

  if (!templateName || !Utils.isString(templateName)) {
    throw new Error('Push Template Name must be non empty string!')
  }

  const data = {}

  if (templateValues) {
    data.templateValues = templateValues
  }

  return this.app.request.post({
    url    : this.app.urls.messagingPushWithTemplate(templateName),
    isAsync: !!asyncHandler,
    asyncHandler,
    data
  })
}
