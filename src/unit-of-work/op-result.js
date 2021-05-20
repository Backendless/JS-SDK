import { OperationType } from './constants'
import { OpResultValueReference } from './op-result-value-reference'

export class OpResult {

  constructor(uow, { operationType, table, payload }) {
    this.uow = uow

    this.operationType = operationType
    this.table = table
    this.payload = payload

    const stackName = this.uow.getOpStackName(operationType, table)
    const resultIndex = this.uow.getNextOpResultIndex(stackName)

    this.opResultId = `${stackName}${resultIndex}`

    this.result = null
  }

  setResult(result) {
    this.result = result
  }

  getResult() {
    return this.result
  }

  setError(error) {
    this.error = error
  }

  getError() {
    return this.error
  }

  getType() {
    return this.operationType
  }

  isFindRef() {
    return this.operationType === OperationType.FIND
  }

  isCollectionRef() {
    return this.operationType === OperationType.FIND || this.operationType === OperationType.CREATE_BULK
  }

  isObjectRef() {
    return this.operationType === OperationType.CREATE || this.operationType === OperationType.UPDATE
  }

  setOpResultId(opResultId) {
    this.opResultId = opResultId

    return this
  }

  getOpResultId() {
    return this.opResultId
  }

  getTableName() {
    return this.table
  }

  resolveTo(resultIndex, propName) {
    if (typeof resultIndex === 'string') {
      propName = resultIndex
      resultIndex = undefined
    }

    return new OpResultValueReference(this, { resultIndex, propName })
  }

  toJSON() {
    const result = {
      ___ref    : true,
      opResultId: this.opResultId,
    }

    if (this.isObjectRef()) {
      result.propName = 'objectId'
    }

    return result
  }
}

