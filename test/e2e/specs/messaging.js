import '../helpers/global'
import sandbox from '../helpers/sandbox'

const Backendless = sandbox.Backendless

describe('Messaging', function() {
  sandbox.forSuite()

  it('Create new table', async () => {
    const result = await Backendless.Messaging.publish('my-channel', { foo: 'bar' })

    expect(result.status).to.be.equal('scheduled')
    expect(result.messageId).to.be.a('string')
    expect(result.errorMessage).to.equal(null)
  })

  it('Send Email from "nonexistent-template" template', async () => {
    const envelope = new Backendless.Messaging.EmailEnvelope({ query: 'foo=\'bar\'' })

    let error

    try {
      await Backendless.Messaging.sendEmailFromTemplate('nonexistent-template', envelope, { foo: 'bar' })
    } catch (e) {
      error = e
    }

    expect(error.code).to.equal(24002)
    expect(error.message).to.equal('Email Template with name \'nonexistent-template\' doesn\'t exist.')
  })

  describe('Push Templates', function() {

    const templateName = 'MY_PUSH_TEMPLATE'

    it('send push with template', async () => {
      const req1 = sandbox.prepareMockRequest()
      const req2 = sandbox.prepareMockRequest()

      await Backendless.Messaging.pushWithTemplate(templateName)
      await Backendless.Messaging.pushWithTemplate(templateName, { customValue: 'customValue' })

      expect(req1.path).to.equal(`${Backendless.appPath}/messaging/push/${templateName}`)
      expect(req1.method).to.equal('POST')
      expect(Object.keys(req1.body)).to.eql([])

      expect(req2.path).to.equal(`${Backendless.appPath}/messaging/push/${templateName}`)
      expect(req2.method).to.equal('POST')
      expect(Object.keys(req2.body)).to.eql(['templateValues'])
      expect(req2.body.templateValues.customValue).to.eql('customValue')
    })
  })
})
