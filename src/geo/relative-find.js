import Urls from '../urls'

import { loadItems } from './load-items'

export function relativeFind(query, async) {
  if (!(query.relativeFindMetadata && query.relativeFindPercentThreshold)) {
    throw new Error(
      'Inconsistent geo query. ' +
      'Query should contain both relativeFindPercentThreshold and relativeFindMetadata'
    )
  }

  query.url = Urls.geoRelative()

  return loadItems(query, async)
}

