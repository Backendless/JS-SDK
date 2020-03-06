import QueryBuilder from '../query-builder'

async function fetchAll(queryBuilder) {
  queryBuilder = queryBuilder || new QueryBuilder()

  if (!(queryBuilder instanceof QueryBuilder)) {
    throw new Error('queryBuilder should be an instance of Backendless.DataQueryBuilder')
  }

  let offset = 0
  let lastPageSize = 0
  const itemsCollection = []
  const maxPageSize = this.app.Config.getPageSize()

  do {
    queryBuilder.setPageSize(maxPageSize)
    queryBuilder.setOffset(offset)
    queryBuilder.setStoragePolicy(this.app.LocalStoragePolicy.DONOTSTOREANY)

    const items = await this.find(queryBuilder)

    lastPageSize = items.length

    itemsCollection.push(...items)

    offset += maxPageSize
  } while (lastPageSize >= maxPageSize)

  return itemsCollection
}

export default fetchAll
