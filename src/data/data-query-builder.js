import Utils from '../utils'

const PAGING_DEFAULTS = {
  pageSize: 10,
  offset  : 0
}

export default class DataQueryBuilder {

  static create() {
    return new this()
  }

  constructor() {
    this.offset = PAGING_DEFAULTS.offset
    this.pageSize = PAGING_DEFAULTS.pageSize

    this.sortBy = null
    this.groupBy = null

    this.properties = null
    this.excludeProps = null

    this.whereClause = null
    this.havingClause = null

    this.loadRelations = null
    this.relationsDepth = null
    this.relationsPageSize = null
  }

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

  getProperties() {
    return this.properties
  }

  setProperties(properties) {
    this.properties = Utils.castArray(properties)

    return this
  }

  addProperty(prop) {
    this.properties = this.properties || []
    this.properties.push(prop)

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

  getWhereClause() {
    return this.whereClause
  }

  setWhereClause(whereClause) {
    this.whereClause = whereClause

    return this
  }

  getHavingClause() {
    return this.havingClause
  }

  setHavingClause(havingClause) {
    this.havingClause = havingClause

    return this
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

  setGroupBy(groupBy) {
    this.groupBy = Utils.castArray(groupBy)

    return this
  }

  getRelated() {
    return this.relations
  }

  setRelated(relations) {
    this.relations = Utils.castArray(relations)

    return this
  }

  addRelated(relations) {
    this.relations = (this.relations || []).concat(relations)

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

  toJSON() {
    return {
      pageSize: this.pageSize,
      offset  : this.offset,

      properties  : this.properties,
      excludeProps: this.excludeProps,

      where : this.whereClause,
      having: this.havingClause,

      sortBy : this.sortBy,
      groupBy: this.groupBy,

      relations        : this.relations,
      relationsDepth   : this.relationsDepth,
      relationsPageSize: this.relationsPageSize,
    }
  }

  static toQueryString(query) {
    if (!query) {
      return
    }

    if (query instanceof DataQueryBuilder) {
      query = query.toJSON()
    }

    const queryTokens = []

    if (query.pageSize > 0) {
      queryTokens.push(`pageSize=${query.pageSize}`)
    }

    if (query.offset > 0) {
      queryTokens.push(`offset=${query.offset}`)
    }

    if (Array.isArray(query.properties) && query.properties.length) {
      query.properties.map(property => {
        queryTokens.push(`property=${encodeURIComponent(property)}`)
      })
    }

    if (Array.isArray(query.excludeProps) && query.excludeProps.length) {
      queryTokens.push(`excludeProps=${encodeArrayToUriComponent(query.excludeProps)}`)
    }

    if (query.where) {
      queryTokens.push(`where=${encodeURIComponent(query.where)}`)
    }

    if (query.having) {
      queryTokens.push(`having=${encodeURIComponent(query.having)}`)
    }

    if (query.sortBy) {
      queryTokens.push(
        Array.isArray(query.sortBy)
          ? `sortBy=${encodeArrayToUriComponent(query.sortBy)}`
          : `sortBy=${encodeURIComponent(query.sortBy)}`
      )
    }

    if (query.groupBy) {
      queryTokens.push(
        Array.isArray(query.groupBy)
          ? `groupBy=${encodeArrayToUriComponent(query.groupBy)}`
          : `groupBy=${encodeURIComponent(query.groupBy)}`
      )
    }

    if (Array.isArray(query.relations)) {
      queryTokens.push(
        query.relations.length
          ? `loadRelations=${encodeArrayToUriComponent(query.relations)}`
          : 'loadRelations=*'
      )
    }

    if (query.relationsDepth > 0) {
      queryTokens.push(`relationsDepth=${query.relationsDepth}`)
    }

    if (query.relationsPageSize > 0) {
      queryTokens.push(`relationsPageSize=${query.relationsPageSize}`)
    }

    return queryTokens.join('&')
  }
}

function encodeArrayToUriComponent(items) {
  return items.map(item => encodeURIComponent(item)).join(',')
}

