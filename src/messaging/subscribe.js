import Urls from '../urls'
import Async from '../request/async'
import Subscription from './subscription'

import { getChannelProperties } from './get-channel-property'

export function subscribe(channelName, subscriptionCallback, subscriptionOptions, async) {
  if (async) {
    const callback = new Async(function(props) {
      async.success(new Subscription({
        channelName      : channelName,
        options          : subscriptionOptions,
        channelProperties: props,
        responder        : subscriptionCallback,
        restUrl          : Urls.messaging(),
        onSubscribe      : async
      }))

    }, function(data) {
      async.fault(data)
    })

    getChannelProperties(channelName, callback)

  } else {
    const props = getChannelProperties(channelName)

    return new Subscription({
      channelName      : channelName,
      options          : subscriptionOptions,
      channelProperties: props,
      responder        : subscriptionCallback,
      restUrl          : Urls.messaging()
    })
  }
}
