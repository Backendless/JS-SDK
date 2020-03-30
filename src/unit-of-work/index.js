import Utils from '../utils'
import DataQueryBuilder from '../data/query-builder'

import { OperationType, IsolationLevelEnum } from './constants'
import { OpResult } from './op-result'
import { OpResultValueReference } from './op-result-value-reference'

class TransactionOperationError extends Error {
  constructor(message, operation) {
    super(message)

    this.operation = operation
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

  constructor(isolationLevelEnum, app) {
    this.app = app

    this.payload = {
      isolationLevelEnum,
      operations: []
    }

    this.usedOpIds = {}
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

    if (result.results) {
      this.payload.operations.forEach(operation => {
        const opResultId = operation.meta.opResult.getOpResultId()

        if (results[opResultId]) {
          operation.meta.opResult.setResult(result.results[opResultId].result)
        }
      })
    }

    if (result.error) {
      const operation = this.payload.operations.find(op => {
        return error.operation.opResultId === op.meta.opResult.getOpResultId()
      })

      result.error = new TransactionOperationError(result.error.message, operation.meta.opResult)

      operation.meta.opResult.setError(result.error)
    }

    return new UnitOfWorkResult(result)
  }

  find(tableName, queryBuilder) {
    const query = (queryBuilder instanceof DataQueryBuilder)
      ? queryBuilder.toJSON()
      : queryBuilder

    const payload = {
      queryOptions: {}
    }

    if (query.pageSize > 0) {
      payload.pageSize = query.pageSize
    }

    if (query.offset > 0) {
      payload.offset = query.offset
    }

    if (query.props) {
      payload.properties = query.props
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

    if (query.loadRelations) {
      payload.queryOptions.related = query.loadRelations
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

    if (typeof tableName !== 'string') {
      throw new Error('Invalid arguments')
    }

    return this.addOperations(OperationType.CREATE, tableName, changes)
  }

  /**
   * update(object: object): OpResult;
   * update(tableName: string, object: object): OpResult;
   * update(opResult: OpResult | OpResultValueReference, object: object): OpResult;
   * update(opResult: OpResult | OpResultValueReference, propertyName: string, propertyValue: object): OpResult;
   * update(index: number, changesObj: object): OpResult;
   * update(index: number, propertyName: string, propertyValueObj: object): OpResult;
   * **/
  update(...args) {
    let tableName
    let payload

    if (args.length === 1) {
      tableName = Utils.getClassName(args[0])
      payload = args[0]

    } else if (typeof args[0] === 'string') {
      tableName = args[0]
      payload = args[1]

    } else if (args[0] instanceof OpResult || args[0] instanceof OpResultValueReference) {
      tableName = args[0].getTableName()

      payload = {
        objectId: args[0]
      }

      if (args.length === 3) {
        payload[args[1]] = args[2]

      } else if (args.length === 2) {
        payload = { ...payload, ...args[1] }

      } else {
        throw new Error('Invalid arguments')
      }

    } else {
      throw new Error('Invalid arguments')
    }

    if (typeof tableName !== 'string') {
      throw new Error('Invalid tableName')
    }

    return this.addOperations(OperationType.UPDATE, tableName, payload)
  }

  /**
   * delete(object: object): OpResult;
   * delete(opResult: OpResult): OpResult;
   * delete(index: number): OpResult;
   * delete(tableName: string, object: object): OpResult;
   * delete(tableName: string, objectId: string): OpResult;
   * **/
  delete(tableName, object) {
    if (tableName && typeof tableName === 'object') {
      object = tableName
      tableName = Utils.getClassName(tableName)
    }

    let objectId = object

    if (object && typeof object === 'object') {
      objectId = object.objectId
    }

    return this.addOperations(OperationType.DELETE, tableName, objectId)
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

    return this.addOperations(OperationType.CREATE_BULK, tableName, objects)
  }

  /**
   * bulkUpdate(whereClause: string, object: object): OpResult;
   * bulkUpdate(tableName: string, whereClause: string, changesObj: object): OpResult;
   * bulkUpdate(tableName: string, objectIds: string[], changesObj: object): OpResult;
   * bulkUpdate(tableName: string, objects: object[], changesObj: object): OpResult;
   * bulkUpdate(opResult: OpResult, changesObj: object): OpResult;
   * **/
  bulkUpdate(...args) {
    let tableName

    const payload = {}

    if (typeof args[0] === 'string') {
      if (args.length === 3) {
        tableName = args[0]
        payload.changes = args[2]

        if (typeof args[1] === 'string') {
          payload.conditional = args[1]
        } else if (Array.isArray(args[1])) {
          payload.unconditional = args[1].map(o => o.objectId || o)
        } else {
          throw new Error('Invalid arguments')
        }
      } else if (args.length === 2) {
        tableName = Utils.getClassName(args[1])

        payload.conditional = args[0]
        payload.changes = args[1]
      } else {
        throw new Error('Invalid arguments')
      }
    } else if (args[0] instanceof OpResult) {
      tableName = args[0].getTableName()

      payload.unconditional = args[0]
      payload.changes = args[1]
    } else {
      throw new Error('Invalid arguments')
    }

    return this.addOperations(OperationType.UPDATE_BULK, tableName, payload)
  }

  /**
   * bulkDelete(opResult: OpResult): OpResult;
   * bulkDelete(objects: object[]): OpResult;
   * bulkDelete(tableName: string, objects: object[]): OpResult;
   * bulkDelete(tableName: string, objectIds: string[]): OpResult;
   * bulkDelete(tableName: string, whereClause: string): OpResult;
   * **/
  bulkDelete(...args) {
    const payload = {}

    let tableName

    if (typeof args[0] === 'string') {
      tableName = args[0]

      if (typeof args[1] === 'string') {
        payload.conditional = args[1]

      } else if (Array.isArray(args[1])) {
        payload.unconditional = args[1].map(o => o.objectId || o)
      } else {
        throw new Error('Invalid arguments')
      }

    } else if (args[0] instanceof OpResult) {
      tableName = args[0].getTableName()
      payload.unconditional = args[0]
    } else if (Array.isArray(args[0])) {
      tableName = Utils.getClassName(args[0][0])
      payload.unconditional = args[0].map(o => o.objectId || o)
    } else {
      throw new Error('Invalid arguments')
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

    if (parentObject) {
      parentObject = parentObject.objectId || parentObject
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

    if (!tableName || typeof tableName !== 'string') {
      throw new Error(
        'Invalid "tableName" parameter, check passed arguments'
      )
    }

    if (!parentObject) {
      throw new Error(
        'Invalid "parentObject" parameter, check passed arguments'
      )
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
    constructor(isolationLevelEnum) {
      super(isolationLevelEnum, app)
    }
  }
}
