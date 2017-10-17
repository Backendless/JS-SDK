import Urls from '../urls'

import { loadItems } from './load-items'

export function loadPoints(query, asyncHandler) {
  query.url = Urls.geo()

  return loadItems(query, asyncHandler)
}
