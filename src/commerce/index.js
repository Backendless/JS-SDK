import Utils from '../utils'

export default class Commerce {
  constructor(app) {
    this.app = app

    Utils.enableAsyncHandlers(this, [
      'validatePlayPurchase',
      'cancelPlaySubscription',
      'getPlaySubscriptionStatus'
    ])
  }

  async validatePlayPurchase(packageName, productId, token) {
    validateStringArgument('Package Name', packageName)
    validateStringArgument('Product Id', productId)
    validateStringArgument('Token', token)

    return this.app.request.get({
      url: this.app.urls.commerceValidate(packageName, productId, token),
    })
  }

  async cancelPlaySubscription(packageName, subscriptionId, token) {
    validateStringArgument('Package Name', packageName)
    validateStringArgument('Subscription Id', subscriptionId)
    validateStringArgument('Token', token)

    return this.app.request.post({
      url: this.app.urls.commerceSubCancel(packageName, subscriptionId, token),
    })
  }

  async getPlaySubscriptionStatus(packageName, subscriptionId, token) {
    validateStringArgument('Package Name', packageName)
    validateStringArgument('Subscription Id', subscriptionId)
    validateStringArgument('Token', token)

    return this.app.request.get({
      url: this.app.urls.commerceSubStatus(packageName, subscriptionId, token),
    })
  }

}

function validateStringArgument(label, value) {
  if (!value || typeof value !== 'string') {
    throw new Error(`${label} must be provided and must be not an empty STRING!`)
  }
}

