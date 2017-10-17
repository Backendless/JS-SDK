import Urls from '../urls'

import GeoQuery from './query'
import { loadItems } from './load-items'

export function loadFencePoints(geoFenceName, query, asyncHandler) {
  query = query || new GeoQuery()

  query.geoFence = geoFenceName
  query.url = Urls.geo()

  return loadItems(query, asyncHandler)
}
