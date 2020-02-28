import { loadItems } from './load-items'

export function loadPoints(query, asyncHandler) {
  query.url = this.app.urls.geo()

  return loadItems.call(this, query, asyncHandler)
}