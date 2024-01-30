import Utils from '../utils'
import DataQueryBuilder from '../data/data-query-builder'

import { OperationType, IsolationLevelEnum } from './constants'
import { OperationJSONAdapter } from './json-adapter'
import { OpResult } from './op-result'
import { OpResultValueReference } from './op-result-value-reference'

class TransactionOperationError extends Error {
  constructor(error, operation) {
    super(error.message)

    this.code = error.code
    this.operation = operation
  }

  toJSON() {
    return {
      message  : this.message,
      operation: this.operation,
    }
  }
}

class UnitOfWorkResult {
  constructor({ success, error, results }) {
    this.success = success
    this.error = error
    this.results = results
  }

  isSuccess() {
    return this.success
  }

  getError() {
    return this.error
  }

  getResults() {
    return this.results
  }
}

class UnitOfWork {
  static IsolationLevelEnum = IsolationLevelEnum

  static OpResult = OpResult

  static OpResultValueReference = OpResultValueReference

  constructor(isolationLevelEnum, app) {
    this.app = app

    this.payload = {
      isolationLevelEnum,
      operations: []
    }

    this.usedOpIds = {}
  }

  getOpResultById(opResultId) {
    const operation = this.payload.operations.find(opResult => opResult.meta.opResult.getOpResultId() === opResultId)

    return operation.meta.opResult
  }

  setIsolationLevel(isolationLevelEnum) {
    this.payload.isolationLevelEnum = isolationLevelEnum
  }

  getOpStackName(operationType, table) {
    return `${operationType.toLowerCase()}${table}`
  }

  getNextOpResultIndex(stackName) {
    if (!this.usedOpIds[stackName]) {
      this.usedOpIds[stackName] = 0
    }

    return ++this.usedOpIds[stackName]
  }

  addOperations(operationType, table, payload) {
    if (Array.isArray(payload)) {
      payload = payload.map(item => {
        delete item.___jsonclass

        return item
      })
    } else {
      delete payload.___jsonclass
    }

    const opResult = new OpResult(this, { operationType, table, payload })

    this.payload.operations.push({
      operationType,
      table,
      payload,
      meta: {
        opResult
      }
    })

    return opResult
  }

  composePayload() {
    return {
      ...this.payload,
      operations: this.payload.operations.map(({ meta, ...operation }) => {
        return {
          ...operation,
          opResultId: meta.opResult.getOpResultId(),
        }
      })
    }
  }

  async execute() {
    const result = await this.app.request.post({
      url : this.app.urls.transactions(),
      data: this.composePayload(),
    })

    return this.setResult(result)
  }

  setResult(result){
    if (result.results) {
      this.payload.operations.forEach(operation => {
        const opResultId = operation.meta.opResult.getOpResultId()

        if (result.results[opResultId]) {
          operation.meta.opResult.setResult(result.results[opResultId].result)
        }
      })
    }

    if (result.error) {
      const operation = this.payload.operations.find(op => {
        return result.error.operation.opResultId === op.meta.opResult.getOpResultId()
      })

      result.error = new TransactionOperationError(result.error, operation.meta.opResult)

      operation.meta.opResult.setError(result.error)
    }

    return new UnitOfWorkResult(result)
  }

  find(tableName, queryBuilder) {
    const query = (queryBuilder instanceof DataQueryBuilder)
      ? queryBuilder.toJSON()
      : (queryBuilder || {})

    if (!tableName || typeof tableName !== 'string') {
      throw new Error('Invalid arguments')
    }

    if (typeof query !== 'object' || Array.isArray(query)) {
      throw new Error('Invalid arguments')
    }

    const payload = {
      queryOptions: {}
    }

    if (query.pageSize > 0) {
      payload.pageSize = query.pageSize
    }

    if (query.offset > 0) {
      payload.offset = query.offset
    }

    if (query.properties) {
      payload.properties = query.properties
    }

    if (query.excludeProps) {
      payload.excludeProps = query.excludeProps
    }

    if (query.excludeProps) {
      payload.excludeProps = query.excludeProps
    }

    if (query.where) {
      payload.whereClause = query.where
    }

    if (query.having) {
      payload.havingClause = query.having
    }

    if (query.groupBy) {
      payload.groupBy = query.groupBy
    }

    if (query.sortBy) {
      payload.queryOptions.sortBy = query.sortBy
    }

    if (query.relations) {
      payload.queryOptions.related = query.relations
    }

    if (query.relationsDepth) {
      payload.queryOptions.relationsDepth = query.relationsDepth
    }

    if (query.relationsPageSize > 0) {
      payload.queryOptions.relationsPageSize = query.relationsPageSize
    }

    return this.addOperations(OperationType.FIND, tableName, payload)
  }

