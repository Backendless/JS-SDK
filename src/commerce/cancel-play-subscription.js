import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

import { validateStringArgument } from './validate-string-argument'

export function cancelPlaySubscription(packageName, subscriptionId, token, async) {
  validateStringArgument('Package Name', packageName)
  validateStringArgument('Subscription Id', subscriptionId)
  validateStringArgument('Token', token)

  if (async) {
    async = Utils.wrapAsync(async)
  }

  return Backendless._ajax({
    method      : 'POST',
    url         : Urls.commerceSubCancel(packageName, subscriptionId, token),
    isAsync     : !!async,
    asyncHandler: async
  })
}
