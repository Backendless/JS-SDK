import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forSuite, prepareMockRequest, APP_PATH } from '../helpers/sandbox'

describe('<Commerce>', function() {

  forSuite(this)

  const packageName = 'MY_PACKAGE_NAME'
  const productId = 'MY_PRODUCT_ID'
  const subscriptionId = 'MY_SUBSCRIPTION_ID'
  const token = 'MY_TOKEN'

  describe('validatePlayPurchase', () => {
    it('fails when packageName is not a string', async () => {
      const errorMsg = 'Package Name must be provided and must be a string.'

      await expect(Backendless.Commerce.validatePlayPurchase()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.validatePlayPurchase(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.validatePlayPurchase(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.validatePlayPurchase(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.validatePlayPurchase({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.validatePlayPurchase([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.validatePlayPurchase(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when productId is not a string', async () => {
      const errorMsg = 'Product Id must be provided and must be a string.'

      await expect(Backendless.Commerce.validatePlayPurchase(packageName)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.validatePlayPurchase(packageName, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.validatePlayPurchase(packageName, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.validatePlayPurchase(packageName, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.validatePlayPurchase(packageName, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.validatePlayPurchase(packageName, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.validatePlayPurchase(packageName, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when token is not a string', async () => {
      const errorMsg = 'Token must be provided and must be a string.'

      await expect(Backendless.Commerce.validatePlayPurchase(packageName, productId)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.validatePlayPurchase(packageName, productId, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.validatePlayPurchase(packageName, productId, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.validatePlayPurchase(packageName, productId, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.validatePlayPurchase(packageName, productId, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.validatePlayPurchase(packageName, productId, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.validatePlayPurchase(packageName, productId, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('valid request', async () => {
      const req1 = prepareMockRequest()

      await Backendless.Commerce.validatePlayPurchase(packageName, productId, token)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/commerce/googleplay/validate/${packageName}/inapp/${productId}/purchases/${token}`,
        headers: {},
        body   : undefined
      })
    })
  })

  describe('getPlaySubscriptionStatus', () => {
    it('fails when packageName is not a string', async () => {
      const errorMsg = 'Package Name must be provided and must be a string.'

      await expect(Backendless.Commerce.getPlaySubscriptionStatus()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.getPlaySubscriptionStatus(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.getPlaySubscriptionStatus(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.getPlaySubscriptionStatus(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.getPlaySubscriptionStatus({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.getPlaySubscriptionStatus([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.getPlaySubscriptionStatus(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when subscriptionId is not a string', async () => {
      const errorMsg = 'Subscription Id must be provided and must be a string.'

      await expect(Backendless.Commerce.getPlaySubscriptionStatus(packageName)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.getPlaySubscriptionStatus(packageName, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.getPlaySubscriptionStatus(packageName, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.getPlaySubscriptionStatus(packageName, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.getPlaySubscriptionStatus(packageName, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.getPlaySubscriptionStatus(packageName, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.getPlaySubscriptionStatus(packageName, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when token is not a string', async () => {
      const errorMsg = 'Token must be provided and must be a string.'

      await expect(Backendless.Commerce.getPlaySubscriptionStatus(packageName, subscriptionId)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.getPlaySubscriptionStatus(packageName, subscriptionId, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.getPlaySubscriptionStatus(packageName, subscriptionId, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.getPlaySubscriptionStatus(packageName, subscriptionId, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.getPlaySubscriptionStatus(packageName, subscriptionId, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.getPlaySubscriptionStatus(packageName, subscriptionId, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.getPlaySubscriptionStatus(packageName, subscriptionId, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('valid request', async () => {
      const req1 = prepareMockRequest()

      await Backendless.Commerce.getPlaySubscriptionStatus(packageName, subscriptionId, token)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/commerce/googleplay/${packageName}/subscription/${subscriptionId}/purchases/${token}`,
        headers: {},
        body   : undefined
      })
    })
  })

  describe('cancelPlaySubscription', () => {
    it('fails when packageName is not a string', async () => {
      const errorMsg = 'Package Name must be provided and must be a string.'

      await expect(Backendless.Commerce.cancelPlaySubscription()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.cancelPlaySubscription(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.cancelPlaySubscription(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.cancelPlaySubscription(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.cancelPlaySubscription({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.cancelPlaySubscription([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.cancelPlaySubscription(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when subscriptionId is not a string', async () => {
      const errorMsg = 'Subscription Id must be provided and must be a string.'

      await expect(Backendless.Commerce.cancelPlaySubscription(packageName)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.cancelPlaySubscription(packageName, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.cancelPlaySubscription(packageName, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.cancelPlaySubscription(packageName, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.cancelPlaySubscription(packageName, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.cancelPlaySubscription(packageName, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.cancelPlaySubscription(packageName, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when token is not a string', async () => {
      const errorMsg = 'Token must be provided and must be a string.'

      await expect(Backendless.Commerce.cancelPlaySubscription(packageName, subscriptionId)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.cancelPlaySubscription(packageName, subscriptionId, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.cancelPlaySubscription(packageName, subscriptionId, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.cancelPlaySubscription(packageName, subscriptionId, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.cancelPlaySubscription(packageName, subscriptionId, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.cancelPlaySubscription(packageName, subscriptionId, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Commerce.cancelPlaySubscription(packageName, subscriptionId, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('valid request', async () => {
      const req1 = prepareMockRequest()

      await Backendless.Commerce.cancelPlaySubscription(packageName, subscriptionId, token)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/commerce/googleplay/${packageName}/subscription/${subscriptionId}/purchases/${token}/cancel`,
        headers: {},
        body   : undefined
      })
    })
  })

})
