import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

const isRemoteUrl = url => url.startsWith('http://') || url.startsWith('https://')

export function remove(path/**, async */) {
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  const url = isRemoteUrl(path) ? path : Urls.filePath(path)

  Request.delete({
    url         : url,
    isAsync     : isAsync,
    asyncHandler: responder
  })
}
