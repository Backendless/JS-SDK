import Utils from '../utils'

import { PAGING_DEFAULTS } from './data-query-builder'

export default class GroupQueryBuilder {

  static create() {
    return new this()
  }

  constructor() {
    this.offset = PAGING_DEFAULTS.offset
    this.pageSize = PAGING_DEFAULTS.pageSize

    this.groupPageSize = PAGING_DEFAULTS.pageSize
    this.recordsPageSize = PAGING_DEFAULTS.pageSize

    this.groupDepth = null
    this.groupPath = null

    this.groupBy = null
    this.sortBy = null

    this.excludeProps = null
    this.property = null

    this.where = null

    this.loadRelations = null
    this.relationsDepth = null
    this.relationsPageSize = null

    this.distinct = null
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
    this.property = Utils.castArray(properties)
    this.property = properties

    return this
  }

  getProperties() {
    return this.properties
  }

  addProperty(prop) {
    this.property = this.property || []
    this.property.push(prop)

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
    this.loadRelations = Utils.castArray(relations)

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
}


