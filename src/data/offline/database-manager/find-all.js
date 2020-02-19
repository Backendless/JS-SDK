import { idbConnection } from '../database-manager'
import { sanitizeRecords } from './sanitizer'
import { getOrder, getPaging, getWhereClause } from './utils'

async function findAll(from, dataQuery) {
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

export {
  findAll
}