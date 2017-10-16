import { cacheMethod } from './cache-methods'

export function contains(key, asyncHandler) {
  return cacheMethod('GET', key, true, asyncHandler)
}