  /**
   * upsert(object: object): OpResult;
   * upsert(tableName: string, object: object): OpResult;
   * **/
  upsert(...args) {
    let tableName
    let changes

    if (args.length === 1) {
      tableName = Utils.getClassName(args[0])
      changes = args[0]
    } else if (args.length === 2) {
      tableName = args[0]
      changes = args[1]
    } else {
      throw new Error('Invalid arguments')
    }

    if (!tableName || typeof tableName !== 'string') {
      throw new Error('Invalid arguments')
    }

    if (!changes || typeof changes !== 'object' || Array.isArray(changes)) {
      throw new Error('Invalid arguments')
    }

    return this.addOperations(OperationType.UPSERT, tableName, changes)
  }

  /**
   * create(object: object): OpResult;
   * create(tableName: string, object: object): OpResult;
   * **/
  create(...args) {
    let tableName
    let changes

    if (args.length === 1) {
      tableName = Utils.getClassName(args[0])
      changes = args[0]
    } else if (args.length === 2) {
      tableName = args[0]
      changes = args[1]
    } else {
      throw new Error('Invalid arguments')
    }

    if (!tableName || typeof tableName !== 'string') {
      throw new Error('Invalid arguments')
    }

    if (!changes || typeof changes !== 'object' || Array.isArray(changes)) {
      throw new Error('Invalid arguments')
    }

    return this.addOperations(OperationType.CREATE, tableName, changes)
  }

  /**
   * update(object: object): OpResult;
   * update(tableName: string, object: object): OpResult;
   * update(opResult: OpResult | OpResultValueReference, object: object): OpResult;
   *
   * update(
   *    opResult: OpResult | OpResultValueReference,
   *    propertyName: string,
   *    propertyValue: OpResultValueReference): OpResult;
   *
   * update(
   *    opResult: OpResult | OpResultValueReference,
   *    propertyName: string,
   *    propertyValue: number | string | boolean): OpResult;
   * **/
  update(...args) {
    let tableName
    let payload

    if (args.length === 1) {
      tableName = Utils.getClassName(args[0])
      payload = args[0]

    } else if (args.length === 2 && typeof args[0] === 'string') {
      tableName = args[0]
      payload = args[1]

    } else if (args[0] instanceof OpResult || args[0] instanceof OpResultValueReference) {
      tableName = args[0].getTableName()

      payload = {
        objectId: args[0]
      }

      if (args.length === 3 && typeof args[1] === 'string') {
        payload[args[1]] = args[2]

      } else if (args.length === 2) {
        payload = { ...payload, ...args[1] }

      } else {
        throw new Error('Invalid arguments')
      }

    } else {
      throw new Error('Invalid arguments')
    }

    if (!tableName || typeof tableName !== 'string') {
      throw new Error('Invalid arguments')
    }

    return this.addOperations(OperationType.UPDATE, tableName, payload)
  }

  /**
   * delete(opResult: OpResult | OpResultValueReference): OpResult;
   * delete(object: object): OpResult;
   * delete(tableName: string, object: object): OpResult;
   * delete(tableName: string, objectId: string): OpResult;
   * **/
  delete(...args) {
    let tableName
    let object

    if (args.length === 1) {
      if (args[0] instanceof OpResult || args[0] instanceof OpResultValueReference) {
        tableName = args[0].getTableName()
        object = args[0]

      } else if (args[0] && typeof args[0] === 'object' && !Array.isArray(args[0])) {
        tableName = Utils.getClassName(args[0])
        object = args[0].objectId
      }

    } else if (args.length === 2) {
      tableName = args[0]
      object = args[1] && args[1].objectId || args[1]

    } else {
      throw new Error('Invalid arguments')
    }

    if (!object || Array.isArray(object) || (typeof object !== 'string' && typeof object !== 'object')) {
      throw new Error('Invalid arguments')
    }

    if (!tableName || typeof tableName !== 'string') {
      throw new Error('Table Name must be a string.')
    }

    return this.addOperations(OperationType.DELETE, tableName, object)
  }

