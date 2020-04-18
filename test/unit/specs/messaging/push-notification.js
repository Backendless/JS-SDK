import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forSuite, prepareMockRequest, APP_PATH } from '../../helpers/sandbox'

describe('<Messaging> Push Notifications', () => {

  forSuite()

  describe('Push Templates', function() {

    const templateName = 'MY_PUSH_TEMPLATE'

    it('send push with template', async () => {
      const req1 = prepareMockRequest()
      const req2 = prepareMockRequest()

      await Backendless.Messaging.pushWithTemplate(templateName)
      await Backendless.Messaging.pushWithTemplate(templateName, { customValue: 'customValue' })

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/messaging/push/${templateName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {}
      })

      expect(req2).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/messaging/push/${templateName}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          templateValues: {
            customValue: 'customValue'
          }
        }
      })
    })
  })
})
