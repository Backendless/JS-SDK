import Utils from '../utils'
import { Validators } from '../validators'

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
    Validators.requiredString('Package Name', packageName)
    Validators.requiredString('Product Id', productId)
    Validators.requiredString('Token', token)

    return this.app.request.get({
      url: this.app.urls.commerceValidate(packageName, productId, token),
    })
  }

  async cancelPlaySubscription(packageName, subscriptionId, token) {
    Validators.requiredString('Package Name', packageName)
    Validators.requiredString('Subscription Id', subscriptionId)
    Validators.requiredString('Token', token)

    return this.app.request.post({
      url: this.app.urls.commerceSubCancel(packageName, subscriptionId, token),
    })
  }

  async getPlaySubscriptionStatus(packageName, subscriptionId, token) {
    Validators.requiredString('Package Name', packageName)
    Validators.requiredString('Subscription Id', subscriptionId)
    Validators.requiredString('Token', token)

    return this.app.request.get({
      url: this.app.urls.commerceSubStatus(packageName, subscriptionId, token),
    })
  }

}

