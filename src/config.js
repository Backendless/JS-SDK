export default class Config {
  #pageSize

  constructor() {
    this.#pageSize = 100 // default max allowed value
  }

  setPageSize(pageSize) {
    this.#pageSize = pageSize
  }

  getPageSize() {
    return this.#pageSize
  }
}
