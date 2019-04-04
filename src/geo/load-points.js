import { loadItems } from './load-items'

export function loadPoints(query, asyncHandler) {
  query.url = this.urls.geo()

  return loadItems(query, asyncHandler)
}