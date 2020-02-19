import QueryBuilder from '../query-builder'

const MAX_PAGE_SIZE = 100 // max allowed value

async function fetchAll(whereClause) {
  whereClause = whereClause || new QueryBuilder()

  if (!(whereClause instanceof QueryBuilder)) {
    throw new Error('whereClause should be an instance of Backendless.DataQueryBuilder')
  }

  let offset = 0
  let lastPageSize = 0
  const itemsCollection = []

  do {
    whereClause.setPageSize(MAX_PAGE_SIZE)
    whereClause.setOffset(offset)

    const items = await this.find(whereClause)

    lastPageSize = items.length

    itemsCollection.push(...items)

    offset += MAX_PAGE_SIZE
  } while (lastPageSize >= MAX_PAGE_SIZE)

  return itemsCollection
}

export default fetchAll