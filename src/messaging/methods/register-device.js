import Utils from '../../utils'
import Urls from '../../urls'
import Device from '../../device'
import Request from '../../request'
import Async from '../../request/async'

export function registerDevice(deviceToken, channels, expiration, asyncHandler) {
  const device = Device.required()

  if (expiration instanceof Async) {
    asyncHandler = expiration
    expiration = undefined
  }

  const data = {
    deviceToken: deviceToken,
    deviceId   : device.uuid,
    os         : device.platform,
    osVersion  : device.version
  }

  if (Utils.isArray(channels)) {
    data.channels = channels
  }

  if (Utils.isNumber(expiration) || expiration instanceof Date) {
    data.expiration = (expiration instanceof Date)
      ? expiration.getTime() / 1000
      : expiration
  }

  return Request.post({
    url         : Urls.messagingRegistrations(),
    data        : data,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
