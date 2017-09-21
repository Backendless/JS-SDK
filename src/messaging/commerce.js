import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

export default class Commerce {
  constructor() {
    // this.restUrl = Urls.commerce()
  }

  validatePlayPurchase = Utils.promisified('_validatePlayPurchase')

  validatePlayPurchaseSync = Utils.synchronized('_validatePlayPurchase')

  _validatePlayPurchase(packageName, productId, token, async) {
    if (arguments.length < 3) {
      throw new Error('Package Name, Product Id, Token must be provided and must be not an empty STRING!')
    }

    for (let i = arguments.length - 2; i >= 0; i--) {
      if (!arguments[i] || !Utils.isString(arguments[i])) {
        throw new Error('Package Name, Product Id, Token must be provided and must be not an empty STRING!')
      }
    }

    let responder = Utils.extractResponder(arguments),
        isAsync   = !!responder

    if (responder) {
      responder = Utils.wrapAsync(responder)
    }

    return Backendless._ajax({
      method      : 'GET',
      url         : Urls.commerceValidate(packageName, productId, token),
      isAsync     : isAsync,
      asyncHandler: responder
    })
  }

  cancelPlaySubscription = Utils.promisified('_cancelPlaySubscription')

  cancelPlaySubscriptionSync = Utils.synchronized('_cancelPlaySubscription')

  _cancelPlaySubscription(packageName, subscriptionId, token, Async) {
    if (arguments.length < 3) {
      throw new Error('Package Name, Subscription Id, Token must be provided and must be not an empty STRING!')
    }

    for (let i = arguments.length - 2; i >= 0; i--) {
      if (!arguments[i] || !Utils.isString(arguments[i])) {
        throw new Error('Package Name, Subscription Id, Token must be provided and must be not an empty STRING!')
      }
    }

    let responder = Utils.extractResponder(arguments),
        isAsync   = !!responder

    if (responder) {
      responder = Utils.wrapAsync(responder)
    }

    return Backendless._ajax({
      method      : 'POST',
      url         : Urls.commerceSubCancel(packageName, subscriptionId, token),
      isAsync     : isAsync,
      asyncHandler: responder
    })
  }


  getPlaySubscriptionStatus = Utils.promisified('_getPlaySubscriptionStatus')

  getPlaySubscriptionStatusSync = Utils.synchronized('_getPlaySubscriptionStatus')

  _getPlaySubscriptionStatus(packageName, subscriptionId, token, Async) {
    if (arguments.length < 3) {
      throw new Error('Package Name, Subscription Id, Token must be provided and must be not an empty STRING!')
    }

    for (let i = arguments.length - 2; i >= 0; i--) {
      if (!arguments[i] || !Utils.isString(arguments[i])) {
        throw new Error('Package Name, Subscription Id, Token must be provided and must be not an empty STRING!')
      }
    }

    let responder = Utils.extractResponder(arguments),
        isAsync   = !!responder

    if (responder) {
      responder = Utils.wrapAsync(responder)
    }

    return Backendless._ajax({
      method      : 'GET',
      url         : Urls.commerceSubStatus(packageName, subscriptionId, token),
      isAsync     : isAsync,
      asyncHandler: responder
    })
  }
}

