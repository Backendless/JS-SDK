import Utils from '../../utils'

export function extractQueryOptions(options) {
  const params = []

  if (typeof options.pageSize !== 'undefined') {
    if (options.pageSize < 1 || options.pageSize > 100) {
      throw new Error('PageSize can not be less then 1 or greater than 100')
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

  if (options.relationsDepth) {
    if (Utils.isNumber(options.relationsDepth)) {
      params.push('relationsDepth=' + Math.floor(options.relationsDepth))
    }
  }

  if (options.relations) {
    if (Utils.isArray(options.relations)) {
      const loadRelations = options.relations.length ? Utils.encodeArrayToUriComponent(options.relations) : '*'
      params.push('loadRelations=' + loadRelations)
    }
  }

  return params.join('&')
}
