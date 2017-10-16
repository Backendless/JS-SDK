import { cacheMethod } from './cache-methods'

export function remove(key, asyncHandler) {
  return cacheMethod('DELETE', key, false, asyncHandler)
}
