import { idbConnection } from '../database-manager'
import { getOrder, getPaging, getWhereClause, sanitizeRecords } from './utils'

export async function findAll(from, dataQuery) {
  const where = getWhereClause(dataQuery)
  const { pageSize: limit, offset: skip } = getPaging(dataQuery)
  const order = getOrder(dataQuery)

  const records = await idbConnection.select({
    from,
    where,
    order,
    limit,
    skip
  })

  return sanitizeRecords(records)
}