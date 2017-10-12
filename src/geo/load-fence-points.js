import Urls from '../urls'

import GeoQuery from './query'
import { loadItems } from './load-items'

export function loadFencePoints(geoFenceName, query, async) {
  query = query || new GeoQuery()

  query.geoFence = geoFenceName
  query.url = Urls.geo()

  return loadItems(query, async)
}
