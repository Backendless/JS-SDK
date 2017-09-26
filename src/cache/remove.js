import { cacheMethod } from './cache-methods'

export function remove(key, async) {
  return cacheMethod('DELETE', key, false, async)
}
