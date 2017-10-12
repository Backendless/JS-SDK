import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

export function addCategory(name /**, async */) {
  if (!name) {
    throw new Error('Category name is required.')
  }

  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  const result = Backendless._ajax({
    method      : 'PUT',
    url         : Urls.geoCategory(name),
    isAsync     : isAsync,
    asyncHandler: responder
  })

  return (typeof result.result === 'undefined') ? result : result.result
}
