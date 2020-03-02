import Utils from '../utils'

import { validateStringArgument } from './validate-string-argument'

export function getPlaySubscriptionStatus(packageName, subscriptionId, token, asyncHandler) {
  validateStringArgument('Package Name', packageName)
  validateStringArgument('Subscription Id', subscriptionId)
  validateStringArgument('Token', token)

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler)
  }

  return this.app.request.get({
    url         : this.app.urls.commerceSubStatus(packageName, subscriptionId, token),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
