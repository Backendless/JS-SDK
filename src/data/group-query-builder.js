import Utils from '../utils'

import DataQueryBuilder, { PAGING_DEFAULTS } from './data-query-builder'

export default class GroupQueryBuilder extends DataQueryBuilder {
  constructor() {
    super()

    this.groupPageSize = PAGING_DEFAULTS.pageSize
    this.recordsPageSize = PAGING_DEFAULTS.pageSize

    this.groupDepth = null
    this.groupPath = null
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

  getGroupPath() {
    return this.groupPath
  }

  addGroupPath(groupPath) {
    this.groupPath = (this.groupPath || []).concat(groupPath)

    return this
  }

  setGroupPath(groupPath) {
    this.groupPath = Utils.castArray(groupPath)

    return this
  }

  toJSON() {
    const result = super.toJSON()

    result.groupDepth = this.getGroupDepth()
    result.groupPath = this.getGroupPath()
    result.groupPageSize = this.getGroupPageSize()
    result.recordsPageSize = this.getRecordsPageSize()

    return result
  }
}


