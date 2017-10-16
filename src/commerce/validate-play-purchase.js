import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

import { validateStringArgument } from './validate-string-argument'

export function validatePlayPurchase(packageName, productId, token, asyncHandler) {
  validateStringArgument('Package Name', packageName)
  validateStringArgument('Product Id', productId)
  validateStringArgument('Token', token)

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler)
  }

  return Request.get({
    url         : Urls.commerceValidate(packageName, productId, token),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
