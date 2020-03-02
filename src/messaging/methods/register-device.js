import Utils from '../../utils'
import Async from '../../request/async'

export function registerDevice(deviceToken, channels, expiration, asyncHandler) {
  const device = this.app.device

  asyncHandler = Utils.extractResponder(arguments)

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

  return this.app.request.post({
    url         : this.app.urls.messagingRegistrations(),
    data        : data,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
