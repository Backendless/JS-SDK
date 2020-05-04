import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forTest, prepareMockRequest, APP_PATH } from '../../helpers/sandbox'

describe('<Messaging> Emails', () => {

  forTest()

  const subject = 'test-subject'
  const textmessage = 'test-textmessage'
  const htmlmessage = 'test-htmlmessage'
  const bodyParts = { textmessage }
  const recipients = ['recipients-1', 'recipients-2']
  const attachment = ['attachments-1', 'attachments-2']

  const fakeResult = { foo: 123 }

  it('sends an email with "textmessage"', async () => {
    const req1 = prepareMockRequest({ status: fakeResult })

    const result1 = await Backendless.Messaging.sendEmail(subject, { textmessage }, recipients)

    expect(req1).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/messaging/email`,
      headers: { 'Content-Type': 'application/json' },
      body   : {
        subject,
        to       : recipients,
        bodyParts: { textmessage },
      }
    })

    expect(result1).to.be.eql(fakeResult)
  })

  it('sends an email with "htmlmessage"', async () => {
    const req1 = prepareMockRequest({ status: fakeResult })

    const result1 = await Backendless.Messaging.sendEmail(subject, { htmlmessage }, recipients)

    expect(req1).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/messaging/email`,
      headers: { 'Content-Type': 'application/json' },
      body   : {
        subject,
        to       : recipients,
        bodyParts: { htmlmessage },
      }
    })

    expect(result1).to.be.eql(fakeResult)
  })

  it('sends an email with "bodyParts" instance', async () => {
    const req1 = prepareMockRequest({ status: fakeResult })

    const bodyPartsInstance = new Backendless.Bodyparts({ textmessage, htmlmessage })

    const result1 = await Backendless.Messaging.sendEmail(subject, bodyPartsInstance, recipients)

    expect(req1).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/messaging/email`,
      headers: { 'Content-Type': 'application/json' },
      body   : {
        subject,
        to       : recipients,
        bodyParts: { textmessage, htmlmessage },
      }
    })

    expect(result1).to.be.eql(fakeResult)
  })

  it('sends an email with any "bodyParts"', async () => {
    const req1 = prepareMockRequest({ status: fakeResult })

    const result1 = await Backendless.Messaging.sendEmail(subject, { textmessage, htmlmessage, foo: 123 }, recipients)

    expect(req1).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/messaging/email`,
      headers: { 'Content-Type': 'application/json' },
      body   : {
        subject,
        to       : recipients,
        bodyParts: { textmessage, htmlmessage, foo: 123 },
      }
    })

    expect(result1).to.be.eql(fakeResult)
  })

  it('sends an email with "attachments"', async () => {
    const req1 = prepareMockRequest({ status: fakeResult })

    const result1 = await Backendless.Messaging.sendEmail(subject, { textmessage }, recipients, attachment)

    expect(req1).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/messaging/email`,
      headers: { 'Content-Type': 'application/json' },
      body   : {
        subject,
        attachment,
        to       : recipients,
        bodyParts: { textmessage },
      }
    })

    expect(result1).to.be.eql(fakeResult)
  })

  it('sends an email without "attachments"', async () => {
    const check = async attachments => {
      const req1 = prepareMockRequest({ status: fakeResult })

      await Backendless.Messaging.sendEmail(subject, { textmessage }, recipients, attachments)

      expect(req1.body.attachment).to.be.equal(undefined)
    }

    await check()
    await check(null)
    await check(false)
    await check(true)
    await check('')
    await check('str')
    await check(0)
    await check(123)
    await check({})
    await check([])
    await check(() => ({}))
  })

  it('fails when subject is invalid', async () => {
    const errorMsg = 'Email Subject must be provided and must be a string.'

    await expect(Backendless.Messaging.sendEmail()).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail(undefined)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail(null)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail(true)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail(false)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail(0)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail(123)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail('')).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail({})).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail([])).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
  })

  it('fails when bodyParts are invalid', async () => {
    const errorMsg = 'BodyParts must be an object'

    await expect(Backendless.Messaging.sendEmail(subject)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail(subject, undefined)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail(subject, null)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail(subject, true)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail(subject, false)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail(subject, 0)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail(subject, 123)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail(subject, '')).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail(subject, [])).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail(subject, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
  })

  it('fails when bodyParts do not container [ textmessage | htmlmessage ]', async () => {
    const errorMsg = 'BodyParts must contain at least one property of [ textmessage | htmlmessage ]'

    await expect(Backendless.Messaging.sendEmail(subject, {})).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail(subject, { foo: 123 })).to.eventually.be.rejectedWith(errorMsg)
  })

  it('fails when recipients are invalid', async () => {
    const errorMsg = 'Recipients must be a non empty array.'

    await expect(Backendless.Messaging.sendEmail(subject, bodyParts)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail(subject, bodyParts, undefined)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail(subject, bodyParts, null)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail(subject, bodyParts, true)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail(subject, bodyParts, false)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail(subject, bodyParts, 0)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail(subject, bodyParts, 123)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail(subject, bodyParts, '')).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail(subject, bodyParts, [])).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.sendEmail(subject, bodyParts, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
  })

  describe('Templates', () => {
    let emailEnvelope

    const templateName = 'MY_TEMPLATE_NAME'
    const templateValues = { foo: 'bar' }

    beforeEach(() => {
      emailEnvelope = new Backendless.EmailEnvelope({ addresses: ['foo@bar.com'] })
    })

    it('sends an email with template', async () => {
      const req1 = prepareMockRequest({ fakeResult })

      const result1 = await Backendless.Messaging.sendEmailFromTemplate(templateName, emailEnvelope)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/emailtemplate/send`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          addresses      : ['foo@bar.com'],
          'template-name': templateName
        }
      })

      expect(result1).to.be.eql({ fakeResult })
    })

    it('sends an email with template values', async () => {
      const req1 = prepareMockRequest({ fakeResult })

      const result1 = await Backendless.Messaging.sendEmailFromTemplate(templateName, emailEnvelope, templateValues)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/emailtemplate/send`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          addresses        : ['foo@bar.com'],
          'template-name'  : templateName,
          'template-values': templateValues,
        }
      })

      expect(result1).to.be.eql({ fakeResult })
    })

    it('fails when subject is invalid', async () => {
      const errorMsg = 'Email Template Name must be provided and must be a string.'

      await expect(Backendless.Messaging.sendEmailFromTemplate()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.sendEmailFromTemplate(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.sendEmailFromTemplate(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.sendEmailFromTemplate(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.sendEmailFromTemplate(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.sendEmailFromTemplate(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.sendEmailFromTemplate(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.sendEmailFromTemplate('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.sendEmailFromTemplate({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.sendEmailFromTemplate([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.sendEmailFromTemplate(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when emailEnvelope is not an instance of EmailEnvelope', async () => {
      const errorMsg = 'EmailEnvelope is required and should be instance of Backendless.Messaging.EmailEnvelope'

      await expect(Backendless.Messaging.sendEmailFromTemplate(templateName)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.sendEmailFromTemplate(templateName, undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.sendEmailFromTemplate(templateName, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.sendEmailFromTemplate(templateName, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.sendEmailFromTemplate(templateName, false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.sendEmailFromTemplate(templateName, 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.sendEmailFromTemplate(templateName, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.sendEmailFromTemplate(templateName, '')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.sendEmailFromTemplate(templateName, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.sendEmailFromTemplate(templateName, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Messaging.sendEmailFromTemplate(templateName, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

  })

  describe('Envelope', () => {
    let emailEnvelope

    beforeEach(() => {
      emailEnvelope = Backendless.EmailEnvelope.create()
    })

    it('initial create with options', async () => {
      emailEnvelope = Backendless.EmailEnvelope.create({
        addresses   : ['test-address'],
        ccAddresses : ['test-ccAddress'],
        bccAddresses: ['test-bccAddress'],
        query       : 'foo>123',
        foo         : 123
      })

      expect(emailEnvelope.toJSON()).to.be.eql({
        'addresses'    : ['test-address'],
        'bcc-addresses': ['test-bccAddress'],
        'cc-addresses' : ['test-ccAddress'],
        criteria       : 'foo>123',
      })
    })

    it('initial create without any options', async () => {
      emailEnvelope = Backendless.EmailEnvelope.create()

      expect(emailEnvelope.toJSON()).to.be.eql({})
    })

    it('checks getters and setters of addresses', async () => {
      emailEnvelope.setTo('address-1')

      expect(emailEnvelope.getTo()).to.be.eql(['address-1'])

      emailEnvelope.setTo(['address-2', 'address-3'])

      expect(emailEnvelope.getTo()).to.be.eql(['address-2', 'address-3'])

      emailEnvelope.addTo(['address-4', 'address-5'])

      expect(emailEnvelope.getTo()).to.be.eql(['address-2', 'address-3', 'address-4', 'address-5'])

      emailEnvelope.addTo('address-6')

      expect(emailEnvelope.getTo()).to.be.eql(['address-2', 'address-3', 'address-4', 'address-5', 'address-6'])

      expect(emailEnvelope.toJSON()).to.be.eql({
        addresses: ['address-2', 'address-3', 'address-4', 'address-5', 'address-6']
      })
    })

    it('checks getters and setters of ccAddresses', async () => {
      emailEnvelope.setCc('address-1')

      expect(emailEnvelope.getCc()).to.be.eql(['address-1'])

      emailEnvelope.setCc(['address-2', 'address-3'])

      expect(emailEnvelope.getCc()).to.be.eql(['address-2', 'address-3'])

      emailEnvelope.addCc(['address-4', 'address-5'])

      expect(emailEnvelope.getCc()).to.be.eql(['address-2', 'address-3', 'address-4', 'address-5'])

      emailEnvelope.addCc('address-6')

      expect(emailEnvelope.getCc()).to.be.eql(['address-2', 'address-3', 'address-4', 'address-5', 'address-6'])

      expect(emailEnvelope.toJSON()).to.be.eql({
        'cc-addresses': ['address-2', 'address-3', 'address-4', 'address-5', 'address-6']
      })
    })

    it('checks getters and setters of bccAddresses', async () => {
      emailEnvelope.setBcc('address-1')

      expect(emailEnvelope.getBcc()).to.be.eql(['address-1'])

      emailEnvelope.setBcc(['address-2', 'address-3'])

      expect(emailEnvelope.getBcc()).to.be.eql(['address-2', 'address-3'])

      emailEnvelope.addBcc(['address-4', 'address-5'])

      expect(emailEnvelope.getBcc()).to.be.eql(['address-2', 'address-3', 'address-4', 'address-5'])

      emailEnvelope.addBcc('address-6')

      expect(emailEnvelope.getBcc()).to.be.eql(['address-2', 'address-3', 'address-4', 'address-5', 'address-6'])

      expect(emailEnvelope.toJSON()).to.be.eql({
        'bcc-addresses': ['address-2', 'address-3', 'address-4', 'address-5', 'address-6']
      })
    })

    it('checks getters and setters of query', async () => {
      emailEnvelope.setQuery('query-1')

      expect(emailEnvelope.getQuery()).to.be.eql('query-1')

      emailEnvelope.setQuery('query-2')

      expect(emailEnvelope.getQuery()).to.be.eql('query-2')

      expect(emailEnvelope.toJSON()).to.be.eql({
        criteria: 'query-2'
      })
    })

    it('chain', async () => {
      emailEnvelope
        .setTo('address-1')
        .setTo(['address-2', 'address-3'])
        .addTo(['address-3', 'address-4'])
        .addTo('address-5')

        .setCc('address-1')
        .setCc(['address-2', 'address-3'])
        .addCc(['address-4', 'address-5'])
        .addCc('address-6')

        .setBcc('address-1')
        .setBcc(['address-2', 'address-3'])
        .addBcc(['address-4', 'address-5'])
        .addBcc('address-6')

        .setQuery('query-1')
        .setQuery('query-2')

      expect(emailEnvelope.toJSON()).to.be.eql({
        'addresses'    : ['address-2', 'address-3', 'address-3', 'address-4', 'address-5',],
        'bcc-addresses': ['address-2', 'address-3', 'address-4', 'address-5', 'address-6',],
        'cc-addresses' : ['address-2', 'address-3', 'address-4', 'address-5', 'address-6',],
        'criteria'     : 'query-2',
      })
    })

  })
})
