import { cacheMethod } from './cache-methods'

export function contains(key, async) {
  return cacheMethod('GET', key, true, async)
}
