import { OperationType } from './constants'

export const OperationJSONAdapter = {

  /**
   * create(object: object): OpResult;
   * create(tableName: string, object: object): OpResult;
   * **/
  CREATE: (uow, operation) => {
    const payload = operation.payload
    const args = []

    if (operation.table && !(operation.payload.unconditional && operation.payload.unconditional.___ref)) {
      args.push(operation.table)
    }

    args.push(payload)

    return uow.create.apply(uow, args)
  },

  /**

   * delete(object: object): OpResult;
   * delete(tableName: string, object: object): OpResult;
   * delete(tableName: string, objectId: string): OpResult;
   * **/
  DELETE: (uow, operation) => {
    const payload = operation.payload
    const args = []

    if (operation.table && !(operation.payload.unconditional && operation.payload.unconditional.___ref)) {
      args.push(operation.table)
    }

    if (typeof payload === 'string') {
      args.push(payload)
    } else if (typeof payload === 'object' && payload.___ref) {
      const opResult = uow.getOpResultById(payload.opResultId)

      if (payload.resultIndex !== undefined) {
        let opRes = opResult.resolveTo(payload.resultIndex)
        args.push(opRes)
      } else {
        args.push(opResult)
      }


    }

    return uow.delete.apply(uow, args)
  },

  /**
   * update(object: object): OpResult;
   * update(tableName: string, object: object): OpResult;
   *
   *
   * update(
   *
   *    propertyName: string,
   *    propertyValue: OpResultValueReference): OpResult;
   *
   * update(
   *
   *    propertyName: string,
   *    propertyValue: number | string | boolean): OpResult;
   * **/
  UPDATE: (uow, operation) => {
    const payload = operation.payload
    const args = []

    if (operation.table && !(operation.payload.unconditional && operation.payload.unconditional.___ref)) {
      args.push(operation.table)
    }

    args.push(payload)

    return uow.update.apply(uow, args)
  },

  /**
   * bulkUpdate(opResult: OpResult, changes: object): OpResult;
   *
   * bulkUpdate(tableName: string, whereClause: string, changes: object): OpResult;
   * bulkUpdate(tableName: string, objectIds: string[], changes: object): OpResult;
   * bulkUpdate(tableName: string, objects: object[], changes: object): OpResult;
   * **/
  UPDATE_BULK: (uow, operation) => {
    const payload = operation.payload
    const args = []

    if (operation.table && !(operation.payload.unconditional && operation.payload.unconditional.___ref)) {
      args.push(operation.table)
    }

    if (payload.conditional) {
      args.push(payload.conditional)
    } else if (typeof payload.unconditional === 'object' && payload.unconditional.___ref) {
      const opResult = uow.getOpResultById(payload.unconditional.opResultId)

      args.push(opResult)
    } else {
      args.push(payload.unconditional)
    }

    args.push(payload.changes)

    return uow.bulkUpdate.apply(uow, args)
  },

  /**
   * bulkDelete(objects: object[]): OpResult;
   *
   * bulkDelete(tableName: string, objects: object[]): OpResult;
   * bulkDelete(tableName: string, objectIds: string[]): OpResult;
   * bulkDelete(tableName: string, whereClause: string): OpResult;
   * **/
  DELETE_BULK: (uow, operation) => {
    const payload = operation.payload
    const args = []

    if (operation.table && !(operation.payload.unconditional && operation.payload.unconditional.___ref)) {
      args.push(operation.table)
    }

    if (payload.conditional) {
      args.push(payload.conditional)
    } else if (typeof payload.unconditional === 'object' && payload.unconditional.___ref) {
      const opResult = uow.getOpResultById(payload.unconditional.opResultId)

      args.push(opResult)
    }

    return uow.bulkDelete.apply(uow, args)
  },

  /**
   * bulkCreate(tableName: string, objects: object[]): OpResult;
   * bulkCreate(objects: object[]): OpResult;
   * **/
  CREATE_BULK: (uow, operation) => {
    const payload = operation.payload
    const args = []

    if (operation.table && !(operation.payload.unconditional && operation.payload.unconditional.___ref)) {
      args.push(operation.table)
    }

    args.push(payload)

    return uow.bulkCreate.apply(uow, args)
  },

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
  SET_RELATION: (uow, operation) => {
    const payload = operation.payload
    const args = []

    if (operation.table) {
      args.push(operation.table)
    }

    if (typeof payload.parentObject === 'string') {
      args.push({ objectId: payload.parentObject })
    } else {
      args.push(payload.parentObject)
    }

    args.push(payload.relationColumn)

    if (payload.conditional) {
      args.push(payload.conditional)
    } else {
      let opRes

      if (Array.isArray(payload.unconditional)) {
        opRes = payload.unconditional.map(item => {

          if (item.___ref) {
            const opResult = uow.getOpResultById(item.opResultId)

            if (item.resultIndex !== undefined) {
              return opResult.resolveTo(item.resultIndex)
            }

            return opResult
          }

          return item
        })
      } else if (typeof payload.unconditional === 'object' && payload.unconditional.___ref) {
        const opResult = uow.getOpResultById(payload.unconditional.opResultId)

        opRes = opResult
      }

      args.push(opRes)
    }

    return uow.setRelation.apply(uow, args)
  },

  DELETE_RELATION: (uow, operation) => {
    const payload = operation.payload
    const args = []

    if (operation.table) {
      args.push(operation.table)
    }

    if (typeof payload.parentObject === 'string') {
      args.push({ objectId: payload.parentObject })
    } else {
      args.push(payload.parentObject)
    }

    args.push(payload.relationColumn)

    if (payload.conditional) {
      args.push(payload.conditional)
    } else {
      let opRes

      if (Array.isArray(payload.unconditional)) {
        opRes = payload.unconditional.map(item => {

          if (item.___ref) {
            const opResult = uow.getOpResultById(item.opResultId)

            if (item.resultIndex !== undefined) {
              return opResult.resolveTo(item.resultIndex)
            }

            return opResult
          }

          return item
        })
      } else if (typeof payload.unconditional === 'object' && payload.unconditional.___ref) {

        const opResult = uow.getOpResultById(payload.unconditional.opResultId)

        opRes = opResult

      }

      args.push(opRes)

    }

    return uow.deleteRelation.apply(uow, args)

  },

  ADD_RELATION: (uow, operation) => {
    const payload = operation.payload
    const args = []

    if (operation.table) {
      args.push(operation.table)
    }

    if (typeof payload.parentObject === 'string') {
      args.push({ objectId: payload.parentObject })
    } else {
      args.push(payload.parentObject)
    }

    args.push(payload.relationColumn)

    if (payload.conditional) {
      args.push(payload.conditional)
    } else {
      let opRes

      if (Array.isArray(payload.unconditional)) {
        opRes = payload.unconditional.map(item => {

          if (item.___ref) {
            const opResult = uow.getOpResultById(item.opResultId)

            if (item.resultIndex !== undefined) {
              return opResult.resolveTo(item.resultIndex)
            }

            return opResult
          }

          return item
        })
      } else if (typeof payload.unconditional === 'object' && payload.unconditional.___ref) {
        const opResult = uow.getOpResultById(payload.unconditional.opResultId)

        opRes = opResult
      }

      args.push(opRes)
    }

    return uow.addToRelation.apply(uow, args)
  },

  FIND: (uow, operation) => (
    uow.addOperations(OperationType.FIND, operation.table, operation.payload)
  ),
}