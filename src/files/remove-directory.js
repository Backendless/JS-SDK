import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

//TODO: looks like is's the same as removeFile method
export function removeDirectory(path /**, async */) {
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  return Request.delete({
    url         : Urls.filePath(path),
    isAsync     : isAsync,
    asyncHandler: responder
  })
}
