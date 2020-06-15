
export class OpResultValueReference {
  constructor(opResult, { resultIndex, propName }) {
    this.opResult = opResult
    this.resultIndex = resultIndex
    this.propName = propName
  }

  getTableName() {
    return this.opResult.getTableName()
  }

  toJSON() {
    const result = this.opResult.toJSON()

    if (this.resultIndex !== undefined) {
      result.resultIndex = this.resultIndex
    }

    if (this.propName !== undefined) {
      result.propName = this.propName
    }

    if (!result.propName && this.opResult.isFindRef()) {
      result.propName = 'objectId'
    }

    return result
  }
}
