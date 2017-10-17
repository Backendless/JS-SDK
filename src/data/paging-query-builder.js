const PAGING_DEFAULTS = {
  pageSize: 10,
  offset  : 0
}

export default class DataPagingQueryBuilder {

  constructor() {
    this.offset = PAGING_DEFAULTS.offset
    this.pageSize = PAGING_DEFAULTS.pageSize
  }

  setPageSize(pageSize) {
    if (pageSize <= 0) {
      return 'Page size must be a positive value.'
    }

    this.pageSize = pageSize

    return this
  }

  setOffset(offset) {
    if (offset < 0) {
      throw new Error('Offset cannot have a negative value.')
    }

    this.offset = offset

    return this
  }

  prepareNextPage() {
    this.setOffset(this.offset + this.pageSize)

    return this
  }

  preparePreviousPage() {
    const newOffset = this.offset > this.pageSize ? this.offset - this.pageSize : 0

    this.setOffset(newOffset)

    return this
  }

  build() {
    return {
      pageSize: this.pageSize,
      offset  : this.offset
    }
  }
}
