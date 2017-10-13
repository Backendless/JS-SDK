import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

export function addCategory(name /**, async */) {
  if (!name) {
    throw new Error('Category name is required.')
  }

  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  const result = Request.put({
    url         : Urls.geoCategory(name),
    isAsync     : isAsync,
    asyncHandler: responder
  })

  return (typeof result.result === 'undefined') ? result : result.result
}
