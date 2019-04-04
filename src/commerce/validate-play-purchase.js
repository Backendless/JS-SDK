import Utils from '../utils'

import { validateStringArgument } from './validate-string-argument'

export function validatePlayPurchase(packageName, productId, token, asyncHandler) {
  validateStringArgument('Package Name', packageName)
  validateStringArgument('Product Id', productId)
  validateStringArgument('Token', token)

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler)
  }

  return this.backendless.request.get({
    url         : this.backendless.urls.commerceValidate(packageName, productId, token),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