  /**
   * bulkUpsert(tableName: string, objects: object[]): OpResult;
   * bulkUpsert(objects: object[]): OpResult;
   * **/
  bulkUpsert(tableName, objects) {
    if (Array.isArray(tableName)) {
      objects = tableName
      tableName = Utils.getClassName(objects[0])
    }

    if (!objects || !Array.isArray(objects)) {
      throw new Error('Objects must be an array of objects.')
    }

    if (!tableName || typeof tableName !== 'string') {
      throw new Error('Table Name must be a string.')
    }

    return this.addOperations(OperationType.UPSERT_BULK, tableName, objects)
  }

  /**
   * bulkCreate(tableName: string, objects: object[]): OpResult;
   * bulkCreate(objects: object[]): OpResult;
   * **/
  bulkCreate(tableName, objects) {
    if (Array.isArray(tableName)) {
      objects = tableName
      tableName = Utils.getClassName(objects[0])
    }

    if (!objects || !Array.isArray(objects)) {
      throw new Error('Objects must be an array of objects.')
    }

    if (!tableName || typeof tableName !== 'string') {
      throw new Error('Table Name must be a string.')
    }

    return this.addOperations(OperationType.CREATE_BULK, tableName, objects)
  }

  /**
   * bulkUpdate(opResult: OpResult, changes: object): OpResult;
   *
   * bulkUpdate(tableName: string, whereClause: string, changes: object): OpResult;
   * bulkUpdate(tableName: string, objectIds: string[], changes: object): OpResult;
   * bulkUpdate(tableName: string, objects: object[], changes: object): OpResult;
   * **/
  bulkUpdate(...args) {
    let tableName

    const payload = {}

    if (args.length === 2) {
      payload.changes = args[1]

      if (typeof args[0] === 'string') {
        tableName = Utils.getClassName(args[1])
        payload.conditional = args[0]

      } else if (args[0] instanceof OpResult) {
        tableName = args[0].getTableName()
        payload.unconditional = args[0]
      }

    } else if (args.length === 3) {
      tableName = args[0]
      payload.changes = args[2]

      if (typeof args[1] === 'string') {
        payload.conditional = args[1]
      } else if (Array.isArray(args[1])) {
        payload.unconditional = args[1].map(o => o.objectId || o)
      } else {
        throw new Error('Invalid arguments')
      }

    } else {
      throw new Error('Invalid arguments')
    }

    if (!tableName || typeof tableName !== 'string') {
      throw new Error('Table Name must be a string.')
    }

    return this.addOperations(OperationType.UPDATE_BULK, tableName, payload)
  }

  /**
   * bulkDelete(opResult: OpResult): OpResult;
   * bulkDelete(objects: object[]): OpResult;
   *
   * bulkDelete(tableName: string, objects: object[]): OpResult;
   * bulkDelete(tableName: string, objectIds: string[]): OpResult;
   * bulkDelete(tableName: string, whereClause: string): OpResult;
   * **/
  bulkDelete(...args) {
    const payload = {}

    let tableName

    if (args.length === 1) {
      if (args[0] instanceof OpResult) {
        tableName = args[0].getTableName()
        payload.unconditional = args[0]
      } else if (Array.isArray(args[0])) {
        tableName = Utils.getClassName(args[0][0])
        payload.unconditional = args[0].map(o => o.objectId)
      } else {
        throw new Error('Invalid arguments')
      }

    } else if (args.length === 2) {
      tableName = args[0]

      if (typeof args[1] === 'string') {
        payload.conditional = args[1]
      } else if (Array.isArray(args[1])) {
        payload.unconditional = args[1].map(o => o.objectId || o)
      } else {
        throw new Error('Invalid arguments')
      }

    } else {
      throw new Error('Invalid arguments')
    }

    if (!tableName || typeof tableName !== 'string') {
      throw new Error('Table Name must be a string.')
    }

    return this.addOperations(OperationType.DELETE_BULK, tableName, payload)
  }

