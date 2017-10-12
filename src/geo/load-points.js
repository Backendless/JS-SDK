import Urls from '../urls'

import { loadItems } from './load-items'

export function loadPoints(query, async) {
  query['url'] = Urls.geo()

  return loadItems(query, async)
}
