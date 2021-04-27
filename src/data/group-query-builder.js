import Utils from '../utils'

const PAGING_DEFAULTS = {
  pageSize: 1,
  offset  : 0
}

export default class GroupQueryBuilder {

  static create() {
    return new this()
  }

  constructor() {
    this.pageSize = 3
    this.groupPageSize = 4
    this.offset = PAGING_DEFAULTS.offset
    this.recordsPageSize = 2
    this.groupDepth = null
    this.sortBy = null
    this.where = null
    this.groupBy = null
    this.distinct = null
    this.excludeProps = null
    this.properties = null
    this.loadRelations = null
    this.relationsDepth = null
    this.relationsPageSize = null
    this.groupPath = null

  }

  //   {
  //     "groupPath": [ // Identifies "root" group for which pagination of children is performed.
  //     {
  //       "column": String
  //       "value": mixed
  //     }
  //     ...
  //   ]
  //   }
  // }

  //=======================================

  //=======================================
  setPageSize(pageSize) {
    if (pageSize <= 0) {
      throw new Error('Page size must be a positive value.')
    }

    this.pageSize = pageSize

    return this
  }

  getPageSize() {
    return this.pageSize
  }

  setGroupPageSize(groupPageSize) {
    if (groupPageSize <= 0) {
      throw new Error('Group page size must be a positive value.')
    }

    this.groupPageSize = groupPageSize

    return this
  }

  getGroupPageSize() {
    return this.groupPageSize
  }

  setRecordsPageSize(recordsPageSize) {
    if (recordsPageSize <= 0) {
      throw new Error('Records page size must be a positive value.')
    }

    this.recordsPageSize = recordsPageSize

    return this
  }

  getRecordsPageSize() {
    return this.recordsPageSize
  }

  setGroupDepth(groupDepth) {
    if (groupDepth < 0) {
      throw new Error('Group depth cannot have a negative value.')
    }

    this.groupDepth = groupDepth

    return this
  }

  getGroupDepth() {
    return this.groupDepth
  }

  setOffset(offset) {
    if (offset < 0) {
      throw new Error('Offset cannot have a negative value.')
    }

    this.offset = offset

    return this
  }

  getOffset() {
    return this.offset
  }

  prepareNextPage() {
    this.setOffset(this.offset + this.pageSize)

    return this
  }

  preparePreviousPage() {
    this.setOffset(Math.max(this.offset - this.pageSize, 0))

    return this
  }

  setProperties(properties) {
    this.properties = Utils.castArray(properties)

    return this
  }

  getProperties() {
    return this.properties
  }

  addProperty(prop) {
    // this.properties = this.properties || []
    // this.properties.push(prop)
    this.properties = prop
    return this
  }

  addProperties(...properties) {
    properties.forEach(p => {
      Utils.castArray(p).forEach(property => this.addProperty(property))
    })

    return this
  }

  addAllProperties() {
    this.addProperty('*')

    return this
  }

  excludeProperty(property) {
    this.excludeProps = this.excludeProps || []
    this.excludeProps.push(property)

    return this
  }

  excludeProperties(...properties) {
    properties.forEach(p => {
      Utils.castArray(p).forEach(property => this.excludeProperty(property))
    })

    return this
  }

  getExcludeProperties() {
    return this.excludeProps
  }

  setWhereClause(whereClause) {
    this.where = whereClause

    return this
  }

  getWhereClause() {
    return this.where
  }

  getSortBy() {
    return this.sortBy
  }

  setSortBy(sortBy) {
    this.sortBy = Utils.castArray(sortBy)

    return this
  }

  getGroupBy() {
    return this.groupBy
  }

  setGroupPath(groupPath) {
    this.groupPath = Utils.castArray(groupPath)

    return this
  }

  getGroupPath() {
    return this.groupPath
  }

  setGroupBy(groupBy) {
    this.groupBy = Utils.castArray(groupBy)

    return this
  }

  getRelated() {
    return this.loadRelations
  }

