import monitor from 'backendless-where-clause-monitor'
import QueryBuilder from '../../query-builder'

export const getWhereClause = dataQuery => {
  const whereClauseString = dataQuery instanceof QueryBuilder && dataQuery.getWhereClause()

  return whereClauseString ? monitor.createJSStoreVisitor(dataQuery.getWhereClause()) : undefined
}

const DefaultPaging = {
  pageSize: 10,
  offset  : 0
}

export const getPaging = dataQuery => dataQuery instanceof QueryBuilder ? dataQuery.getPaging() : DefaultPaging

export const getOrder = dataQuery => {
  const orderBy = dataQuery instanceof QueryBuilder && dataQuery.getSortBy() || []

  const order = orderBy.reduce((result, sorting) => {
    const [by, type = 'asc'] = sorting.split(' ')

    return result.concat({ by, type })
  }, [])

  return order.length ? order : undefined
}

const BooleanOptions = {
  'true' : true,
  'false': false,
}

export const parseBooleans = record => {
  for (const field in record) {
    if (BooleanOptions.hasOwnProperty(record[field])) {
      record[field] = BooleanOptions[record[field]]
    }
  }

  return record
}

export const convertBooleansToStrings = record => {
  for (const field in record) {
    if (typeof record[field] === 'boolean') {
      record[field] = `${ record[field] }`
    }
  }

  return record
}

export function sanitizeRecords(records) {
  return records.map(sanitizeRecord)
}

export function sanitizeRecord(record) {
  return parseBooleans(record)
}