import Utils from '../../utils'
import Urls from '../../urls'
import Request from '../../request'
import Bodyparts from '../helpers/body-parts'

export function sendEmail(subject, bodyParts, recipients, attachments/**, async */) {
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder
  const data = {}

  if (subject && !Utils.isEmpty(subject) && Utils.isString(subject)) {
    data.subject = subject
  } else {
    throw new Error('Subject is required parameter and must be a nonempty string')
  }

  if ((bodyParts instanceof Bodyparts) && !Utils.isEmpty(bodyParts)) {
    data.bodyparts = bodyParts
  } else {
    throw new Error('Use Bodyparts as bodyParts argument, must contain at least one property')
  }

  if (recipients && Utils.isArray(recipients) && !Utils.isEmpty(recipients)) {
    data.to = recipients
  } else {
    throw new Error('Recipients is required parameter, must be a nonempty array')
  }

  if (attachments) {
    if (Utils.isArray(attachments)) {
      if (!Utils.isEmpty(attachments)) {
        data.attachment = attachments
      }
    }
  }

  function responseMessageStatus(res) {
    return res.status
  }

  return Request.post({
    url         : Urls.messagingEmail(),
    isAsync     : isAsync,
    asyncHandler: Utils.wrapAsync(responder, responseMessageStatus),
    data        : data
  })
}

