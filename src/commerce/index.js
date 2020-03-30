import Utils from '../utils'

import { validateStringArgument } from './validate-string-argument'

export default class Commerce {
  constructor(app) {
    this.app = app
  }

  async validatePlayPurchase(packageName, productId, token, asyncHandler) {
    validateStringArgument('Package Name', packageName)
    validateStringArgument('Product Id', productId)
    validateStringArgument('Token', token)

    if (asyncHandler) {
      asyncHandler = Utils.wrapAsync(asyncHandler)
    }

    return this.app.request.get({
      url         : this.app.urls.commerceValidate(packageName, productId, token),
      asyncHandler: asyncHandler
    })
  }

  async cancelPlaySubscription(packageName, subscriptionId, token, asyncHandler) {
    validateStringArgument('Package Name', packageName)
    validateStringArgument('Subscription Id', subscriptionId)
    validateStringArgument('Token', token)

    if (asyncHandler) {
      asyncHandler = Utils.wrapAsync(asyncHandler)
    }

    return this.app.request.post({
      url         : this.app.urls.commerceSubCancel(packageName, subscriptionId, token),
      asyncHandler: asyncHandler
    })
  }

  async getPlaySubscriptionStatus(packageName, subscriptionId, token, asyncHandler) {
    validateStringArgument('Package Name', packageName)
    validateStringArgument('Subscription Id', subscriptionId)
    validateStringArgument('Token', token)

    if (asyncHandler) {
      asyncHandler = Utils.wrapAsync(asyncHandler)
    }

    return this.app.request.get({
      url         : this.app.urls.commerceSubStatus(packageName, subscriptionId, token),
      asyncHandler: asyncHandler
    })
  }

}
