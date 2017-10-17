import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

import { validateStringArgument } from './validate-string-argument'

export function getPlaySubscriptionStatus(packageName, subscriptionId, token, asyncHandler) {
  validateStringArgument('Package Name', packageName)
  validateStringArgument('Subscription Id', subscriptionId)
  validateStringArgument('Token', token)

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler)
  }

  return Request.get({
    url         : Urls.commerceSubStatus(packageName, subscriptionId, token),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
