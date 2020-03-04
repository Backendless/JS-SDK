import { getOrder, getPaging, getWhereClause, parseObjects } from './utils'

export async function findAll(from, dataQuery) {
  const where = getWhereClause(dataQuery)
  const { pageSize: limit, offset: skip } = getPaging(dataQuery)
  const order = getOrder(dataQuery)

  const objects = await this.app.OfflineDBManager.connection.select({
    from,
    where,
    order,
    limit,
    skip
  })

  return parseObjects(objects)
}
