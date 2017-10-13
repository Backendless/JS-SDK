import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

const isRemoteUrl = url => url.startsWith('http://') || url.startsWith('https://')

export function remove(path/**, async */) {
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  const url = isRemoteUrl(path) ? path : Urls.filePath(path)

  Backendless._ajax({
    method      : 'DELETE',
    url         : url,
    isAsync     : isAsync,
    asyncHandler: responder
  })
}
