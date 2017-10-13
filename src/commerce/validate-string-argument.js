import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

export function validateStringArgument(label, value) {
  if (!value || !Utils.isString(value)) {
    throw new Error(`${label} be provided and must be not an empty STRING!`)
  }
}

export function cancelPlaySubscription(packageName, subscriptionId, token, async) {
  validateStringArgument('Package Name', packageName)
  validateStringArgument('Subscription Id', subscriptionId)
  validateStringArgument('Token', token)

  if (async) {
    async = Utils.wrapAsync(async)
  }

  return Request.post({
    url         : Urls.commerceSubCancel(packageName, subscriptionId, token),
    isAsync     : !!async,
    asyncHandler: async
  })
}
