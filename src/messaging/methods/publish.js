import Utils from '../../utils'
import Urls from '../../urls'
import Request from '../../request'
import Async from '../../request/async'
import DeliveryOptions from '../helpers/delivery-options'
import PublishOptions from '../helpers/publish-options'

export function publish(channelName, message, publishOptions, deliveryTarget, asyncHandler) {
  if (publishOptions instanceof Async) {
    asyncHandler = publishOptions
    publishOptions = undefined
    deliveryTarget = undefined
  }

  if (deliveryTarget instanceof Async) {
    asyncHandler = deliveryTarget
    deliveryTarget = undefined
  }

  const data = {
    message: message
  }

  if (publishOptions) {
    if (!(publishOptions instanceof PublishOptions)) {
      throw new Error('Use PublishOption as publishOptions argument')
    }

    Utils.deepExtend(data, publishOptions)
  }

  if (deliveryTarget) {
    if (!(deliveryTarget instanceof DeliveryOptions)) {
      throw new Error('Use DeliveryOptions as deliveryTarget argument')
    }

    Utils.deepExtend(data, deliveryTarget)
  }

  return Request.post({
    url         : Urls.messagingChannel(channelName),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler,
    data        : data
  })
}
