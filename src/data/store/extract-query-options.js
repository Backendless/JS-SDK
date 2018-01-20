import Utils from '../../utils'

//TODO: refactor me
//TODO: does make sense to move this logic into QueryBuilder?

export function extractQueryOptions(options) {
  const params = []

  if (typeof options.pageSize !== 'undefined') {
    if (options.pageSize < 1) {
      throw new Error('PageSize can not be less then 1')
    }

    params.push('pageSize=' + encodeURIComponent(options.pageSize))
  }

  if (typeof options.offset !== 'undefined') {
    if (options.offset < 0) {
      throw new Error('Offset can not be less then 0')
    }

    params.push('offset=' + encodeURIComponent(options.offset))
  }

  if (options.sortBy) {
    if (Utils.isString(options.sortBy)) {
      params.push('sortBy=' + encodeURIComponent(options.sortBy))
    } else if (Utils.isArray(options.sortBy)) {
      params.push('sortBy=' + Utils.encodeArrayToUriComponent(options.sortBy))
    }
  }

  if (options.groupBy) {
    if (Utils.isString(options.groupBy)) {
      params.push('groupBy=' + encodeURIComponent(options.groupBy))
    } else if (Utils.isArray(options.groupBy)) {
      params.push('groupBy=' + Utils.encodeArrayToUriComponent(options.groupBy))
    }
  }

  if (Utils.isNumber(options.relationsDepth)) {
    params.push('relationsDepth=' + options.relationsDepth)
  }

  if (options.relations) {
    if (Utils.isArray(options.relations)) {
      const loadRelations = options.relations.length ? Utils.encodeArrayToUriComponent(options.relations) : '*'
      params.push('loadRelations=' + loadRelations)
    }
  }

  return params.join('&')
}
