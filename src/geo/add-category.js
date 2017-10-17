import Urls from '../urls'
import Request from '../request'

export function addCategory(name, asyncHandler) {
  if (!name) {
    throw new Error('Category name is required.')
  }

  const result = Request.put({
    url         : Urls.geoCategory(name),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })

  return (typeof result.result === 'undefined') ? result : result.result
}
