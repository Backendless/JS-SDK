import Utils from '../../utils'
import Urls from '../../urls'
import Request from '../../request'
import EmailEnvelope from '../helpers/email-envelope'

export function sendEmailFromTemplate(templateName, envelopeObject, templateValues/**, async */) {
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  if (typeof templateName !== 'string' || !templateName) {
    throw new Error('Template name is required and must be a string')
  }

  if (!(envelopeObject instanceof EmailEnvelope)) {
    throw new Error('EmailEnvelope is required and should be instance of Backendless.Messaging.EmailEnvelope')
  }

  const data = envelopeObject.toJSON()

  data['template-name'] = templateName

  if (templateValues) {
    data['template-values'] = templateValues
  }

  return Request.post({
    url         : Urls.emailTemplateSend(),
    isAsync     : isAsync,
    asyncHandler: responder,
    data        : data
  })
}

