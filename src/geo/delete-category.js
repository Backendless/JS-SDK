import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

export function deleteCategory(name /**, async */) {
  if (!name) {
    throw new Error('Category name is required.')
  }

  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder
  let result = {}

  try {
    result = Request.delete({
      url         : Urls.geoCategory(name),
      isAsync     : isAsync,
      asyncHandler: responder
    })
  } catch (e) {
    if (e.statusCode === 404) {
      result = false
    } else {
      throw e
    }
  }

  return (typeof result.result === 'undefined') ? result : result.result
}
