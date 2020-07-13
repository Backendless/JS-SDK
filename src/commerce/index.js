export default class Commerce {
  constructor(app) {
    this.app = app
  }

  async validatePlayPurchase(packageName, productId, token) {
    if (!packageName || typeof packageName !== 'string') {
      throw new Error('Package Name must be provided and must be a string.')
    }

    if (!productId || typeof productId !== 'string') {
      throw new Error('Product Id must be provided and must be a string.')
    }

    if (!token || typeof token !== 'string') {
      throw new Error('Token must be provided and must be a string.')
    }

    return this.app.request.get({
      url: this.app.urls.commerceValidate(packageName, productId, token),
    })
  }

  async cancelPlaySubscription(packageName, subscriptionId, token) {
    if (!packageName || typeof packageName !== 'string') {
      throw new Error('Package Name must be provided and must be a string.')
    }

    if (!subscriptionId || typeof subscriptionId !== 'string') {
      throw new Error('Subscription Id must be provided and must be a string.')
    }

    if (!token || typeof token !== 'string') {
      throw new Error('Token must be provided and must be a string.')
    }

    return this.app.request.post({
      url: this.app.urls.commerceSubCancel(packageName, subscriptionId, token),
    })
  }

  async getPlaySubscriptionStatus(packageName, subscriptionId, token) {
    if (!packageName || typeof packageName !== 'string') {
      throw new Error('Package Name must be provided and must be a string.')
    }

    if (!subscriptionId || typeof subscriptionId !== 'string') {
      throw new Error('Subscription Id must be provided and must be a string.')
    }

    if (!token || typeof token !== 'string') {
      throw new Error('Token must be provided and must be a string.')
    }

    return this.app.request.get({
      url: this.app.urls.commerceSubStatus(packageName, subscriptionId, token),
    })
  }

}

