import GeoQuery from './query'
import { loadItems } from './load-items'

export function loadFencePoints(geoFenceName, query, asyncHandler) {
  query = query || new GeoQuery()

  query.geoFence = geoFenceName
  query.url = this.backendless.urls.geo()

  return loadItems.call(this, query, asyncHandler)
}