  addToRelation(...args) {
    return this.relationsOperation(OperationType.ADD_RELATION, args)
  }

  setRelation(...args) {
    return this.relationsOperation(OperationType.SET_RELATION, args)
  }

  deleteRelation(...args) {
    return this.relationsOperation(OperationType.DELETE_RELATION, args)
  }

  /**
   *
   *  uow.[...]Relation(
   *      parentObject: OpResult|OpResultValue|Class,
   *      columnName: String,
   *      children: String|Class|OpResult|OpResultValue|List<String|Class|OpResult|OpResultValue>
   *    )
   *
   *  uow.[...]Relation(
   *      tableName: String,
   *      parentObject: String|Class|Object,
   *      columnName: String,
   *      children: String|Class|OpResult|OpResultValue|List<String|Class|OpResult|OpResultValue>
   *    )
   *
   * */
  relationsOperation(operationType, args) {
    let tableName
    let relationColumn
    let parentObject
    let conditional
    let unconditional
    let children

    if (args.length === 3) {
      parentObject = args[0]
      relationColumn = args[1]
      children = args[2]

      if (parentObject instanceof OpResult || parentObject instanceof OpResultValueReference) {
        tableName = parentObject.getTableName()
      } else if (parentObject && typeof parentObject === 'object') {
        tableName = Utils.getClassName(parentObject)
      } else {
        throw new Error(
          'Invalid the first argument, it must be an instance of [OpResult|OpResultValueReference|Object]'
        )
      }

    } else if (args.length === 4) {
      tableName = args[0]
      relationColumn = args[2]
      children = args[3]

      if (typeof args[1] === 'string') {
        parentObject = args[1]
      } else if (args[1] && typeof args[1] === 'object') {
        parentObject = args[1]
      } else {
        throw new Error('Invalid the second argument, it must be an Object or objectId')
      }
    } else {
      throw new Error('Invalid arguments')
    }

    if (parentObject && parentObject.objectId) {
      parentObject = parentObject.objectId
    }

    if (typeof children === 'string') {
      conditional = children

    } else if (children instanceof OpResult && children.isCollectionRef()) {
      unconditional = children
    } else {
      if (!Array.isArray(children)) {
        children = [children]
      }

      unconditional = children.map(child => {
        if (child) {
          if (child instanceof OpResult || child instanceof OpResultValueReference) {
            return child
          }

          if (typeof child === 'string') {
            return child
          }

          if (child.objectId) {
            return child.objectId
          }
        }

        throw new Error(
          'Invalid child argument, it must be an instance of [OpResult|OpResultValueReference|Object] or objectId'
        )
      })
    }

    if (!relationColumn || typeof relationColumn !== 'string') {
      throw new Error(
        'Invalid "relationColumn" parameter, check passed arguments'
      )
    }

    if (!unconditional && !conditional) {
      throw new Error(
        'Neither "unconditional" nor "conditional" parameter is specified, check passed arguments'
      )
    }

    if (!tableName || typeof tableName !== 'string') {
      throw new Error('Table Name must be a string.')
    }

    const payload = {
      parentObject,
      relationColumn
    }

    if (conditional) {
      payload.conditional = conditional
    } else {
      payload.unconditional = unconditional
    }

    return this.addOperations(operationType, tableName, payload)
  }

}

export default function UnitOfWorkService(app) {
  return class extends UnitOfWork {
    static initFromJSON(data) {
      const uow = new this(data.transactionIsolation)

      data.operations.forEach(op => {
        const opResult = OperationJSONAdapter[op.operationType](uow, op)

        opResult.setOpResultId(op.opResultId)
      })

      return uow
    }

    constructor(isolationLevelEnum) {
      super(isolationLevelEnum, app)
    }
  }
}
