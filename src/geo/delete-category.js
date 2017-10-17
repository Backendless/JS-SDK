import Urls from '../urls'
import Request from '../request'

export function deleteCategory(name, asyncHandler) {
  if (!name) {
    throw new Error('Category name is required.')
  }

  let result = {}

  try {
    result = Request.delete({
      url         : Urls.geoCategory(name),
      isAsync     : !!asyncHandler,
      asyncHandler: asyncHandler
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
