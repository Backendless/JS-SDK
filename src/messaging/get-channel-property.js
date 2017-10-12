import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

const channelProperties = {}

export function getChannelProperties(channelName, async) {
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  const props = channelProperties[channelName]

  if (props) {
    if (isAsync) {
      async.success(props)
    }

    return props
  }

  const result = Backendless._ajax({
    method      : 'GET',
    url         : Urls.messagingChannelProps(channelName),
    isAsync     : isAsync,
    asyncHandler: responder
  })

  channelProperties[channelName] = result

  return result
}
