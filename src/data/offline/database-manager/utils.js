import createMonitor from 'backendless-where-clause-monitor'
import QueryBuilder from '../../query-builder'

const getWhereClause = dataQuery => {
  const whereClauseString = dataQuery instanceof QueryBuilder && dataQuery.getWhereClause()

  return whereClauseString ? createMonitor(dataQuery.getWhereClause()) : undefined
}

const DefaultPaging = {
  pageSize: 10,
  offset  : 0
}

const getPaging = dataQuery => dataQuery instanceof QueryBuilder ? dataQuery.getPaging() : DefaultPaging

const getOrder = dataQuery => {
  const orderBy = dataQuery instanceof QueryBuilder && dataQuery.getSortBy() || []

  const order = orderBy.reduce((result, sorting) => {
    const [by, type = 'asc'] = sorting.split(' ')

    return result.concat({ by, type })
  }, [])

  return order.length ? order : undefined
}

export {
  getWhereClause,
  getPaging,
  getOrder
}