  setRelated(relations) {
    // this.relations = Utils.castArray(relations)
    this.loadRelations = relations

    return this
  }

  //refactor me HERE WROND TODO
  addRelated(relations) {
    this.loadRelations = (this.loadRelations || '') + relations

    return this
  }

  setRelationsDepth(relationsDepth) {
    this.relationsDepth = relationsDepth

    return this
  }

  getRelationsDepth() {
    return this.relationsDepth
  }

  setRelationsPageSize(relationsPageSize) {
    this.relationsPageSize = relationsPageSize

    return this
  }

  getRelationsPageSize() {
    return this.relationsPageSize
  }

  setDistinct(distinct) {
    if (typeof distinct !== 'boolean') {
      throw new Error('Distinct must be a boolean value.')
    }

    this.distinct = distinct

    return this
  }

  getDistinct() {
    return this.distinct
  }

  //mb no needed

  // toJSON() {
  //   console.log(' Called ')
  //   return {
  //     pageSize: this.pageSize,
  //     offset  : this.offset,
  //
  //     properties  : this.properties,
  //     excludeProps: this.excludeProps,
  //
  //     where: this.where,
  //
  //     sortBy : this.sortBy,
  //     groupBy: this.groupBy,
  //
  //     relations        : this.relations,
  //     relationsDepth   : this.relationsDepth,
  //     relationsPageSize: this.relationsPageSize,
  //   }
  // }

  //mb no needed
  // static toQueryString(query) {
  //   if (!query) {
  //     return
  //   }
  //
  //   if (query instanceof GroupQueryBuilder) {
  //     query = query.toJSON()
  //   }
  //
  //   const queryTokens = []
  //
  //   if (query.pageSize > 0) {
  //     queryTokens.push(`pageSize=${query.pageSize}`)
  //   }
  //
  //   if (query.offset > 0) {
  //     queryTokens.push(`offset=${query.offset}`)
  //   }
  //
  //   if (Array.isArray(query.properties) && query.properties.length) {
  //     query.properties.map(property => {
  //       queryTokens.push(`property=${encodeURIComponent(property)}`)
  //     })
  //   }
  //
  //   if (Array.isArray(query.excludeProps) && query.excludeProps.length) {
  //     queryTokens.push(`excludeProps=${encodeArrayToUriComponent(query.excludeProps)}`)
  //   }
  //
  //   if (query.where) {
  //     queryTokens.push(`where=${encodeURIComponent(query.where)}`)
  //   }
  //
  //   if (query.having) {
  //     queryTokens.push(`having=${encodeURIComponent(query.having)}`)
  //   }
  //
  //   if (query.sortBy) {
  //     queryTokens.push(
  //       Array.isArray(query.sortBy)
  //         ? `sortBy=${encodeArrayToUriComponent(query.sortBy)}`
  //         : `sortBy=${encodeURIComponent(query.sortBy)}`
  //     )
  //   }
  //
  //   if (query.groupBy) {
  //     queryTokens.push(
  //       Array.isArray(query.groupBy)
  //         ? `groupBy=${encodeArrayToUriComponent(query.groupBy)}`
  //         : `groupBy=${encodeURIComponent(query.groupBy)}`
  //     )
  //   }
  //
  //   if (Array.isArray(query.relations)) {
  //     queryTokens.push(
  //       query.relations.length
  //         ? `loadRelations=${encodeArrayToUriComponent(query.relations)}`
  //         : 'loadRelations=*'
  //     )
  //   }
  //
  //   if (query.relationsDepth > 0) {
  //     queryTokens.push(`relationsDepth=${query.relationsDepth}`)
  //   }
  //
  //   if (query.relationsPageSize > 0) {
  //     queryTokens.push(`relationsPageSize=${query.relationsPageSize}`)
  //   }
  //
  //   return queryTokens.join('&')
  // }
}

function encodeArrayToUriComponent(items) {
  return items.map(item => encodeURIComponent(item)).join(',')
}


