import monitor from 'backendless-where-clause-monitor'
import Geometry from '../../geo/geometry'
import QueryBuilder from '../../query-builder'

const DefaultPaging = {
  pageSize: 10,
  offset  : 0
}

export const getWhereClause = dataQuery => {
  const whereClauseString = dataQuery instanceof QueryBuilder && dataQuery.getWhereClause()

  return whereClauseString ? monitor.createJSStoreVisitor(whereClauseString) : undefined
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

export const parseBooleans = object => {
  for (const field in object) {
    if (BooleanOptions.hasOwnProperty(object[field])) {
      object[field] = BooleanOptions[object[field]]
    }
  }

  return object
}

export const convertObject = object => {
  for (const field in object) {
    if (typeof object[field] === 'boolean') {
      object[field] = `${object[field]}`
    }

    if (object[field] instanceof Geometry) {
      object[field] = object[field].asWKT()
    }
  }

  return object
}

export function parseObjects(objects) {
  return objects.map(parseObject)
}

export function parseObject(object) {
  return parseBooleans(object)
}

export function prepareOfflineSyncResponse(dbTables, response) {
  const syncStatus = {
    successfulCompletion: {},
    failedCompletion    : {},
  }

  return response.forEach((status, i) => {
    syncStatus.successfulCompletion[dbTables[i]] = status.successfulCompletion
    syncStatus.failedCompletion[dbTables[i]] = status.failedCompletion
  })
}
