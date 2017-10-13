import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

//TODO: looks like is's the same as removeFile method
export function removeDirectory(path /**, async */) {
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  return Backendless._ajax({
    method      : 'DELETE',
    url         : Urls.filePath(path),
    isAsync     : isAsync,
    asyncHandler: responder
  })
}
